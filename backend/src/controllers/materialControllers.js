import Material from "../models/Material.js";
import User from "../models/User.js";
import { allowedMap, filterFields } from "../utils/allowField.js";
import ElectricMaterial from "../models/ElectricMaterial.js";
import ChemicalMaterial from "../models/ChemicalMaterial.js";
import MechanicalMaterial from "../models/MechanicalMaterial.js";
import IotMaterial from "../models/IotMaterial.js";
import TechnologyMaterial from "../models/TechnologyMaterial.js";
import AutomotiveMaterial from "../models/AutomotiveMaterial.js";
import TelecomMaterial from "../models/TelecomMaterial.js";
import FashionMaterial from "../models/FashionMaterial.js";

function removeNullFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("createdBy", "fullName userID")
      .populate("updatedBy", "fullName")
      .lean(); // trả về object thuần, dễ xử lý field

    const clean = materials.map((m) => ({
      ...removeNullFields(m),
      modelType: m.category || m.modelType || "Material",
    }));

    res.status(200).json({
      success: true,
      message: "Lấy danh sách vật tư thành công!",
      data: clean,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllMaterials:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addMaterial = async (req, res) => {
  try {
    const {
      name,
      materialID,
      type,
      status,
      quantity,
      unit,
      description,
      createdBy,
      maintenanceCycle,
    } = req.body;

    const modelMap = {
      electric: ElectricMaterial,
      chemical: ChemicalMaterial,
      mechanical: MechanicalMaterial,
      iot: IotMaterial,
      technology: TechnologyMaterial,
      automotive: AutomotiveMaterial,
      telecom: TelecomMaterial,
      fashion: FashionMaterial,
    };

    const SelectedModel = modelMap[type];

    if (!SelectedModel) {
      return res
        .status(400)
        .json({ success: false, message: "Loại vật tư không hợp lệ!" });
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !type || !unit || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin vật tư bắt buộc!",
      });
    }

    if (await Material.findOne({ materialID })) {
      return res
        .status(409)
        .json({ success: false, message: "Mã vật tư đã tồn tại!" });
    }

    // Kiểm tra người tạo
    const existingUser = await User.findOne({ userID: createdBy });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản người tạo!",
      });
    }

    const allowedFields = allowedMap[type];
    const cleanData = filterFields(req.body, allowedFields);

    delete cleanData.type;

    const newMaterial = await SelectedModel.create({
      ...cleanData,

      materialID,
      name,
      type,
      quantity,
      unit,
      description,
      status,
      maintenanceCycle,
      createdBy: existingUser._id,
    });

    // Sau khi hoàn tất mới trả về
    return res.status(201).json({
      success: true,
      message: "Thêm vật tư và nhập kho thành công!",
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
    const materialID = req.params.id;

    const existingMaterial = await Material.findOne({ materialID });

    if (!existingMaterial) {
      return res.status(404).json({
        success: false,
        message: "Vật tư không tồn tại!",
      });
    }

    const type = existingMaterial.type;

    const modelMap = {
      electric: ElectricMaterial,
      chemical: ChemicalMaterial,
      mechanical: MechanicalMaterial,
      iot: IotMaterial,
      technology: TechnologyMaterial,
      automotive: AutomotiveMaterial,
      telecom: TelecomMaterial,
      fashion: FashionMaterial,
    };

    const SelectedModel = modelMap[type];

    if (!SelectedModel) {
      return res.status(500).json({
        success: false,
        message: `Không thể xác định model con cho loại vật tư '${type}'`,
      });
    }

    // 3. Lọc các field cho phép
    const allowedFields = allowedMap[type];
    const cleanData = filterFields(req.body, allowedFields);

    // Không cho phép đổi type hoặc materialID hoặc createdBy
    delete cleanData.type;
    delete cleanData.materialID;
    delete cleanData.createdBy;

    // 4. Ghi thông tin người sửa
    cleanData.updatedBy = req.user?.userID; // hoặc token userId
    cleanData.updatedAt = Date.now();

    // 5. Update bằng model con
    const updatedMaterial = await SelectedModel.findOneAndUpdate(
      { materialID },
      cleanData,
      { new: true }
    );

    return res.status(200).json({
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
