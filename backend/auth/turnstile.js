import { TURNSTILE_SECRET } from "../config/env.js";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const isEnabled = Boolean(TURNSTILE_SECRET);

if (!isEnabled) {
  console.warn(
    "[turnstile] TURNSTILE_SECRET not set — bot-mitigation middleware is disabled."
  );
}

export const verifyTurnstile = async (req, res, next) => {
  if (!isEnabled) return next();

  const token =
    req.body?.turnstileToken ||
    req.headers["x-turnstile-token"] ||
    req.headers["cf-turnstile-response"];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Captcha is required",
    });
  }

  try {
    const params = new URLSearchParams();
    params.set("secret", TURNSTILE_SECRET);
    params.set("response", String(token));
    if (req.ip) params.set("remoteip", req.ip);

    const verifyRes = await fetch(VERIFY_URL, {
      method: "POST",
      body: params,
      signal: AbortSignal.timeout(10_000),
    });
    const data = await verifyRes.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed",
      });
    }

    next();
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return res.status(503).json({
      success: false,
      message: "Captcha service unavailable",
    });
  }
};
