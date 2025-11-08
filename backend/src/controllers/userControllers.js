import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: "role",
        select: "roleID roleName yourRepo roleType permission -_id", // Lấy tên role + danh sách quyền
        populate: {
          path: "permission",
          select: "permissionDescription -_id",
        },
      })
      .select("-_id");
    res.status(200).json({
      success: true,
      message: "Lấy danh sách tài khoản thành công!",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllUser", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const { userID, username, fullName, role, yourRepo } = req.body;

    if (!userID || !username || !fullName || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin tài khoản!" });
    }

    // Kiểm tra trùng username
    if (await User.findOne({ username })) {
      return res
        .status(409)
        .json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
    }

    // Tạo userID
    if (await User.findOne({ userID })) {
      return res
        .status(409)
        .json({ success: false, message: "UserID đã tồn tại!" });
    }

    // Lấy vai trò
    const existingRole = await Role.findOne({ roleID: role });
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: `Vai trò ${role} không tồn tại!`,
      });
    }

    // Mật khẩu mặc định
    const defaultPassword =
      process.env.DEFAULT_USER_PASSWORD?.trim() || "123456";

    // Tạo user mới (không có email)
    const newUser = await User.create({
      userID,
      username,
      password: defaultPassword,
      fullName,
      role: existingRole._id,
      mustChangePassword: true,
      yourRepo: Array.isArray(yourRepo)
        ? yourRepo.filter((r) => r && r !== "null" && r !== "")
        : yourRepo
        ? [yourRepo]
        : [],
    });

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công!",
      data: {
        userID: newUser.userID,
        username: newUser.username,
        roleName: existingRole.roleName,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo user:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;

    // Lấy id từ URL (params)
    const user = await User.findOne({ userID: req.params.id }).select(
      "+password"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản" });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không chính xác!" });
    }

    // Hash mật khẩu mới
    user.password = newPass;
    user.mustChangePassword = false;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu lần đầu thành công!" });
  } catch (error) {
    console.error("Lỗi changePassword:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullName, yourRepo, role, email } = req.body;

    // Tạo đối tượng update trống để chỉ thêm field nào được gửi lên
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    // Xử lý yourRepo có thể là 1 string hoặc 1 mảng
    if (yourRepo) {
      if (Array.isArray(yourRepo)) {
        // loại trùng và loại giá trị rỗng
        updateData.yourRepo = [...new Set(yourRepo.filter(Boolean))];
      } else if (typeof yourRepo === "string") {
        updateData.yourRepo = [yourRepo];
      }
    }

    // Nếu có role mới thì mới update, còn không thì bỏ qua
    if (role) {
      const existingRole = await Role.findOne({ roleID: role });
      if (!existingRole) {
        return res.status(404).json({
          success: false,
          message: `Vai trò '${role}' không tồn tại!`,
        });
      }
      updateData.role = existingRole._id;
    }

    // Cập nhật người dùng
    const updatedUser = await User.findOneAndUpdate(
      { userID: req.params.id },
      updateData,
      { new: true, runValidators: true }
    ).populate("role", "roleID roleName roleType");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi updateUser:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params; // userID riêng (vd: TK05)
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "123456";

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.findOneAndUpdate(
      { userID: id },
      { password: hashedPassword, mustChangePassword: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã reset mật khẩu tài khoản ${user.username} về mặc định (${defaultPassword}).`,
    });
  } catch (error) {
    console.error("Lỗi khi reset mật khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete({ userID: req.params.id });
    if (!deleteUser) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }
    res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công!",
      data: deleteUser,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteUser", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
