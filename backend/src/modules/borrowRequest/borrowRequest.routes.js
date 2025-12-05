import express from "express";
import {
  createBorrowRequest,
  approveBorrowRequest,
  getPendingRequests,
  getMyBorrowing,
} from "./borrowRequest.controller.js";

const router = express.Router();

router.post("/", createBorrowRequest);

router.get("/pending/:repoID", getPendingRequests);

router.patch("/:id/approve", approveBorrowRequest);

router.get("/my-borrowing", getMyBorrowing);

export default router;
