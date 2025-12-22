import express from "express";
import {
  getMaterialProblems,
  discardMaterialProblem,
} from "./materialProblem.controller.js";

const router = express.Router();

// GET danh sách vật tư hỏng
router.get("/", getMaterialProblems);

// DELETE (vứt vật tư hỏng)
router.delete("/:id", discardMaterialProblem);

export default router;
