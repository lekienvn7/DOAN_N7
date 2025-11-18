import mongoose from "mongoose";
import Material from "../Material.js";

const electricMaterialSchema = new mongoose.Schema(
  {
    voltageRange: {
      type: String,
      default: null,
    },
    power: {
      type: Number,
      default: null,
    },
    materialInsulation: {
      type: String,
      default: null,
    },
    current: {
      type: Number,
      default: null,
    },
    frequency: {
      type: Number,
      default: null,
    },
    resistance: {
      type: Number,
      default: null,
    },
    phaseType: {
      type: String,
      default: null,
    },
    conductorMaterial: {
      type: String,
      default: null,
    },
    insulationMaterial: {
      type: String,
      default: null,
    },
    fireResistance: {
      type: String,
      default: null,
    },
    cableDiameter: {
      type: String,
      default: null,
    },
    waterproofLevel: {
      type: String,
      default: null,
    },
    operatingTemp: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const ElectricMaterial = Material.discriminator(
  "ElectricMaterial",
  electricMaterialSchema
);

export default ElectricMaterial;
