import express from "express";
import { loginUser, logoutUser } from "./auth.controller.js";

const router = express.Router();

router.post("/", loginUser);

router.post("/logout", logoutUser);

export default router;
