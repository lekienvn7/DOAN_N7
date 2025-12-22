import express from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  changePassword,
} from "./user.controller.js";
import {
  verifyToken,
  authorizeRoles,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/", addUser);

router.put(
  "/reset/:id",
  verifyToken,
  authorizeRoles("Quản lý tổng"),
  resetUserPassword
);

router.put("/change-pass/:id", changePassword); // Đổi mật khẩu lần đầu
router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
