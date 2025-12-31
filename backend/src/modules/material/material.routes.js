import express from "express";
import {
  getAllMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
} from "./material.controller.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllMaterials);

router.post("/", upload.single("image"), addMaterial);

router.put("/:id", upload.single("image"), updateMaterial);

router.delete("/:id", deleteMaterial);

export default router;
