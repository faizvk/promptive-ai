import express from "express";
import { User } from "../model/user.model.js";
import {
  setAuthCookies,
  clearAuthCookies,
  verifyJwt,
  signAccessToken,
} from "../auth/tokens.js";
import { verifyToken } from "../auth/auth.middleware.js";
import { logAuthEvent } from "../auth/auditLog.js";

const router = express.Router();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const normalizeEmail = (raw) =>
  typeof raw === "string" ? raw.trim().toLowerCase() : "";

const isLocked = (user) =>
  Boolean(user.lockUntil && user.lockUntil.getTime() > Date.now());

router.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({ name, email, password });

    setAuthCookies(res, user);
    logAuthEvent(req, "signup", { userId: user._id, email });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Signup failed due to server issue",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // Constant-time-ish: still report failure with the same message.
      logAuthEvent(req, "login_fail", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (isLocked(user)) {
      const minutes = Math.max(
        1,
        Math.ceil((user.lockUntil.getTime() - Date.now()) / 60_000)
      );
      logAuthEvent(req, "login_locked", { userId: user._id, email });
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked due to too many failed attempts. Try again in ${minutes} minute(s).`,
      });
    }

    const passwordOk = await user.comparePassword(password);

    if (!passwordOk) {
      const attempts = (user.loginAttempts || 0) + 1;
      const update = { $set: { loginAttempts: attempts } };

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        update.$set.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        update.$set.loginAttempts = 0;
      }

      await User.updateOne({ _id: user._id }, update);
      logAuthEvent(req, "login_fail", { userId: user._id, email });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Success — reset attempt counter + lockout.
    if (user.loginAttempts || user.lockUntil) {
      await User.updateOne(
        { _id: user._id },
        { $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } }
      );
    }

    setAuthCookies(res, user);
    logAuthEvent(req, "login_success", { userId: user._id, email });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Login failed due to server issue",
    });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    let decoded;
    try {
      decoded = verifyJwt(refreshToken);
    } catch {
      clearAuthCookies(res);
      logAuthEvent(req, "refresh_fail", { meta: { reason: "invalid" } });
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    if (decoded.type !== "refresh") {
      clearAuthCookies(res);
      logAuthEvent(req, "refresh_fail", {
        userId: decoded.id,
        meta: { reason: "wrong_type" },
      });
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || (user.tokenVersion ?? 0) !== (decoded.tokenVersion ?? 0)) {
      clearAuthCookies(res);
      logAuthEvent(req, "refresh_fail", {
        userId: decoded.id,
        meta: { reason: "version_mismatch" },
      });
      return res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
    }

    const accessToken = signAccessToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Refresh error:", err);
    clearAuthCookies(res);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh session",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      try {
        const decoded = verifyJwt(refreshToken);
        await User.updateOne(
          { _id: decoded.id },
          { $inc: { tokenVersion: 1 } }
        );
        logAuthEvent(req, "logout", { userId: decoded.id });
      } catch {
        // Bad/expired token — still clear the cookies.
      }
    }
  } finally {
    clearAuthCookies(res);
    res.status(200).json({ success: true, message: "Logged out" });
  }
});

export default router;
