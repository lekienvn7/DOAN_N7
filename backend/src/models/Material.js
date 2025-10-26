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
        enum: [
          "Điện",
          "Hóa chất",
          "Cơ khí",
          "Nhúng",
          "Công nghệ thông tin",
          "Ô tô",
          "Điện tử",
          "Thời trang",
        ],
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
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
  }
);

const Material = mongoose.model("Material", materialSchema);

export default Material;
