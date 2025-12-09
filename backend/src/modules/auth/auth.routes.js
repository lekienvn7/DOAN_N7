import express from "express";
import { loginUser, logoutUser, refreshToken } from "./auth.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);

export default router;