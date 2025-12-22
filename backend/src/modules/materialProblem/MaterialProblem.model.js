import mongoose from "mongoose";

const materialProblemSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      default: "Hỏng khi mượn",
    },

    sourceBorrowRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BorrowRequest",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "fixed", "discarded"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaterialProblem", materialProblemSchema);
