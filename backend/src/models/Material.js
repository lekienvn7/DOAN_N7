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
    type: [
      {
        // Loại vật liệu
        type: String,
        enum: ["Điện", "Cơ khí", "Hóa chất", "Khác"],
        required: true,
        trim: true,
      },
    ],
    quantity: {
      // Số lượng
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
  }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
