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
      required: true, // => Bắt buộc phải điền giá trị
      trim: true,
    },
    type: [
      {
        // Loại vật liệu
        type: String,
        enum: ["Điện", "Cơ khí", "Hóa chất"],
        required: true,
        trim: true,
      },
    ],
    maintenanceCycle: {
      // Thời gian giữa các lần bảo trì
      type: Number, // tính theo tháng
      default: 1, // mặc định: 1 tháng bảo trì 1 lần
      min: 1,
      max: 12,
    },
    status: {
      // Trạng thái vât liệu
      type: String,
      enum: ["inRepo", "repairing"], // => Chỉ nhận 2 giá trị inRepo và repairing
      default: "inRepo", // => Nếu ko điền gì, mặc định điền inRepo
    },
    quantity: {
      // Số lượng
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    repairedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
  }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
