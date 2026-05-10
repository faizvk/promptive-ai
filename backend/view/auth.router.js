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
import { generateRawToken, hashToken } from "../auth/secureTokens.js";
import { sendMail } from "../config/mailer.js";
import { FRONTEND_URL } from "../config/env.js";

const router = express.Router();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

const normalizeEmail = (raw) =>
  typeof raw === "string" ? raw.trim().toLowerCase() : "";

const isLocked = (user) =>
  Boolean(user.lockUntil && user.lockUntil.getTime() > Date.now());

const issueVerificationToken = async (user) => {
  const raw = generateRawToken();
  user.emailVerificationTokenHash = hashToken(raw);
  user.emailVerificationExpiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS);
  await user.save();
  return raw;
};

const sendVerificationEmail = async (user, rawToken) => {
  const link = `${FRONTEND_URL}/verify-email?token=${rawToken}`;
  await sendMail({
    to: user.email,
    subject: "Verify your Promptive AI email",
    text: `Hi ${user.name || ""},\n\nClick the link below to verify your email address. The link expires in 24 hours.\n\n${link}\n\nIf you didn't sign up, you can safely ignore this email.\n`,
    html: `
      <p>Hi ${user.name || ""},</p>
      <p>Click the button below to verify your email address. The link expires in 24 hours.</p>
      <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#043873;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Verify email</a></p>
      <p>Or paste this URL into your browser:<br><a href="${link}">${link}</a></p>
      <p style="color:#666;font-size:13px">If you didn't sign up, you can safely ignore this email.</p>
    `,
  });
};

const sendResetEmail = async (user, rawToken) => {
  const link = `${FRONTEND_URL}/reset-password?token=${rawToken}`;
  await sendMail({
    to: user.email,
    subject: "Reset your Promptive AI password",
    text: `Hi ${user.name || ""},\n\nClick the link below to reset your password. The link expires in 1 hour.\n\n${link}\n\nIf you didn't request a password reset, you can safely ignore this email.\n`,
    html: `
      <p>Hi ${user.name || ""},</p>
      <p>Click the button below to reset your password. The link expires in 1 hour.</p>
      <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#043873;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset password</a></p>
      <p>Or paste this URL into your browser:<br><a href="${link}">${link}</a></p>
      <p style="color:#666;font-size:13px">If you didn't request a reset, you can safely ignore this email.</p>
    `,
  });
};

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

    // Send verification email (best-effort — don't fail signup on mail error).
    try {
      const rawToken = await issueVerificationToken(user);
      await sendVerificationEmail(user, rawToken);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr.message);
    }

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
        emailVerified: user.emailVerified,
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
        emailVerified: user.emailVerified,
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
  // verifyToken populates req.user from the live record but only with a few
  // fields. Fetch emailVerified too so the frontend can show a banner.
  const user = await User.findById(req.user.id).select(
    "name email role emailVerified"
  );
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      clearAuthCookies(res);
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
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
      return res
        .status(401)
        .json({ success: false, message: "Invalid token type" });
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
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error("Refresh error:", err);
    clearAuthCookies(res);
    return res
      .status(500)
      .json({ success: false, message: "Failed to refresh session" });
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
        // bad token — clear cookies anyway
      }
    }
  } finally {
    clearAuthCookies(res);
    res.status(200).json({ success: true, message: "Logged out" });
  }
});

/* =========================
   Email verification
   ========================= */

router.post("/verify-email/send", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.emailVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email already verified" });
    }

    const rawToken = await issueVerificationToken(user);
    await sendVerificationEmail(user, rawToken);

    res
      .status(200)
      .json({ success: true, message: "Verification email sent" });
  } catch (err) {
    console.error("Resend verify error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to send verification email" });
  }
});

router.get("/verify-email", async (req, res) => {
  const token = req.query.token;
  if (typeof token !== "string" || !token) {
    return res.redirect(`${FRONTEND_URL}/login?error=verification_failed`);
  }

  try {
    const user = await User.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?error=verification_failed`);
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    res.redirect(`${FRONTEND_URL}/dashboard?verified=1`);
  } catch (err) {
    console.error("Verify email error:", err);
    res.redirect(`${FRONTEND_URL}/login?error=verification_failed`);
  }
});

/* =========================
   Password reset
   ========================= */

router.post("/forgot-password", async (req, res) => {
  // Always reply 200 so we don't leak which emails are registered.
  const email = normalizeEmail(req.body.email);
  const okResponse = {
    success: true,
    message:
      "If an account exists for that email, a password reset link has been sent.",
  };

  if (!email) return res.status(400).json({
    success: false,
    message: "Email is required",
  });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json(okResponse);

    const rawToken = generateRawToken();
    user.passwordResetTokenHash = hashToken(rawToken);
    user.passwordResetExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    await sendResetEmail(user, rawToken);
  } catch (err) {
    console.error("Forgot-password error:", err);
    // Still return ok response — don't leak.
  }

  res.status(200).json(okResponse);
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (typeof token !== "string" || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Reset token is required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or expired",
      });
    }

    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // invalidate old sessions
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset-password error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
});

export default router;
