import express from "express";
import { rewriteContent } from "../controller/rewrite.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";
import { enforcePlanLimit } from "../auth/planLimit.js";

const router = express.Router();

router.post(
  "/rewrite",
  verifyToken,
  enforcePlanLimit("rewrite"),
  rewriteContent
);

export default router;
