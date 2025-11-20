import express from "express";
import {
  getAllRoles,
  addRole,
  updateRole,
  deleteRole,
} from "./role.controller.js";

const router = express.Router();

router.get("/", getAllRoles);

router.post("/", addRole);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

export default router;
