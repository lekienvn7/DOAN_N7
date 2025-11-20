import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    roleID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roleName: {
      type: String,
      enum: ["Quản lý tổng", "Quản lý kho", "Quản lý bảo trì"],
      required: true,
      unique: true,
      trim: true,
    },
    roleType: {
      type: String,
      enum: ["Điện", "Hóa chất", "Cơ khí", "Khác"],
      default: "Khác",
    },
    roleDescription: {
      type: String,
      default: "",
    },
    permission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
