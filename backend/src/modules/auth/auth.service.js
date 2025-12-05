import User from "../user/User.model.js";
import Session from "../session/Session.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

async function login(data) {
  const { username, password } = data;

  const user = await User.findOne({ username })
    .select("+password")
    .populate("role", "roleID roleName roleType");

  if (!user) {
    const err = new Error("Tài khoản hoặc mật khẩu không chính xác!");
    err.status = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Tài khoản hoặc mật khẩu không chính xác!");
    err.status = 401;
    throw err;
  }

  // Phải đổi password lần đầu
  if (user.mustChangePassword) {
    return {
      mustChangePassword: true,
      userInfo: {
        userID: user.userID,
        username: user.username,
        fullName: user.fullName,
        roleID: user.role?.roleID,
        roleName: user.role?.roleName,
      },
    };
  }

  // Tạo Access Token
  const token = jwt.sign(
    { id: user._id, roleName: user.role?.roleName },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

  // Tạo Refresh Token
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // Xóa session cũ
  await Session.deleteMany({ userID: user._id });

  // Tạo session mới
  await Session.create({
    userID: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  return {
    mustChangePassword: false,
    token,
    refreshToken,
    userInfo: {
      id: user._id,
      userID: user.userID,
      username: user.username,
      fullName: user.fullName,
      yourRepo: user.yourRepo || [],
      roleID: user.role?.roleID,
      roleName: user.role?.roleName,
    },
  };
}

async function logout(refreshToken) {
  if (!refreshToken) {
    return { message: "Không có phiên đăng nhập nào đang hoạt động." };
  }

  await Session.deleteOne({ refreshToken });

  return {
    message: "Đăng xuất thành công!",
  };
}

export default {
  login,
  logout,
};
