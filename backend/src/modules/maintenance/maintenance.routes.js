import express from "express";
import {
  verifyToken,
  authorizeRoles,
  checkRepositoryAccess,
} from "../../middlewares/authMiddleware.js";
import {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  autoCheckMaintenance,
} from "./maintenance.controller.js";

const router = express.Router();

/**
 * Tạo lịch bảo trì
 * Chỉ "Quản lý bảo trì" được phép thêm mới
 */
router.post(
  "/:repoID",
  verifyToken,
  authorizeRoles("Quản lý bảo trì"),
  addMaintenance
);

/**
 * Cập nhật bảo trì (chi phí, trạng thái, ghi chú)
 * Chỉ "Quản lý bảo trì" được phép cập nhật
 */
router.put(
  "/:repoID/:maintenanceID",
  verifyToken,
  authorizeRoles("Quản lý bảo trì"),
  updateMaintenance
);

/**
 * Lấy danh sách bảo trì
 * "Quản lý tổng" và "Quản lý bảo trì" có quyền xem
 */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Quản lý tổng", "Quản lý bảo trì"),
  getMaintenance
);

/**
 * Cron job / Kiểm tra vật tư sắp đến kỳ bảo trì
 * "Quản lý tổng" và "Quản lý bảo trì" đều có quyền
 */
router.get(
  "/check/upcoming",
  verifyToken,
  authorizeRoles("Quản lý tổng", "Quản lý bảo trì"),
  autoCheckMaintenance
);

export default router;
