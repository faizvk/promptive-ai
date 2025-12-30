import express from "express";
import {
  getHistory,
  deleteHistoryItem,
} from "../controller/history.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getHistory);
router.delete("/:type/:id", verifyToken, deleteHistoryItem);

export default router;
