import Permission from "../models/Permission.js";

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().select("-_id");
    res.status(200).json({
      success: true,
      message: "Lấy danh sách quyền thành công!",
      data: permissions,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllPermissions: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addPermission = async (req, res) => {
  try {
    const { permissionName, permissionDescription } = req.body;

    const count = await Permission.countDocuments();
    const permissionID = `VT${count + 1}`;

    const existingPermissionID = await Permission.findOne({ permissionID });
    if (existingPermissionID) {
      return res.status(409).json({
        success: false,
        message: "Mã quyền đã tồn tại!",
      });
    }
    const existingPermission = await Permission.findOne({ permissionName });
    if (existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Quyền đã tồn tại!",
      });
    }

    const permission = new Permission({
      permissionID,
      permissionName,
      permissionDescription,
    });

    const newPermission = await permission.save();
    res.status(201).json({
      success: true,
      message: "Thêm vai trò thành công!",
      data: newPermission,
    });
  } catch (error) {
    console.error("Lỗi khi gọi addPermissions: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { permissionName, permissionDescription } = req.body;
    const updatedPermission = await Permission.findOneAndUpdate(
      { permissionID: req.params.id },
      {
        permissionDescription,
        permissionName,
      },
      { new: true }
    );
    if (!updatedPermission) {
      return res.status(404).json({
        success: false,
        message: "Quyền không tồn tại!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cập nhật quyền thành công!",
      data: updatedPermission,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updatePermissions: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const deletePermission = await Permission.findOneAndDelete({
      permissionID: req.params.id,
    });
    if (!deletePermission) {
      return res.status(404).json({
        success: false,
        message: "Quyền không tồn tại!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Xóa quyền thành công!",
      data: deletePermission,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deletePermissions: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
