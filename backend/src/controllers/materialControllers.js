import Material from "../models/Material.js";
import User from "../models/User.js";
import { allowedMap, filterFields } from "../utils/allowField.js";
import ElectricMaterial from "../models/MaterialModel/ElectricMaterial.js";
import ChemicalMaterial from "../models/MaterialModel/ChemicalMaterial.js";
import MechanicalMaterial from "../models/MaterialModel/MechanicalMaterial.js";
import IotMaterial from "../models/MaterialModel/IotMaterial.js";
import TechnologyMaterial from "../models/MaterialModel/TechnologyMaterial.js";
import AutomotiveMaterial from "../models/MaterialModel/AutomotiveMaterial.js";
import TelecomMaterial from "../models/MaterialModel/TelecomMaterial.js";
import FashionMaterial from "../models/MaterialModel/FashionMaterial.js";
import {
  electricFields,
  chemicalFields,
  automotiveFields,
  fashionFields,
  technologyFields,
  telecomFields,
  mechanicalFields,
  iotFields,
} from "../utils/allowField.js";

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

    if (await Material.findOne({ name })) {
      return res
        .status(409)
        .json({ success: false, message: "Vật tư đã tồn tại!" });
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

    const type = Array.isArray(existingMaterial.type)
      ? existingMaterial.type[0]
      : existingMaterial.type;

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
        message: `Không tìm thấy model con cho loại '${type}'`,
      });
    }

    // FIELD CHA
    const baseFields = [
      "name",
      "quantity",
      "status",
      "unit",
      "description",
      "maintenanceCycle",
    ];

    // FIELD CON THEO TYPE
    const childFieldMap = {
      electric: electricFields,
      chemical: chemicalFields,
      mechanical: mechanicalFields,
      iot: iotFields,
      technology: technologyFields,
      automotive: automotiveFields,
      telecomFields,
      fashion: fashionFields,
    };

    const childFields = childFieldMap[type];

    // CLEAN FIELD
    const cleanBase = filterFields(req.body, baseFields);
    const cleanChild = filterFields(req.body, childFields);

    delete cleanBase.materialID;
    delete cleanBase.type;

    delete cleanChild.materialID;
    delete cleanChild.type;

    cleanBase.updatedAt = Date.now();
    cleanChild.updatedAt = Date.now();

    if (req.user?.userID) {
      cleanBase.updatedBy = req.user.userID;
      cleanChild.updatedBy = req.user.userID;
    }

    // UPDATE CHA
    const updatedMaterial = await Material.findOneAndUpdate(
      { materialID },
      cleanBase,
      { new: true }
    );

    // UPDATE CON
    const updatedChild = await SelectedModel.findOneAndUpdate(
      { materialID },
      cleanChild,
      { new: true }
    );

    console.log(req.body, req.params);

    return res.status(200).json({
      success: true,
      message: "Cập nhật vật tư thành công!",
      data: {
        base: updatedMaterial,
        detail: updatedChild,
      },
    });
  } catch (error) {
    console.log("Lỗi updateMaterial:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
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
