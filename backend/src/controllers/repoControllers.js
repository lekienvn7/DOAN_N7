import Repository from "../models/Repository.js";
import Material from "../models/Material.js";
import User from "../models/User.js";
import { detectRepoType } from "../utils/repoUtils.js";

export const getAllRepository = async (req, res) => {
  try {
    const repo = await Repository.find()
      .populate({
        path: "manager",
        select: "userID fullName email -_id",
        populate: {
          path: "role",
          select: "roleName -_id",
        },
      })
      .populate("materials.material", "name type status -_id");

    res.status(200).json({
      success: true,
      message: "Lấy thông tin kho thành công!",
      data: repo,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllRepositories: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const getRepoMaterials = async (req, res) => {
  try {
    const { repoID } = req.params;

    const repo = await Repository.findOne({ repoID })
      .populate("materials.material")
      .lean();

    if (!repo) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy kho!" });
    }

    const materialsList = repo.materials.map((item) => ({
      _id: item.material._id,
      name: item.material.name,
      unit: item.material.unit,
      type: item.material.type,
      quantity: item.quantity,
      createdAt: item.material.createdAt,
      voltageRange: item.material.voltageRange,
      power: item.material.power,
      materialInsulation: item.material.materialInsulation,
      chemicalFormula: item.material.chemicalFormula,
      chemicalNote: item.material.chemicalNote,
      expiryDate: item.material.expiryDate,
      metalType: item.material.metalType,
      weight: item.material.weight,
      coating: item.material.coating,
      communicationProtocol: item.material.communicationProtocol,
      sensorType: item.material.sensorType,
      powerSupply: item.material.powerSupply,
      deviceType: item.material.deviceType,
      Specification: item.material.Specification,
      networkInterface: item.material.networkInterface,
      partType: item.material.partType,
      vehicleModel: item.material.vehicleModel,
      manufacturer: item.material.manufacturer,
      signalType: item.material.signalType,
      bandwidth: item.material.bandwidth,
      connectorType: item.material.connectorType,
      material: item.material.material,
      color: item.color,
      origin: item.origin,
    }));

    res.status(200).json({
      success: true,
      repoName: repo.repoName,
      materials: materialsList,
    });
  } catch (error) {
    console.error("Lỗi khi chạy getRepoMaterial", error);
    res.status(500).json({ sucess: false, message: "Lỗi hệ thống!" });
  }
};

export const getRepository = async (req, res) => {
  try {
    const repo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "userID fullName email -_id")
      .populate("materials.material", "materialID name type status -_id");

    if (!repo) {
      return res.status(404).json({ message: "Không tìm thấy kho!" });
    }

    res.status(200).json({
      success: true,
      message: "Lấy thông tin kho thành công!",
      data: repo,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getRepositories: ", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const addRepository = async (req, res) => {
  try {
    const { repoName, location, managerUserID, materials, repoType, repoID } =
      req.body;

    // Kiểm tra đầu vào
    if (!repoName || !repoType) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tên hoặc loại kho!",
      });
    }

    // Kiểm tra trùng tên kho
    const existingRepo = await Repository.findOne({ repoName });
    if (existingRepo) {
      return res.status(409).json({
        success: false,
        message: "Kho đã tồn tại!",
      });
    }

    // Xử lý người quản lý
    let managerId = null;
    let managerName = null;

    if (managerUserID) {
      const manager = await User.findOne({ userID: managerUserID }).populate(
        "role",
        "roleName roleType"
      );

      if (!manager) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng quản lý!",
        });
      }

      if (manager.role.roleName === "Quản lý tổng") {
        managerId = manager._id;
        managerName = manager.fullName;
      } else if (manager.role.roleName === "Quản lý kho") {
        if (manager.role.roleType !== repoType) {
          return res.status(400).json({
            success: false,
            message: `Người quản lý '${manager.fullName}' phụ trách kho loại '${manager.role.roleType}', không thể gán cho kho '${repoType}'!`,
          });
        }
        managerId = manager._id;
        managerName = manager.fullName;
      } else {
        return res.status(403).json({
          success: false,
          message: "Người này không có quyền quản lý kho!",
        });
      }
    }

    const validMaterials = [];

    if (Array.isArray(materials) && materials.length > 0) {
      const findMaterial = async (key) => {
        const cleanKey = key.trim();

        // thử _id
        if (mongoose.Types.ObjectId.isValid(cleanKey)) {
          const foundById = await Material.findById(cleanKey);
          if (foundById) return foundById;
        }

        const foundByMaterialID = await Material.findOne({
          materialID: cleanKey.toUpperCase(),
        });
        if (foundByMaterialID) return foundByMaterialID;

        const foundByName = await Material.findOne({
          name: new RegExp(`^${cleanKey}$`, "i"), // so khớp tên không phân biệt hoa thường
        });

        return foundByName;
      };

      for (const item of materials) {
        const material = await findMaterial(item.material);

        if (!material) {
          return res.status(404).json({
            success: false,
            message: `Không tìm thấy vật tư '${item.material}'!`,
          });
        }

        const normalize = (str) =>
          str
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const repoTypeClean = normalize(repoType);
        const materialTypeClean = Array.isArray(material.type)
          ? material.type.map(normalize)
          : [normalize(material.type)];

        const isValidType = materialTypeClean.includes(repoTypeClean);

        if (!isValidType) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${material.name}' (loại ${material.type}) không hợp với kho '${repoType}'!`,
          });
        }

        // Check số lượng
        if (material.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${material.name}' không đủ số lượng (còn ${material.quantity}, yêu cầu ${item.quantity})`,
          });
        }

        validMaterials.push({
          material: material._id,
          quantity: Number(item.quantity) || 0,
        });

        material.quantity -= Number(item.quantity);
        await material.save();
      }
    }

    const newRepo = await Repository.create({
      repoID,
      repoName,
      location,
      repoType,
      manager: managerId,
      materials: validMaterials,
    });

    res.status(201).json({
      success: true,
      message: managerName
        ? `Tạo kho '${repoName}' thành công và gán cho '${managerName}'!`
        : `Tạo kho '${repoName}' thành công (chưa có người quản lý)!`,
      data: newRepo,
    });
  } catch (error) {
    console.error("Lỗi khi gọi addRepository:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const updateRepository = async (req, res) => {
  try {
    const { location, managerUserID, materials } = req.body;

    // Tìm kho theo repoID
    const repo = await Repository.findOne({ repoID: req.params.id });
    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Kho không tồn tại!",
      });
    }

    const repoType = repo.repoType; // Ví dụ: "chemical"

    // Xử lý cập nhật người quản lý (nếu có)
    let newManagerId = repo.manager;
    if (managerUserID) {
      const managerUser = await User.findOne({
        userID: managerUserID,
      }).populate("role", "roleName roleID");

      if (!managerUser) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy người dùng có userID = ${managerUserID}!`,
        });
      }

      if (managerUser.role.roleName !== "Quản lý kho") {
        return res.status(403).json({
          success: false,
          message: "Người này không có quyền quản lý kho!",
        });
      }

      newManagerId = managerUser._id;
    }

    // Cập nhật danh sách vật tư
    if (Array.isArray(materials) && materials.length > 0) {
      for (const item of materials) {
        // Tìm vật tư theo id hoặc mã
        const mat =
          (await Material.findById(item.material).catch(() => null)) ||
          (await Material.findOne({ materialID: item.material })) ||
          (await Material.findOne({ name: item.material }));

        if (!mat) {
          return res.status(404).json({
            success: false,
            message: `Không tìm thấy vật tư '${item.material}'!`,
          });
        }

        // Kiểm tra vật tư có phù hợp loại kho không
        const materialTypes = Array.isArray(mat.type) ? mat.type : [mat.type];
        const isValidType = materialTypes.some(
          (t) => t.trim().toLowerCase() === repoType.trim().toLowerCase()
        );

        if (!isValidType) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${mat.name}' (${materialTypes.join(
              ", "
            )}) không phù hợp với kho '${repo.repoName}' (${repoType})!`,
          });
        }

        // Kiểm tra tồn kho có đủ không
        const requestedQty = item.quantity || 0;
        if (mat.quantity < requestedQty) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${mat.name}' không đủ số lượng để thêm (hiện có ${mat.quantity}, yêu cầu ${requestedQty}).`,
          });
        }

        // Nếu đủ, trừ số lượng vật tư trong bảng Material
        mat.quantity -= requestedQty;
        await mat.save();

        // Kiểm tra xem vật tư đã có trong kho chưa
        const existingIndex = repo.materials.findIndex(
          (m) => m.material.toString() === mat._id.toString()
        );

        if (existingIndex >= 0) {
          // Nếu có rồi → cộng thêm
          repo.materials[existingIndex].quantity += requestedQty;
        } else {
          // Nếu chưa có → thêm mới
          repo.materials.push({
            material: mat._id,
            quantity: requestedQty,
          });
        }
      }
    }

    // Cập nhật thông tin khác của kho
    if (location) repo.location = location;
    repo.manager = newManagerId;

    await repo.save();

    // Trả về kho đã cập nhật, populate đầy đủ
    const updatedRepo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "fullName email role")
      .populate("materials.material", "name type unit quantity");

    res.status(200).json({
      success: true,
      message: `Cập nhật kho '${repo.repoName}' thành công!`,
      data: updatedRepo,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateRepository:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const removeMaterialFromRepo = async (req, res) => {
  try {
    const { materialID, quantity } = req.body; // ví dụ: { "materialID": "VT003", "quantity": 5 }
    const repo = await Repository.findOne({ repoID: req.params.id });

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Kho không tồn tại!",
      });
    }

    // Tìm vật tư trong database
    const mat =
      (await Material.findOne({ materialID })) ||
      (await Material.findById(materialID));

    if (!mat) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy vật tư '${materialID}'!`,
      });
    }

    // Tìm vật tư đó trong kho
    const index = repo.materials.findIndex(
      (m) => m.material.toString() === mat._id.toString()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Vật tư '${mat.name}' không tồn tại trong kho '${repo.repoName}'!`,
      });
    }

    const currentQty = repo.materials[index].quantity;
    const removeQty = Number(quantity);

    // ⚖️ Kiểm tra số lượng hợp lệ
    if (removeQty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng cần xóa phải lớn hơn 0!",
      });
    }

    if (removeQty > currentQty) {
      return res.status(400).json({
        success: false,
        message: `Số lượng cần xóa (${removeQty}) vượt quá số lượng hiện có (${currentQty})!`,
      });
    }

    // Cập nhật lại số lượng hoặc xóa khỏi kho nếu = 0
    if (removeQty === currentQty) {
      // Xóa hoàn toàn khỏi kho
      repo.materials.splice(index, 1);
    } else {
      // Giảm số lượng còn lại
      repo.materials[index].quantity -= removeQty;
    }

    // Cộng lại vào tồn kho chung trong bảng Material
    mat.quantity += removeQty;
    await mat.save();

    await repo.save();

    const updatedRepo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "fullName email role")
      .populate("materials.material", "name type unit");

    res.status(200).json({
      success: true,
      message:
        removeQty === currentQty
          ? `Đã xóa vật tư '${mat.name}' khỏi kho '${repo.repoName}'!`
          : `Đã giảm ${removeQty} vật tư '${mat.name}' trong kho '${repo.repoName}'!`,
      data: updatedRepo,
    });
  } catch (error) {
    console.error("Lỗi khi xóa vật tư khỏi kho:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi xóa vật tư khỏi kho!",
      error: error.message,
    });
  }
};


export const deleteRepository = async (req, res) => {
  try {
    const deleteRepository = await Repository.findOneAndDelete({
      repoID: req.params.id,
    });
    if (!deleteRepository) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kho!",
      });
    }
    if (deleteRepository.materials.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa kho '${deletedRepo.repoName}' vì vẫn còn vật tư!`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Xóa kho '${deleteRepository.repoName}' thành công!`,
      data: deleteRepository,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteRepository:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
