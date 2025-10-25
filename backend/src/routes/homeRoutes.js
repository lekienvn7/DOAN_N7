import express from "express";

const router = express.Router();

router.get("/", (request, respond) => {
  respond.status(200).send("Đây là trang chủ");
});

export default router;
