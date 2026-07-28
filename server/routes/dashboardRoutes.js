import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// ======================================
// Dashboard Analytics
// ======================================
router.get("/", getDashboardData);

export default router;