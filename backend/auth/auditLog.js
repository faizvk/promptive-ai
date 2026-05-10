import { AuthEvent } from "../model/authEvent.model.js";

const requestMeta = (req) => ({
  ip: req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
  userAgent: req.headers["user-agent"],
});

export const logAuthEvent = async (req, type, payload = {}) => {
  try {
    await AuthEvent.create({
      type,
      ...requestMeta(req),
      ...payload,
    });
  } catch (err) {
    // Auth audit log is best-effort. Never break the auth flow because logging
    // failed.
    console.error("Failed to write AuthEvent:", err.message);
  }
};
