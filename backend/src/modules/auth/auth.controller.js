// src/modules/auth/auth.controller.js
import authService from "./auth.service.js";

const isProd = process.env.NODE_ENV === "production";

export const loginUser = async (req, res) => {
  try {
    const result = await authService.login({
      ...req.body,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });

    // Case: phải đổi mật khẩu lần đầu
    if (result.mustChangePassword) {
      return res.status(200).json({
        success: true,
        mustChangePassword: true,
        message: "Người dùng cần đổi mật khẩu lần đầu!",
        user: result.userInfo,
      });
    }

    // Set refresh token vào cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 14 * 86400 * 1000,
    });

    return res.status(200).json({
      success: true,
      mustChangePassword: false,
      message: "Đăng nhập thành công!",
      token: result.token,
      user: result.userInfo,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const result = await authService.logout(refreshToken);

    // Xóa cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: "Lỗi hệ thống!",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const result = await authService.refresh(refreshToken);

    // Ghi lại refresh token mới vào cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 14 * 86400 * 1000,
    });

    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.userInfo,
    });
  } catch (error) {
    console.error("Lỗi refresh token:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};
