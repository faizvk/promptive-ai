import express from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../model/user.model.js";
import { setAuthCookies } from "../auth/tokens.js";
import { logAuthEvent } from "../auth/auditLog.js";
import {
  BACKEND_URL,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../config/env.js";

const router = express.Router();

const callbackUrl = `${BACKEND_URL}/auth/google/callback`;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  callbackUrl
);

router.get("/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_unavailable`);
  }

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: "google",
        emailVerified: true,
      });
    } else if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const { accessToken, refreshToken } = setAuthCookies(res, user);
    logAuthEvent(req, "oauth_success", { userId: user._id, email });

    // Pass tokens in the URL fragment so they're handed to the frontend
    // without ever hitting the server logs (fragments don't get sent on
    // requests). The frontend reads them on /oauth-success and stores them.
    const params = new URLSearchParams({
      a: accessToken,
      r: refreshToken,
    });
    res.redirect(`${FRONTEND_URL}/oauth-success#${params.toString()}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    logAuthEvent(req, "oauth_fail", {
      meta: { message: error.message },
    });
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;
