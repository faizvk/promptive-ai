import express from "express";
import {
  listChats,
  getChat,
  deleteChat,
  sendMessage,
  listModels,
} from "../controller/chat.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";
import { enforcePlanLimit } from "../auth/planLimit.js";

const router = express.Router();

router.get("/models", verifyToken, enforcePlanLimit("chat"), listModels);
router.get("/", verifyToken, listChats);
router.get("/:id", verifyToken, getChat);
router.delete("/:id", verifyToken, deleteChat);
router.post("/messages", verifyToken, enforcePlanLimit("chat"), sendMessage);

export default router;
