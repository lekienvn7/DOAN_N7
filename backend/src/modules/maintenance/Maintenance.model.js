import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    maintenanceID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // người thực hiện hoặc ghi nhận bảo trì
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // kết thúc khi vật tư được trả lại kho
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed", "delayed"],
      default: "pending",
    },
    nextMaintenance: {
      type: Date, // ngày bảo trì tiếp theo (tự động sinh)
      default: null,
    },
    cost: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;
