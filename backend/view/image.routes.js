import express from "express";
import { generateImage } from "../controller/image.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/generate-image", verifyToken, generateImage);

export default router;
