import express from "express";
import {
  verifyToken,
  authorizeRoles,
  checkRepositoryAccess,
} from "../../middlewares/authMiddleware.js";
import { getTransaction, addTransaction } from "./transaction.controller.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("Quản lý tổng", "Quản lý kho"),
  getTransaction
);

router.post(
  "/:repoID",
  verifyToken,
  authorizeRoles("Quản lý kho"),
  checkRepositoryAccess,
  addTransaction
);

export default router;
