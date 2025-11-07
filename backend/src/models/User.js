import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    mustChangePassword: {
      type: Boolean,
      default: true, // true nếu user chưa đổi mật khẩu mặc định
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      sparse: true,
      default: null,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    yourRepo: [
      {
        type: String,
        enum: [
          "all",
          "chemical",
          "automotive",
          "electric",
          "fashion",
          "iot",
          "mechanical",
          "technology",
          "telecom",
        ],
        sparse: true,
        trim: true,
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
