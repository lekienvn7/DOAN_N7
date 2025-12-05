import mongoose from "mongoose";

const borrowItemSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },

  quantity: { type: Number, required: true },
});

const borrowRequestSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [borrowItemSchema],
      required: true,
      validate: (v) => v.length > 0, // phải có ít nhất 1 vật tư
    },

    note: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,

    expectedReturnDate: Date,
  },
  { timestamps: true }
);

const BorrowRequest = mongoose.model("BorrowRequest", borrowRequestSchema);

export default BorrowRequest;
