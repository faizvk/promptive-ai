import express from "express";
import { rewriteContent } from "../controller/rewrite.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/rewrite", verifyToken, rewriteContent);

export default router;
