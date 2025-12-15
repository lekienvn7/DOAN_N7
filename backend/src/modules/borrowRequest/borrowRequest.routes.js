import express from "express";
import {
  createBorrowRequest,
  approveBorrowRequest,
  getPendingRequests,
  getMyBorrowing,
  rejectBorrowRequest,
  returnBorrow,
} from "./borrowRequest.controller.js";

const router = express.Router();

router.post("/", createBorrowRequest);

router.get("/pending/", getPendingRequests);

router.patch("/approve", approveBorrowRequest);

router.patch("/reject", rejectBorrowRequest);

router.patch("/return", returnBorrow);

router.get("/my-borrowing", getMyBorrowing);

export default router;
