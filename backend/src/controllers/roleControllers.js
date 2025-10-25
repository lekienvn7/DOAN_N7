import Permission from "../models/Permission.js";
import Role from "../models/Role.js";

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate("permission", "permissionDescription -_id")
      .select(" -roleDescription  -_id");
    res.status(200).json({
      success: true,
      message: "Lấy danh sách vai trò thành công!",
      data: roles,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllRoles:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addRole = async (req, res) => {
  try {
    const { roleID, roleName, roleDescription, permission, roleType } =
      req.body;

    // Kiểm tra dữ liệu đầu vào

    if (!roleID) {
      return res.status(400).json({
        success: false,
        message: "Thiếu role ID",
      });
    }

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tên vai trò!",
      });
    }

    // Kiểm tra trùng tên
    const existingRole = await Role.findOne({ roleName });
    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Vai trò đã tồn tại!",
      });
    }

    const existingID = await Role.findOne({ roleID });
    if (existingID) {
      return res.status(409).json({
        success: false,
        message: "Mã vai trò đã tồn tại!",
      });
    }

    const existingPermission = await Permission.findOne({
      permissionID: permission,
    });
    if (!existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Mã quyền không đã tồn tại!",
      });
    }

    const newRole = await Role.create({
      roleID,
      roleType,
      roleName,
      roleDescription,
      permission: existingPermission._id,
    });

    res.status(201).json({
      success: true,
      message: "Thêm vai trò thành công!",
      data: newRole,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Giá trị vai trò không hợp lệ! Hãy chọn một trong các giá trị: Quản lý kho, Quản lý thư viện, Kế toán.",
      });
    }

    console.error("Lỗi khi gọi addRole:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { roleID, roleDescription, permission } = req.body;
    const existingPermission = await Permission.findOne({
      permissionID: permission,
    });
    if (!existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Mã quyền không đã tồn tại!",
      });
    }
    const updatedRole = await Role.findOneAndUpdate(
      { roleID: req.params.id },
      { roleID, roleDescription, permission: existingPermission._id },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        message: "Vai trò không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật vai trò thành công!",
      data: updatedRole,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateRole:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findOneAndDelete({ roleID: req.params.id });

    if (!deletedRole) {
      return res.status(404).json({
        success: false,
        message: "Vai trò không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa vai trò thành công!",
      data: deletedRole,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteRole:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
