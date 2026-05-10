import express from "express";
import { User } from "../model/user.model.js";
import {
  setAuthCookies,
  clearAuthCookies,
  verifyJwt,
  signAccessToken,
} from "../auth/tokens.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

const normalizeEmail = (raw) =>
  typeof raw === "string" ? raw.trim().toLowerCase() : "";

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

    const user = await User.create({
      name,
      email,
      password,
    });

    setAuthCookies(res, user);

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

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    setAuthCookies(res, user);

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
  res.status(200).json({
    success: true,
    user: req.user,
  });
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
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    if (decoded.type !== "refresh") {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || (user.tokenVersion ?? 0) !== (decoded.tokenVersion ?? 0)) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
    }

    // Re-issue the access cookie. Refresh cookie left as-is so we don't
    // extend the absolute session lifetime on every request.
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
    // Bumping tokenVersion invalidates anything still in flight.
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      try {
        const decoded = verifyJwt(refreshToken);
        await User.updateOne(
          { _id: decoded.id },
          { $inc: { tokenVersion: 1 } }
        );
      } catch {
        // Token unparseable / expired — just clear the cookies.
      }
    }
  } finally {
    clearAuthCookies(res);
    res.status(200).json({ success: true, message: "Logged out" });
  }
});

export default router;
