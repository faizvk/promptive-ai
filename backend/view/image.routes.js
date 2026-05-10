import express from "express";
import { generateImage } from "../controller/image.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";
import { enforcePlanLimit } from "../auth/planLimit.js";

const router = express.Router();

router.post(
  "/generate-image",
  verifyToken,
  enforcePlanLimit("image"),
  generateImage
);

export default router;
