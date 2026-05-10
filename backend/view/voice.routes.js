import express from "express";
import { generateVoice, getVoices } from "../controller/voice.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";
import { enforcePlanLimit } from "../auth/planLimit.js";

const router = express.Router();

router.get("/voices", verifyToken, getVoices);
router.post("/generate", verifyToken, enforcePlanLimit("voice"), generateVoice);

export default router;
