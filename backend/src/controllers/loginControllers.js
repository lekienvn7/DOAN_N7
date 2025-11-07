import User from "../models/User.js";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cookieParser from "cookie-parser";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user theo username + lấy cả mật khẩu
    const user = await User.findOne({ username })
      .select("+password")
      .populate("role", "roleID roleName roleType");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác!",
      });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không chính xác!",
      });
    }

    // Nếu user phải đổi mật khẩu lần đầu
    if (user.mustChangePassword) {
      return res.status(200).json({
        success: true,
        mustChangePassword: true,
        message: "Người dùng cần đổi mật khẩu lần đầu!",
        user: {
          userID: user.userID,
          username: user.username,
          fullName: user.fullName,
          roleID: user.role?.roleID,
          roleName: user.role?.roleName || "",
        },
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, roleName: user.role?.roleName },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    //  tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Xóa tất cả session cũ của user trước khi tạo session mới
    await Session.deleteMany({ userID: user._id });
    // tạo session mới để lưu refresh token
    await Session.create({
      userID: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả token về trong res
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        userID: user.userID,
        username: user.username,
        fullName: user.fullName,
        yourRepo: user.yourRepo || [],
        roleID: user.role?.roleID,
        roleName: user.role?.roleName || "",
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Không có phiên đăng nhập nào đang hoạt động.",
      });
    }

    // Xóa session trong database
    await Session.deleteOne({ refreshToken: token });

    // Xóa cookie trên client
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi đăng xuất!",
    });
  }
};
