import maintenanceService from "./maintenance.service.js";

export const addMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.addMaintenance(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.maintenance,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.updateMaintenance(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.maintenance,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMaintenance = async (req, res) => {
  try {
    const list = await maintenanceService.getMaintenance(
      req.user.userID,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách bảo trì thành công!",
      count: list.length,
      data: list,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const autoCheckMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.autoCheckMaintenance();

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không có vật tư nào sắp bảo trì!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Danh sách vật tư sắp tới kỳ bảo trì:",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
