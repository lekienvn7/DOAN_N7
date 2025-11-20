import Permission from "../permission/Permission.model.js";

async function getAllPermissions() {
  const permissions = await Permission.find().select("-_id");
  return permissions;
}


async function addPermission(data) {
  const { permissionName, permissionDescription } = data;

  if (!permissionName) {
    const err = new Error("Thiếu tên quyền!");
    err.status = 400;
    throw err;
  }

  // Tạo mã quyền tự động
  const count = await Permission.countDocuments();
  const permissionID = `VT${count + 1}`;

  if (await Permission.findOne({ permissionID })) {
    const err = new Error("Mã quyền đã tồn tại!");
    err.status = 409;
    throw err;
  }

  if (await Permission.findOne({ permissionName })) {
    const err = new Error("Tên quyền đã tồn tại!");
    err.status = 409;
    throw err;
  }

  const newPermission = await Permission.create({
    permissionID,
    permissionName,
    permissionDescription,
  });

  return {
    message: "Thêm quyền thành công!",
    permission: newPermission,
  };
}


async function updatePermission(permissionID, data) {
  const { permissionName, permissionDescription } = data;

  const updatedPermission = await Permission.findOneAndUpdate(
    { permissionID },
    { permissionName, permissionDescription },
    { new: true }
  );

  if (!updatedPermission) {
    const err = new Error("Quyền không tồn tại!");
    err.status = 404;
    throw err;
  }

  return {
    message: "Cập nhật quyền thành công!",
    permission: updatedPermission,
  };
}


async function deletePermission(permissionID) {
  const removed = await Permission.findOneAndDelete({ permissionID });

  if (!removed) {
    const err = new Error("Quyền không tồn tại!");
    err.status = 404;
    throw err;
  }

  return {
    message: "Xóa quyền thành công!",
    permission: removed,
  };
}

export default {
  getAllPermissions,
  addPermission,
  updatePermission,
  deletePermission,
};