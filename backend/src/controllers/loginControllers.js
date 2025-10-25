import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
        message: "Không tìm thấy tài khoản!",
      });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Sai mật khẩu!" });
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
      { id: user._id, role: user.role?.roleName },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        userID: user.userID,
        username: user.username,
        fullName: user.fullName,
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
