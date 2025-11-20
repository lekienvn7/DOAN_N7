import materialService from "./material.service.js";

export const getAllMaterials = async (req, res) => {
  try {
    const data = await materialService.getAllMaterials();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách vật tư thành công!",
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addMaterial = async (req, res) => {
  try {
    const result = await materialService.addMaterial(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.material,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const result = await materialService.updateMaterial(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const result = await materialService.deleteMaterial(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.material,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
