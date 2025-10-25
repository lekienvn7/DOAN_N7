import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { addReport, getReports } from "../controllers/reportController.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRoles("Quản lý kho"), addReport);

router.get("/admin", verifyToken, authorizeRoles("Quản lý tổng"), getReports);

export default router;
