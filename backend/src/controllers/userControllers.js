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
        select: "roleID roleName roleType permission -_id", // Lấy tên role + danh sách quyền
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
    const { username, fullName, email, role } = req.body;

    if (!username || !fullName || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin tài khoản!" });
    }

    // Kiểm tra trùng username/email
    if (await User.findOne({ username }))
      return res
        .status(409)
        .json({ success: false, message: "Username đã tồn tại!" });

    if (await User.findOne({ email }))
      return res
        .status(409)
        .json({ success: false, message: "Email đã tồn tại!" });

    // Tạo userID
    const count = await User.countDocuments();
    const userID = `TK${count + 1}`;

    // Lấy role
    const existingRole = await Role.findOne({ roleID: role });
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: `Vai trò ${role} không tồn tại!`,
      });
    }

    // Hash mật khẩu mặc định
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD?.trim();

    // Tạo user mới
    const newUser = await User.create({
      userID,
      username,
      password: defaultPassword,
      fullName,
      email,
      role: existingRole._id,
      mustChangePassword: true,
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

    // Chỉ cho phép khi mustChangePassword = true
    if (!user.mustChangePassword) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản này không cần đổi mật khẩu bắt buộc.",
      });
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
    const { userID, oldPass, newPass } = req.body;

    const user = await User.findOne({ userID }).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng!" });

    const isSame = await bcrypt.compare(newPass, user.password);
    if (isSame)
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải khác mật khẩu cũ!",
      });

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi updateUser:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
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
