import jwt from "jsonwebtoken";
import {
  SECRET_KEY,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  COOKIE_SAMESITE,
  COOKIE_SECURE,
} from "../config/env.js";

const ISSUER = "promptive-ai";

const baseClaims = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  tokenVersion: user.tokenVersion ?? 0,
});

export const signAccessToken = (user) =>
  jwt.sign({ ...baseClaims(user), type: "access" }, SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_TTL,
    issuer: ISSUER,
    algorithm: "HS256",
  });

export const signRefreshToken = (user) =>
  jwt.sign({ ...baseClaims(user), type: "refresh" }, SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_TTL,
    issuer: ISSUER,
    algorithm: "HS256",
  });

export const verifyJwt = (token) =>
  jwt.verify(token, SECRET_KEY, { issuer: ISSUER, algorithms: ["HS256"] });

const ttlToMs = (ttl) => {
  // Tiny converter for the common ms strings we use.
  if (typeof ttl === "number") return ttl;
  const match = String(ttl).match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const n = Number(match[1]);
  const unit = match[2];
  return (
    n *
    {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    }[unit]
  );
};

const cookieBase = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAMESITE,
  path: "/",
};

export const setAuthCookies = (res, user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie("access_token", accessToken, {
    ...cookieBase,
    maxAge: ttlToMs(ACCESS_TOKEN_TTL),
  });
  res.cookie("refresh_token", refreshToken, {
    ...cookieBase,
    maxAge: ttlToMs(REFRESH_TOKEN_TTL),
  });

  return { accessToken, refreshToken };
};

export const clearAuthCookies = (res) => {
  res.clearCookie("access_token", { ...cookieBase });
  res.clearCookie("refresh_token", { ...cookieBase });
};
