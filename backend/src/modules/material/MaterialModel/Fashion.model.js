import mongoose from "mongoose";
import Material from "../Material.model.js";

const fashionMaterialSchema = new mongoose.Schema(
  {
    fabricType: {
      type: String,
      default: null,
    }, // Cotton / Lụa / Kaki
    color: {
      type: String,
      default: null,
    },
    colorType: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
    pattern: {
      type: String,
      default: null,
    }, // Họa tiết
    elasticity: {
      type: String,
      default: null,
    }, // Độ co giãn
    origin: {
      type: String,
      default: null,
    }, // Xuất xứ
    washInstruction: {
      type: String,
      default: null,
    }, // HDSD giặt
    durability: {
      type: String,
      default: null,
    }, // Độ bền màu
    breathability: {
      type: String,
      default: null,
    },
    fabricThickness: {
      type: String,
      default: null,
    },
    colorfastness: {
      type: String,
      default: null,
    },
    wrinkleResistance: {
      type: String,
      default: null,
    },
    SPM: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const FashionMaterial = Material.discriminator(
  "FashionMaterial",
  fashionMaterialSchema
);

export default FashionMaterial;
