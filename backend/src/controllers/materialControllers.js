import Material from "../models/Material.js";

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json({
      success: true,
      message: "Lấy danh sách vật tư thành công!",
      data: materials,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllMaterial: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addMaterial = async (req, res) => {
  try {
    const { name, type, maintenanceCycle, repoID } = req.body;

    if (!name || !type || !unit) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin vật tư bắt buộc!",
      });
    }

    // Nếu type chỉ là 1 giá trị, ép về mảng
    const typeArray = Array.isArray(type) ? type : [type];

    // Kiểm tra từng type có hợp lệ không
    const validTypes = ["Điện", "Cơ khí", "Hóa chất", "Khác"];
    const invalidType = typeArray.find((t) => !validTypes.includes(t));
    if (invalidType) {
      return res.status(400).json({
        success: false,
        message: `Loại vật tư '${invalidType}' không hợp lệ!`,
      });
    }

    // Nếu có repoID, kiểm tra ràng buộc loại kho
    if (repoID) {
      const repo = await Repository.findOne({ repoID });
      if (!repo) {
        return res.status(404).json({
          success: false,
          message: `Kho '${repoID}' không tồn tại!`,
        });
      }

      const repoType = detectRepoType(repo.repoName);
      if (!typeArray.includes(repoType)) {
        return res.status(400).json({
          success: false,
          message: `Kho '${repo.repoName}' chỉ nhận vật tư loại '${repoType}'!`,
        });
      }
    }

    // Sinh ID tự động
    const count = await Material.countDocuments();
    const materialID = `VT${count + 1}`;

    const newMaterial = await Material.create({
      materialID,
      name,
      type: typeArray,
      maintenanceCycle: maintenanceCycle || 1,
    });

    res.status(201).json({
      success: true,
      message: "Thêm vật tư thành công!",
      data: newMaterial,
    });
  } catch (error) {
    console.error("Lỗi khi gọi addMaterial:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { status, quantity, repairedAt, maintenanceCycle } = req.body;
    const updatedMaterial = await Material.findOneAndUpdate(
      { materialID: req.params.id },
      {
        status,
        quantity,
        repairedAt,
        maintenanceCycle,
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({
        success: false,
        message: "Vật tư không tồn tại",
      });
    }

    res.status(200).json(updatedMaterial);
  } catch (error) {
    console.error("Lỗi khi gọi updateMaterial: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const deleteMaterial = await Material.findOneAndDelete({
      materialID: req.params.id,
    });

    if (!deleteMaterial) {
      return res.status(404).json({
        success: false,
        message: "Vật tư không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa vật tư thành công!",
      data: deleteMaterial,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteMaterial: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
