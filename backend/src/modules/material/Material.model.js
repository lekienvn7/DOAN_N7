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
      min: 0,
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
      enum: ["Trong kho", "Quá hạn", "Thanh lý"],
      default: "Trong kho",
    },
    borrowType: {
      type: String,
      enum: ["free", "approval"],
      default: "free",
    },
    quantity: {
      // Số lượng
      type: Number,
      default: 0,
      min: 0,
    },

    imageUrl: {
      type: String,
      default: "/images/material-default.png",
      trim: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
    discriminatorKey: "category",
  }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
