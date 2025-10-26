import Material from "../models/Material.js";

const detectRepoType = (repoName) => {
  if (repoName.toLowerCase().includes("điện")) return "Điện";
  if (repoName.toLowerCase().includes("hóa")) return "Hóa chất";
  if (repoName.toLowerCase().includes("cơ khí")) return "Cơ khí";
  if (repoName.toLowerCase().includes("nhúng")) return "Nhúng";
  if (repoName.toLowerCase().includes("công nghệ thông tin"))
    return "Công nghệ thông tin";
  if (
    repoName.toLowerCase().includes("oto") ||
    repoName.toLowerCase().includes("ô tô")
  )
    return "Ô tô";
  if (repoName.toLowerCase().includes("điện tử")) return "Điện tử";
  if (repoName.toLowerCase().includes("thời trang")) return "Thời trang";
  return null;
};

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
    const { name, type, repoID, quantity, unit, description, icon, createdBy } =
      req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !type || !unit || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin vật tư bắt buộc!",
      });
    }

    // Chuyển type về mảng nếu chưa phải
    const typeArray = Array.isArray(type) ? type : [type];

    // Danh sách loại vật tư hợp lệ
    const validTypes = [
      "Điện",
      "Hóa chất",
      "Cơ khí",
      "Nhúng",
      "Công nghệ thông tin",
      "Ô tô",
      "Điện tử",
      "Thời trang",
    ];

    const invalidType = typeArray.find((t) => !validTypes.includes(t));
    if (invalidType) {
      return res.status(400).json({
        success: false,
        message: `Loại vật tư '${invalidType}' không hợp lệ!`,
      });
    }

    // Nếu có repoID → kiểm tra loại kho có trùng với loại vật tư không
    if (repoID) {
      const repo = await Repository.findOne({ repoID });
      if (!repo) {
        return res.status(404).json({
          success: false,
          message: `Kho '${repoID}' không tồn tại!`,
        });
      }

      const repoType = detectRepoType(repo.repoName);
      if (repoType && !typeArray.includes(repoType)) {
        return res.status(400).json({
          success: false,
          message: `Kho '${repo.repoName}' chỉ nhận vật tư loại '${repoType}'!`,
        });
      }
    }

    // Kiểm tra người tạo
    const existingUser = await User.findOne({ userID: createdBy });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản người tạo!",
      });
    }

    // Sinh mã vật tư tự động
    const count = await Material.countDocuments();
    const materialID = `VT${String(count + 1).padStart(3, "0")}`;

    // Tạo vật tư mới
    const newMaterial = await Material.create({
      materialID,
      name,
      type: typeArray[0], // gán category chính
      quantity,
      unit,
      description,
      icon,
      createdBy: existingUser._id,
    });

    res.status(201).json({
      success: true,
      message: "Thêm vật tư thành công!",
      data: newMaterial,
    });
  } catch (error) {
    console.error("Lỗi khi thêm vật tư:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi thêm vật tư!",
      error: error.message,
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { status, quantity, description, addType, removeType } = req.body;

    // Chuẩn bị đối tượng cập nhật
    const updateOps = {
      $set: { status, quantity, description },
    };

    if (addType)
      updateOps.$addToSet = {
        type: { $each: Array.isArray(addType) ? addType : [addType] },
      };

    if (removeType)
      updateOps.$pull = {
        type: { $in: Array.isArray(removeType) ? removeType : [removeType] },
      };

    // Thực hiện cập nhật
    const updatedMaterial = await Material.findOneAndUpdate(
      { materialID: req.params.id },
      updateOps,
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({
        success: false,
        message: "Vật tư không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật vật tư thành công!",
      data: updatedMaterial,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateMaterial:", error);
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
