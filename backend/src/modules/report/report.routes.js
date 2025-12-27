import express from "express";
import * as reportController from "./report.controller.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Báo cáo tổng hợp theo tháng
router.get("/monthly", reportController.getMonthlyReport);

export default router;
