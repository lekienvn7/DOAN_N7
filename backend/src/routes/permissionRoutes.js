import express from "express";
import {
  getAllPermissions,
  addPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionControllers.js";

const router = express.Router();

router.get("/", getAllPermissions);

router.post("/", addPermission);

router.put("/:id", updatePermission);

router.delete("/:id", deletePermission);

export default router;
