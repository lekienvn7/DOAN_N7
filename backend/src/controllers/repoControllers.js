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
      .populate("materials.material", "name type status -_id")
      .select("-repoType");

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
    const {
      repoName,
      location,
      managerUserID,
      materials,
      equipments,
      repoType,
    } = req.body;

    // Tạo mã kho tự động
    const count = await Repository.countDocuments();
    const repoID = `KH${count + 1}`;

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
      for (const item of materials) {
        let material = null;

        // Cho phép nhập bằng _id, materialID hoặc materialName
        material =
          (await Material.findById(item.material).catch(() => null)) ||
          (await Material.findOne({ materialID: item.material })) ||
          (await Material.findOne({ name: item.material }));

        if (!material) {
          return res.status(404).json({
            success: false,
            message: `Không tìm thấy vật tư '${item.material}'!`,
          });
        }

        // Kiểm tra vật tư có phù hợp với loại kho không
        const isValidType = Array.isArray(material.type)
          ? material.type.includes(repoType)
          : material.type === repoType;

        if (!isValidType) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${material.name}' (loại ${material.type}) không hợp với kho '${repoType}'!`,
          });
        }

        validMaterials.push({
          material: material._id,
          quantity: item.quantity || 0,
        });
      }
    }

    const validEquipments = [];

    if (Array.isArray(equipments) && equipments.length > 0) {
      for (const item of equipments) {
        let equipment = null;

        // Cho phép nhập bằng _id, equipmentID hoặc equipmentName
        equipment =
          (await Equipment.findById(item.equipment).catch(() => null)) ||
          (await Equipment.findOne({ equipmentID: item.equipment })) ||
          (await Equipment.findOne({ equipmentName: item.equipment }));

        if (!equipment) {
          return res.status(404).json({
            success: false,
            message: `Không tìm thấy thiết bị '${item.equipment}'!`,
          });
        }

        // Kiểm tra loại thiết bị (nếu cần ràng buộc theo loại kho)
        const isValidType = Array.isArray(equipment.type)
          ? equipment.type.includes(repoType)
          : equipment.type === repoType;

        if (!isValidType) {
          return res.status(400).json({
            success: false,
            message: `Thiết bị '${equipment.equipmentName}' (loại ${equipment.type}) không hợp với kho '${repoType}'!`,
          });
        }

        validEquipments.push({
          equipment: equipment._id,
          quantity: item.quantity || 0,
        });
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
    // Xác định loại kho từ tên hiện tại
    const repoType = detectRepoType(repo.repoName);

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

    if (materials && materials.length > 0) {
      for (const item of materials) {
        const mat =
          (item.material && (await Material.findById(item.material))) ||
          (await Material.findOne({ materialID: item.material }));
        if (!mat) continue;

        if (mat.type !== repoType) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${mat.name}' (${mat.type}) không phù hợp với kho '${repo.repoName}' (${repoType})!`,
          });
        }

        const index = repo.materials.findIndex(
          (m) => m.material.toString() === item.material
        );

        if (index >= 0) {
          repo.materials[index].quantity = item.quantity;
        } else {
          repo.materials.push({
            material: item.material,
            quantity: item.quantity || 0,
          });
        }
      }
    }

    if (location) repo.location = location;
    repo.manager = newManagerId;

    await repo.save();

    const updatedRepo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "fullName email role")
      .populate("materials.material", "name type unit");

    res.status(200).json({
      success: true,
      message: `Cập nhật kho '${repo.repoName}' thành công!`,
      data: updatedRepo,
    });
  } catch (error) {
    console.error("❌ Lỗi khi gọi updateRepository:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

export const deleteRepository = async (req, res) => {
  try {
    const deleteRepository = await Repository.findOneAndDelete({
      repoID: req.params.id,
    });
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
    console.error("❌ Lỗi khi gọi deleteRepository:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
