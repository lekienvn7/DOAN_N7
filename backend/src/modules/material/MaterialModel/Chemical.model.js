import mongoose from "mongoose";
import Material from "../Material.model.js";

const chemicalMaterialSchema = new mongoose.Schema({
  chemicalFormula: {
    type: String,
    default: null,
  }, // H2SO4, NaCl...
  concentration: {
    type: String,
    default: null,
  }, // Nồng độ %
  hazardLevel: {
    type: String,
    default: null,
  }, // Mức độ nguy hiểm
  storageTemperature: {
    type: String,
    default: null,
  }, // Nhiệt độ lưu trữ
  boilingPoint: {
    type: String,
    default: null,
  }, // Điểm sôi
  meltingPoint: {
    type: String,
    default: null,
  }, // Điểm nóng chảy
  molarMass: {
    type: String,
    default: null,
  }, // Khối lượng mol
  phLevel: {
    type: String,
    default: null,
  }, // Độ pH
  expiryDate: {
    type: Date,
    default: null,
  }, // Hạn sử dụng
  flammability: {
    type: String,
    default: null,
  }, // Dễ cháy mức độ?
  toxicity: {
    type: String,
    default: null,
  }, // Độc tính
  safetyNote: {
    type: String,
    default: null,
  }, // Ghi chú an toàn
  casNumber: {
    type: String,
    default: null,
  },
});

const ChemicalMaterial = Material.discriminator(
  "ChemicalMaterial",
  chemicalMaterialSchema
);

export default ChemicalMaterial;
