import express from "express";
import {
  getAllMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialControllers.js";

const router = express.Router();

router.get("/", getAllMaterials);

router.post("/", addMaterial);

router.put("/:id", updateMaterial);

router.delete("/:id", deleteMaterial);

export default router;
