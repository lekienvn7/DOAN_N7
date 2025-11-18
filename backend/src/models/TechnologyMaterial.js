import mongoose from "mongoose";

const technologyMaterialSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    default: null,
  }, // SSD / RAM / ROUTER
  capacity: {
    type: String,
    default: null,
  }, // 256GB / 1TB / 8GB
  speed: {
    type: String,
    default: null,
  }, // 3200MHz / 540MBps / 1Gbps
  brand: {
    type: String,
    default: null,
  }, // Dell, HP, Kingston…
  connectorType: {
    type: String,
    default: null,
  }, // SATA / NVMe / PCIe
  powerConsumption: {
    type: String,
    default: null,
  }, // Công suất tiêu thụ
  protocol: {
    type: String,
    default: null,
  }, // SMB, FTP, HTTP
  networkInterface: {
    type: String,
    default: null,
  }, // Ethernet / Fiber
});

const TechnologyMaterial = mongoose.model(
  "TechnologyMaterial",
  technologyMaterialSchema
);

export default TechnologyMaterial;
