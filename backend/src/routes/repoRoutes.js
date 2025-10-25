import express from "express";
import {
  getRepository,
  getAllRepository,
  addRepository,
  updateRepository,
  deleteRepository,
} from "../controllers/repoControllers.js";

const router = express.Router();

router.get("/", getAllRepository);

router.get("/:id", getRepository);

router.post("/", addRepository);

router.put("/:id", updateRepository);

router.delete("/:id", deleteRepository);

export default router;
