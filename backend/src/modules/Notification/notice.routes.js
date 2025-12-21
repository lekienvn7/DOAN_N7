import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "./notice.controller.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markNotificationAsRead);

export default router;
