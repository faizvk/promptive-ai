import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";

const secret = SECRET_KEY;

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "7d",
      issuer: "promptive-ai",
      algorithm: "HS256",
    }
  );

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export { createToken, verifyToken };
