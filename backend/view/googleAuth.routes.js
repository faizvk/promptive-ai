import express from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../model/user.model.js";
import { createToken } from "../auth/auth.middleware.js";

const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

/* STEP 1: Redirect to Google */
router.get("/google", (req, res) => {
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

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
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

    // ✅ USE SAME TOKEN FORMAT AS LOCAL LOGIN
    const token = createToken(user);

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;
