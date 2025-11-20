import permissionService from "./permission.service.js";

export const getAllPermissions = async (req, res) => {
  try {
    const data = await permissionService.getAllPermissions();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách quyền thành công!",
      data,
    });
  } catch (error) {
    console.error("Lỗi getAllPermissions:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addPermission = async (req, res) => {
  try {
    const result = await permissionService.addPermission(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.permission,
    });
  } catch (error) {
    console.error("Lỗi addPermission:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const result = await permissionService.updatePermission(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.permission,
    });
  } catch (error) {
    console.error("Lỗi updatePermission:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const result = await permissionService.deletePermission(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.permission,
    });
  } catch (error) {
    console.error("Lỗi deletePermission:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
