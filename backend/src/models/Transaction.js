import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transactionID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
    type: {
      type: String,
      enum: ["import", "export"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    beforeQuantity: { type: Number, default: 0 },
    afterQuantity: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index để tối ưu truy vấn
TransactionSchema.index({ repository: 1, material: 1 });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
