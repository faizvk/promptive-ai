import express from "express";
import { User } from "../model/user.model.js";
import { createToken, verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

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

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account wasn't created",
      });
    }

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Signup failed due to server issue",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

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

    const token = createToken(user);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Login failed due to server issue",
    });
  }
});

export default router;
