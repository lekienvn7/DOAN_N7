import express from "express";
import {
  exportElectricExcel,
  exportChemicalExcel,
  exportAutomotiveExcel,
  exportFashionExcel,
  exportIotExcel,
  exportMechanicalExcel,
  exportTechnologyExcel,
} from "./exportExcel.controller.js";
import {
  authorizeRoles,
  checkRepositoryAccess,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/electric/export-excel", exportElectricExcel);

router.get("/chemical/export-excel", exportChemicalExcel);

router.get("/automotive/export-excel", exportAutomotiveExcel);

router.get("/fashion/export-excel", exportFashionExcel);

router.get("/iot/export-excel", exportIotExcel);

router.get("/mechanical/export-excel", exportMechanicalExcel);

router.get("/technology/export-excel", exportTechnologyExcel);

export default router;
