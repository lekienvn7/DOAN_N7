import roleService from "./role.service.js";

export const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách vai trò thành công!",
      data: roles,
    });

  } catch (error) {
    console.error("Lỗi getAllRoles:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const addRole = async (req, res) => {
  try {
    const result = await roleService.addRole(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.role,
    });

  } catch (error) {
    console.error("Lỗi addRole:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const result = await roleService.updateRole(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.role,
    });

  } catch (error) {
    console.error("Lỗi updateRole:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const result = await roleService.deleteRole(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.role,
    });

  } catch (error) {
    console.error("Lỗi deleteRole:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};
