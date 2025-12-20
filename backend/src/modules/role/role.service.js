import Permission from "../permission/Permission.model.js";
import Role from "./Role.model.js";

async function getAllRoles() {
  const roles = await Role.find()
    .populate("permission", "permissionDescription -_id")
    .select("-roleDescription -_id");

  return roles;
}

async function addRole(data) {
  const { roleID, roleName, roleDescription, permission, roleType } = data;

  if (!roleID || !roleName) {
    const err = new Error("Thiếu thông tin vai trò!");
    err.status = 400;
    throw err;
  }

  // Check trùng
  if (await Role.findOne({ roleName })) {
    const err = new Error("Tên vai trò đã tồn tại!");
    err.status = 409;
    throw err;
  }

  if (await Role.findOne({ roleID })) {
    const err = new Error("Mã vai trò đã tồn tại!");
    err.status = 409;
    throw err;
  }

  // Check permission tồn tại
  const existingPermission = await Permission.findOne({
    permissionID: permission,
  });
  if (!existingPermission) {
    const err = new Error("Mã quyền không tồn tại!");
    err.status = 404;
    throw err;
  }

  const newRole = await Role.create({
    roleID,
    roleName,
    roleDescription,
    roleType,
    permission: existingPermission._id,
  });

  return {
    message: "Thêm vai trò thành công!",
    role: newRole,
  };
}

async function updateRole(roleID, data) {
  const { roleDescription, permission, roleName } = data;

  const existingPermission = await Permission.findOne({
    permissionID: permission,
  });

  if (!existingPermission) {
    const err = new Error("Mã quyền không tồn tại!");
    err.status = 404;
    throw err;
  }

  const updatedRole = await Role.findOneAndUpdate(
    { roleID },
    { roleDescription, roleName, permission: existingPermission._id },
    { new: true }
  );

  if (!updatedRole) {
    const err = new Error("Vai trò không tồn tại!");
    err.status = 404;
    throw err;
  }

  return {
    message: "Cập nhật vai trò thành công!",
    role: updatedRole,
  };
}

async function deleteRole(roleID) {
  const deletedRole = await Role.findOneAndDelete({ roleID });

  if (!deletedRole) {
    const err = new Error("Vai trò không tồn tại!");
    err.status = 404;
    throw err;
  }

  return {
    message: "Xóa vai trò thành công!",
    role: deletedRole,
  };
}

export default {
  getAllRoles,
  addRole,
  updateRole,
  deleteRole,
};
