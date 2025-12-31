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
import { createNotification } from "../Notification/notice.service.js";
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
    .populate("createdBy", "fullName email userID")
    .populate("updatedBy", "fullName")
    .lean();

  materials.forEach((m) => {
    console.log("material:", m.materialID, "test:", m.test);
  });

  const clean = materials.map((m) => ({
    ...removeNull(m),
    modelType: m.category || "Material",
  }));

  return clean;
}

async function addMaterial(data, file) {
  const {
    name,
    materialID,
    type,
    quantity,
    unit,
    description,
    status,
    createdBy,
    maintenanceCycle,
  } = data;

  if (!name || quantity == null || !createdBy) {
    const err = new Error("Thiếu thông tin bắt buộc!");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ userID: createdBy });
  if (!user) {
    const err = new Error("Không tìm thấy người tạo!");
    err.status = 404;
    throw err;
  }

  const imageUrl = file?.path || ""; // 🌩️ CLOUDINARY URL

  /* ===== 1. KIỂM TRA ĐÃ TỒN TẠI ===== */
  const existedMaterial = await Material.findOne({
    $or: [materialID ? { materialID } : null, { name }].filter(Boolean),
  });

  /* ===== 2. ĐÃ TỒN TẠI → NHẬP THÊM ===== */
  if (existedMaterial) {
    existedMaterial.quantity += Number(quantity);

    // nếu có upload ảnh mới → cập nhật
    if (imageUrl) {
      existedMaterial.imageUrl = imageUrl;
    }

    await existedMaterial.save();

    return {
      action: "IMPORT",
      message: "Nhập thêm vật tư thành công!",
      material: existedMaterial,
    };
  }

  /* ===== 3. TẠO MỚI ===== */
  if (!type || !unit) {
    const err = new Error("Thiếu thông tin tạo vật tư mới!");
    err.status = 400;
    throw err;
  }

  const SelectedModel = modelMap[type];
  if (!SelectedModel) {
    const err = new Error("Loại vật tư không hợp lệ!");
    err.status = 400;
    throw err;
  }

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
    imageUrl, // 🌩️ LƯU ẢNH
    createdBy: user._id,
  });

  try {
    await createNotification({
      type: "material",
      title: "Thêm vật tư",
      message: `${user.fullName} đã thêm vật tư "${name}".`,
      user: user._id,
    });
  } catch (err) {
    console.error("Notification error:", err.message);
  }

  return {
    action: "CREATE",
    message: "Thêm vật tư mới thành công!",
    material: newMaterial,
  };
}

async function updateMaterial(materialID, body, user, file) {
  const material = await Material.findOne({ materialID });
  if (!material) {
    const err = new Error("Vật tư không tồn tại!");
    err.status = 404;
    throw err;
  }

  const type = Array.isArray(material.type) ? material.type[0] : material.type;
  const SelectedModel = modelMap[type];

  const baseFields = [
    "name",
    "quantity",
    "status",
    "unit",
    "description",
    "maintenanceCycle",
    "borrowType",
    "test",
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

  const cleanBase = filterFields(body, baseFields);
  const cleanChild = filterFields(body, childFieldMap[type]);

  // 🌩️ CẬP NHẬT ẢNH NẾU CÓ
  if (file?.path) {
    cleanBase.imageUrl = file.path;
  }

  cleanBase.updatedAt = Date.now();
  if (user?.userID) {
    cleanBase.updatedBy = user._id;
    cleanChild.updatedBy = user._id;
  }

  await Material.findOneAndUpdate({ materialID }, cleanBase);

  if (Object.keys(cleanChild).length > 0) {
    await SelectedModel.findOneAndUpdate({ materialID }, cleanChild);
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
