import express from "express";
import { verifyToken } from "../auth/auth.middleware.js";
import { getDashboardOverview } from "../controller/dashboard.controller.js";

const router = express.Router();

router.get("/overview", verifyToken, getDashboardOverview);

export default router;
