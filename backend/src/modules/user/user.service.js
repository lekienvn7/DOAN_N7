import User from "./User.model.js";
import Role from "../role/Role.model.js";
import bcrypt from "bcryptjs";

async function getAllUsers() {
  const users = await User.find().populate({
    path: "role",
    select: "roleID roleName yourRepo roleType permission -_id",
    populate: {
      path: "permission",
      select: "permissionDescription -_id",
    },
  });
  return users;
}

async function addUser(data) {
  const { userID, username, fullName, role, yourRepo } = data;

  if (!userID || !username || !fullName || !role) {
    const error = new Error("Thiếu thông tin tài khoản!");
    error.status = 400;
    throw error;
  }

  // check trùng username
  if (await User.findOne({ username })) {
    const error = new Error("Username đã tồn tại!");
    error.status = 409;
    throw error;
  }

  // check trùng userID
  if (await User.findOne({ userID })) {
    const error = new Error("UserID đã tồn tại!");
    error.status = 409;
    throw error;
  }

  // Lấy vai trò
  const existingRole = await Role.findOne({ roleID: role });
  if (!existingRole) {
    const error = new Error(`Vai trò ${role} không tồn tại!`);
    error.status = 404;
    throw error;
  }

  // Mật khẩu mặc định
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD?.trim() || "123456";

  // Tạo user mới
  const newUser = await User.create({
    userID,
    username,
    password: defaultPassword,
    fullName,
    role: existingRole._id,
    mustChangePassword: true,
    yourRepo,
  });

  return {
    userID: newUser.userID,
    username: newUser.username,
    roleName: existingRole.roleName,
  };
}

async function changePassword(userID, data) {
  const { oldPass, newPass } = data;

  const user = await User.findOne({ userID }).select("+password");
  if (!user) {
    const error = new Error("Không tìm thấy tài khoản!");
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(oldPass, user.password);
  if (!isMatch) {
    const error = new Error("Mật khẩu cũ không chính xác!");
    error.status = 401;
    throw error;
  }

  user.password = newPass;

  user.mustChangePassword = false;

  await user.save();

  return { message: "Đổi mật khẩu thành công!" };
}

async function updateUser(userID, data) {
  const { fullName, yourRepo, role, email, phone } = data;

  // Tạo đối tượng update trống để chỉ thêm field nào được gửi lên
  const updateData = {};

  if (fullName) {
    updateData.fullName = fullName;
  }
  if (email) {
    updateData.email = email;
  }
  if (phone) {
    updateData.phone = phone;
  }
  if (yourRepo) {
    updateData.yourRepo = yourRepo;
  }

  // Nếu có role mới thì mới update, còn không thì bỏ qua
  if (role) {
    const existingRole = await Role.findOne({ roleID: role });
    if (!existingRole) {
      const error = new Error(`Vai trò '${role}' không tồn tại!`);
      error.status = 404;
      throw error;
    }
    updateData.role = existingRole._id;
  }

  // Cập nhật người dùng
  const updatedUser = await User.findOneAndUpdate({ userID }, updateData, {
    new: true,
    runValidators: true,
  }).populate("role", "roleID roleName roleType");

  if (!updatedUser) {
    const error = new Error("Không tìm thấy tài khoản!");
    error.status = 404;
    throw error;
  }

  return { message: "Cập nhật tài khoản thành công!" };
}

async function resetUserPassword(data) {
  const { id } = data;
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "123456";

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const user = await User.findOneAndUpdate(
    { userID: id },
    { password: hashedPassword, mustChangePassword: true },
    { new: true }
  );

  if (!user) {
    const error = new Error("Tài khoản không tồn tại!");
    error.status = 404;
    throw error;
  }

  return {
    message: `Đã reset mật khẩu tài khoản ${user.username} về mặc định (${defaultPassword}).`,
  };
}

async function deleteUser(userID) {
  const deleteUser = await User.findOneAndDelete({ userID });
  if (!deleteUser) {
    const error = new Error("Tài khoản không tồn tại!");
    error.status = 404;
    throw error;
  }

  return { message: "Xóa tài khoản thành công!" };
}

export default {
  getAllUsers,
  addUser,
  changePassword,
  updateUser,
  resetUserPassword,
  deleteUser,
};
