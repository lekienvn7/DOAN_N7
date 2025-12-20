// src/modules/auth/auth.service.js
import User from "../user/User.model.js";
import Session from "../session/Session.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

function buildPayload(user) {
  return {
    _id: user._id.toString(),
    userID: user.userID,
    username: user.username,
    fullName: user.fullName,
    roleID: user.role?.roleID,
    roleName: user.role?.roleName,
    yourRepo: user.yourRepo || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signAccessToken(user) {
  const payload = buildPayload(user);

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

async function login(data) {
  const { username, password, userAgent, ip } = data;

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

  // Case: phải đổi mật khẩu lần đầu
  if (user.mustChangePassword) {
    return {
      mustChangePassword: true,
      userInfo: buildPayload(user),
    };
  }

  const token = signAccessToken(user);

  const refreshToken = crypto.randomBytes(64).toString("hex");

  await Session.deleteMany({ userID: user._id });

  // Tạo session mới
  await Session.create({
    userID: user._id,
    refreshToken,
    userAgent,
    ipAddress: ip,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  return {
    mustChangePassword: false,
    token,
    refreshToken,
    userInfo: buildPayload(user),
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

async function refresh(refreshToken) {
  if (!refreshToken) {
    const err = new Error("Thiếu refresh token!");
    err.status = 401;
    throw err;
  }

  const session = await Session.findOne({ refreshToken });

  if (!session) {
    const err = new Error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn!");
    err.status = 401;
    throw err;
  }

  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id });
    const err = new Error(
      "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
    );
    err.status = 401;
    throw err;
  }

  const user = await User.findById(session.userID).populate(
    "role",
    "roleID roleName roleType"
  );

  if (!user) {
    await Session.deleteOne({ _id: session._id });
    const err = new Error("Tài khoản không tồn tại!");
    err.status = 404;
    throw err;
  }

  // Tạo access token mới
  const token = signAccessToken(user);

  // (optional) Rotate refresh token – cho bảo mật xịn hơn
  const newRefreshToken = crypto.randomBytes(64).toString("hex");
  session.refreshToken = newRefreshToken;
  session.expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);
  await session.save();

  return {
    token,
    refreshToken: newRefreshToken,
    userInfo: buildPayload(user),
  };
}

export default {
  login,
  logout,
  refresh,
};
