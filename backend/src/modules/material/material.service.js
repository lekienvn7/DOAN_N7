import Material from "./Material.model.js";
import User from "../user/User.model.js";
import { allowedMap, filterFields } from "../../utils/allowField.js";
import ElectricMaterial from "./MaterialModel/Electric.model.js";
import ChemicalMaterial from "./MaterialModel/Chemical.model.js";
import MechanicalMaterial from "./MaterialModel/Mechanical.model.js";
import IotMaterial from "./MaterialModel/Iot.model.js";
import TechnologyMaterial from "./MaterialModel/Technology.model.js";
import AutomotiveMaterial from "./MaterialModel/Automotive.model.js";
import TelecomMaterial from "./MaterialModel/Telecom.model.js";
import FashionMaterial from "./MaterialModel/Fashion.model.js";
import {
  electricFields,
  chemicalFields,
  automotiveFields,
  fashionFields,
  technologyFields,
  telecomFields,
  mechanicalFields,
  iotFields,
} from "../../utils/allowField.js";

function removeNull(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}

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

async function getAllMaterials() {
  const materials = await Material.find()
    .populate("createdBy", "fullName userID")
    .populate("updatedBy", "fullName")
    .lean();

  const clean = materials.map((m) => ({
    ...removeNull(m),
    modelType: m.category || "Material",
  }));

  return clean;
}

async function addMaterial(data) {
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
  } = data;

  const SelectedModel = modelMap[type];

  if (!SelectedModel) {
    const err = new Error("Loại vật tư không hợp lệ!");
    err.status = 400;
    throw err;
  }

  // Validate
  if (!name || !type || !unit || quantity == null) {
    const err = new Error("Thiếu thông tin vật tư bắt buộc!");
    err.status = 400;
    throw err;
  }

  if (await Material.findOne({ materialID })) {
    const err = new Error("Mã vật tư đã tồn tại!");
    err.status = 409;
    throw err;
  }

  if (await Material.findOne({ name })) {
    const err = new Error("Tên vật tư đã tồn tại!");
    err.status = 409;
    throw err;
  }

  const user = await User.findOne({ userID: createdBy });
  if (!user) {
    const err = new Error("Không tìm thấy người tạo!");
    err.status = 404;
    throw err;
  }

  // CLEAN FIELD
  const allowed = allowedMap[type];
  const cleanData = filterFields(data, allowed);

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
    createdBy: user._id,
  });

  return {
    message: "Thêm vật tư thành công!",
    material: newMaterial,
  };
}

async function updateMaterial(materialID, body, user) {
  const material = await Material.findOne({ materialID });

  if (!material) {
    const err = new Error("Vật tư không tồn tại!");
    err.status = 404;
    throw err;
  }

  const type = Array.isArray(material.type) ? material.type[0] : material.type;
  const SelectedModel = modelMap[type];

  if (!SelectedModel) {
    const err = new Error(`Không tìm thấy model con cho loại '${type}'!`);
    err.status = 500;
    throw err;
  }

  // BASE FIELDS
  const baseFields = [
    "name",
    "quantity",
    "status",
    "unit",
    "description",
    "maintenanceCycle",
  ];

  const childFieldMap = {
    electric: electricFields,
    chemical: chemicalFields,
    automotive: automotiveFields,
    fashion: fashionFields,
    technology: technologyFields,
    telecom: telecomFields,
    mechanical: mechanicalFields,
    iot: iotFields,
  };

  const childFields = childFieldMap[type];

  const cleanBase = filterFields(body, baseFields);
  const cleanChild = filterFields(body, childFields);

  delete cleanBase.type;
  delete cleanBase.materialID;
  delete cleanChild.type;
  delete cleanChild.materialID;

  cleanBase.updatedAt = Date.now();

  if (user?.userID) {
    cleanBase.updatedBy = user.userID;
    cleanChild.updatedBy = user.userID;
  }

  // Update base
  const baseUpdated = await Material.findOneAndUpdate(
    { materialID },
    cleanBase,
    { new: true }
  );

  // Update detail (chỉ update nếu có field)
  let detailUpdated;

  if (Object.keys(cleanChild).length > 0) {
    detailUpdated = await SelectedModel.findOneAndUpdate(
      { materialID },
      cleanChild,
      { new: true }
    );
  } else {
    detailUpdated = await SelectedModel.findOne({ materialID });
  }

  const populatedBase = await Material.findOne({ materialID })
    .populate("updatedBy", "fullName email role")
    .lean();

  const detailData = await SelectedModel.findOne({ materialID }).lean();

  return {
    message: "Cập nhật vật tư thành công!",
    result: {
      base: populatedBase,
      detail: detailData,
    },
  };
}

async function deleteMaterial(materialID) {
  const deleted = await Material.findOneAndDelete({ materialID });

  if (!deleted) {
    const err = new Error("Vật tư không tồn tại!");
    err.status = 404;
    throw err;
  }

  return {
    message: "Xóa vật tư thành công!",
    material: deleted,
  };
}

export default {
  getAllMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
};
