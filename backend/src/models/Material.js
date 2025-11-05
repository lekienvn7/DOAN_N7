import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    materialID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      // Tên
      type: String,
      required: true,
      unique: true, // => Bắt buộc phải điền giá trị
      trim: true,
    },
    maintenanceCycle: {
      // Thời gian giữa các lần bảo trì
      type: Number, // tính theo tháng
      default: null, // mặc định: 1 tháng bảo trì 1 lần
      min: 1,
    },
    type: [
      {
        // Loại vật liệu
        type: String,
        enum: [
          "electric",
          "chemical",
          "mechanical",
          "iot",
          "technology",
          "automotive",
          "telecom",
          "fashion",
        ],
        required: true,
        trim: true,
      },
    ],
    status: {
      // Trạng thái vât liệu
      type: String,
      enum: ["Trong kho", "Đang mượn", "Đang bảo trì"],
      default: "Trong kho",
    },
    quantity: {
      // Số lượng
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "cái", // Đơn vị tính, ví dụ: cái, cuộn, mét...
    },
    description: {
      type: String,
      default: "", // Mô tả chi tiết vật tư
      trim: true,
    },
    icon: {
      type: String,
      default: "🔌", // Có thể lưu emoji hoặc tên class/icon để frontend render
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    voltageRange: {
      type: Number,
      default: null,
    },
    power: {
      type: Number,
      default: null,
    },
    materialInsulation: {
      type: String,
      enum: ["Dẫn điện", "Cách điện"],
      default: null,
    },
    chemicalFormula: {
      type: String,
      default: null,
    },
    chemicalNote: {
      type: String,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    metalType: {
      type: String,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    coating: {
      type: String,
      default: null,
    },
    communicationProtocol: {
      type: String,
      default: null,
    },
    sensorType: {
      type: String,
      default: null,
    },
    powerSupply: {
      type: String,
      default: null,
    },
    deviceType: {
      type: String,
      default: null,
    },
    Specification: {
      type: String,
      default: null,
    },
    networkInterface: {
      type: String,
      default: null,
    },
    partType: {
      type: String,
      default: null,
    },
    vehicleModel: {
      type: String, 
      default: null,
    },
    manufacturer: {
      type: String,
      default: null,
    },
    signalType: {
      type: String,
      default: null,
    },
    bandwidth: {
      type: String,
      default: null,
    },
    connectorType: {
      type: String,
      default: null,
    },
    material: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    origin: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
  }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
