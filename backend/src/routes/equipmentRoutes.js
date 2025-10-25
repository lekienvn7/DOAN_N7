import express from "express";
import {
  getAllEquipments,
  addEquipment,
  updateEquipment,
  deleteEquipment,
} from "../controllers/equipmentControllers.js";

const router = express.Router();

router.get("/", getAllEquipments);

router.post("/", addEquipment);

router.put("/:id", updateEquipment);

router.delete("/:id", deleteEquipment);

export default router;
