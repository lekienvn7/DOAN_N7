import mongoose from "mongoose";
import Material from "../Material.model.js";

const automotiveMaterialSchema = new mongoose.Schema(
  {
    partType: {
      type: String,
      default: null,
    }, // lọc dầu / phanh / bugi
    vehicleModel: {
      type: String,
      default: null,
    }, // Mazda 3 / Vios…
    manufacturer: {
      type: String,
      default: null,
    }, // Honda / Toyota
    compatibility: {
      type: String,
      default: null,
    }, // Phù hợp dòng xe nào
    lifespan: {
      type: Number,
      default: null,
    }, // Tuổi thọ
    material: {
      type: String,
      default: null,
    }, // Chất liệu phụ tùng
    heatResistance: {
      type: String,
      default: null,
    }, // Chịu nhiệt độ
    fluidSpec: {
      type: String,
      default: null,
    }, // Chuẩn dầu / nhớt
  },
  { _id: false }
);

const AutomotiveMaterial = Material.discriminator(
  "AutomotiveMaterial",
  automotiveMaterialSchema
);

export default AutomotiveMaterial;
