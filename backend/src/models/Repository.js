import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    repoID: {
      type: String,
      required: true,
      unique: true,
    },
    repoName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    repoType: {
      type: String,
      enum: ["Điện", "Hóa chất", "Cơ khí", "Khác"],
      required: true,
    },
    location: {
      type: String, // vị trí hoặc khu vực
      default: null,
      trim: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // người quản lý kho
      default: null,
    },
    materials: [
      {
        material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
        quantity: { type: Number, default: 0 }, // số lượng riêng cho kho này
      },
    ],
  },
  { timestamps: true }
);

const Repository = mongoose.model("Repository", repoSchema);

export default Repository;
