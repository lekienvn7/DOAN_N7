import mongoose from "mongoose";
import Material from "./Material.js";

const mechanicalMaterialSchema = new mongoose.Schema(
  {
    metalType: {
      type: String,
      default: null,
    }, // Thép, inox, đồng...
    hardness: {
      type: String,
      default: null,
    }, // Độ cứng (HRC)
    tensileStrength: {
      type: String,
      default: null,
    }, // Độ bền kéo
    weight: {
      type: Number,
      default: null,
    }, // Trọng lượng
    coating: {
      type: String,
      default: null,
    }, // Mạ kẽm / mạ niken
    thickness: {
      type: String,
      default: null,
    }, // Độ dày
    size: {
      type: String,
      default: null,
    }, // Kích thước tổng thể
    tolerance: {
      type: String,
      default: null,
    }, // Dung sai
    loadCapacity: {
      type: String,
      default: null,
    }, // Khả năng chịu tải
    heatResistance: {
      type: String,
      default: null,
    }, // Chịu nhiệt độ
    corrosionResistance: {
      type: String,
      default: null,
    }, // Chống ăn mòn
  },
  { _id: false }
);

const MechanicalMaterial = Material.discriminator(
  "MechanicalMaterial",
  mechanicalMaterialSchema
);

export default MechanicalMaterial;
