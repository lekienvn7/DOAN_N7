import mongoose from "mongoose";

const telecomMaterialSchema = new mongoose.Schema({
  signalType: {
    type: String,
    default: null,
  }, // Analog / Digital
  frequency: {
    type: String,
    default: null,
  }, // 2.4GHz / 5GHz…
  bandwidth: {
    type: String,
    default: null,
  }, // 40MHz / 80MHz
  connectorType: {
    type: String,
    default: null,
  }, // SMA / BNC / RJ45
  cableType: {
    type: String,
    default: null,
  }, // UTP / STP / Fiber
  transmissionRate: {
    type: String,
    default: null,
  }, // 100Mbps / 1Gbps
  range: {
    type: String,
    default: null,
  }, // Tầm phát sóng
  impedance: {
    type: String,
    default: null,
  }, // 50Ω / 75Ω
});

const TelecomMaterial = mongoose.model(
  "TelecomMaterial",
  telecomMaterialSchema
);

export default TelecomMaterial;
