import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    equipmentID: {
      type: String,
      required: true,
      unique: true,
    },
    equipmentName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: [
      {
        // Loại thiết bị
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
    status: {
      // Trạng thái vât liệu
      type: String,
      enum: ["Còn", "Hỏng"], // => Chỉ nhận 2 giá trị inRepo và repairing
      default: "inRepo", // => Nếu ko điền gì, mặc định điền inRepo
    },
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
    maintenanceCycle: {
      // Thời gian giữa các lần bảo trì
      type: Number, // tính theo tháng
      default: 1, // mặc định: 1 tháng bảo trì 1 lần
      min: 1,
    },
  },
  {
    timestamps: true, // Tự tạo createdAt và updatedAt
  }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;
