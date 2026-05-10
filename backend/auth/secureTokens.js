import crypto from "crypto";

export const generateRawToken = () =>
  crypto.randomBytes(32).toString("base64url");

export const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");
