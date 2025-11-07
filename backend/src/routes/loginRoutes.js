import express from "express";
import { loginUser, logoutUser } from "../controllers/loginControllers.js";

const router = express.Router();

router.post("/", loginUser);

router.post("/logout", logoutUser);

export default router;
