import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["material", "borrow", "return"],
      required: true,
    },

    title: String,
    message: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ai nhận thông báo
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);