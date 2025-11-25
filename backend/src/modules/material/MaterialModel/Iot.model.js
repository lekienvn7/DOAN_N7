import mongoose from "mongoose";
import Material from "../Material.model.js";

const iotMaterialSchema = new mongoose.Schema(
  {
    sensorType: {
      type: String,
      default: null,
    }, // nhiệt độ, độ ẩm, ánh sáng…
    cpuClock: {
      type: String,
      default: null,
    }, // Tốc độ CPU
    communicationProtocol: {
      type: String,
      default: null,
    }, // I2C, SPI, UART
    wirelessTech: {
      type: String,
      default: null,
    }, // WiFi, BLE, LoRa…
    powerSupply: {
      type: String,
      default: null,
    }, // 3.3V / 5V
    ioPins: {
      type: String,
      default: null,
    }, // Số chân I/O
    memory: {
      type: String,
      default: null,
    }, // Flash / RAM
    operatingTemp: {
      type: String,
      default: null,
    }, // Nhiệt độ hoạt động
    interface: {
      type: String,
      default: null,
    }, // GPIO, ADC, DAC…
  },
  { _id: false }
);

const IotMaterial = Material.discriminator("IotMaterial", iotMaterialSchema);

export default IotMaterial;
