import express from "express";
import {
  createBorrowRequest,
  approveBorrowRequest,
  getPendingRequests,
  getMyBorrowing,
  rejectBorrowRequest,
  returnBorrow,
} from "./borrowRequest.controller.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createBorrowRequest);

router.get("/pending/", getPendingRequests);

router.patch("/approve", verifyToken, approveBorrowRequest);

router.patch("/reject", verifyToken, rejectBorrowRequest);

router.put("/return/:id", verifyToken, returnBorrow);

router.get("/my-borrowing/:id", getMyBorrowing);

export default router;
