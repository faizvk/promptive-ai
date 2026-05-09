import express from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../model/user.model.js";
import { createToken } from "../auth/auth.middleware.js";
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

/* STEP 1: Redirect to Google */
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

/* STEP 2: Google Callback */
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
      });
    }

    const token = createToken(user);

    res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;
