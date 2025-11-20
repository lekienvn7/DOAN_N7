import authService from "./auth.service.js";

export const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    if (result.mustChangePassword) {
      return res.status(200).json({
        success: true,
        mustChangePassword: true,
        message: "Người dùng cần đổi mật khẩu lần đầu!",
        user: result.userInfo,
      });
    }

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 14 * 86400 * 1000,
    });

    return res.status(200).json({
      success: true,
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
      secure: true,
      sameSite: "none",
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
