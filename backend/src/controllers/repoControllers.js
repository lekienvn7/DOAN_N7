import Repository from "../models/Repository.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

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

function removeNullFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}

export const getRepoMaterials = async (req, res) => {
  try {
    const { repoID } = req.params;

    const repo = await Repository.findOne({ repoID })
      .populate({
        path: "materials.material",
        populate: [
          { path: "createdBy", select: "fullName email userID" },
          { path: "updatedBy", select: "fullName email" },
        ],
      })
      .lean();

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kho!",
      });
    }

    const materialsList = repo.materials.map((item) => {
      const mat = item.material;

      return {
        ...removeNullFields(mat), // vật tư sạch
        materialID: mat.materialID,
        modelType: mat.category, // ElectricMaterial / ChemicalMaterial...
        quantity: item.quantity, // số lượng trong kho
      };
    });

    res.status(200).json({
      success: true,
      repoName: repo.repoName,
      materials: materialsList,
    });
  } catch (error) {
    console.error("Lỗi khi chạy getRepoMaterials", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
    });
  }
};

export const getRepository = async (req, res) => {
  try {
    const repo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "userID fullName email -_id")
      .populate("materials.material", "materialID name type status ");

    if (!repo) {
      return res.status(404).json({ message: "Không tìm thấy kho!" });
    }

    const totalMaterials = repo.materials.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Lấy thông tin kho thành công!",
      data: repo,
      totalMaterials,
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
    const { location, manager, materials } = req.body;

    const repo = await Repository.findOne({ repoID: req.params.id });
    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Kho không tồn tại!",
      });
    }

    let newManagerId = repo.manager;
    if (manager) {
      const managerUser = await User.findOne({ userID: manager }).populate(
        "role",
        "roleName roleID"
      );

      if (!managerUser)
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy người dùng ${manager}!`,
        });

      if (managerUser.role.roleName !== "Quản lý kho")
        return res.status(403).json({
          success: false,
          message: "Người này không có quyền quản lý kho!",
        });

      newManagerId = managerUser._id;
    }

    // Update danh sách vật tư trong kho
    if (Array.isArray(materials) && materials.length > 0) {
      for (const item of materials) {
        const requestedQty = Number(item.quantity);

        if (isNaN(requestedQty) || requestedQty <= 0) {
          return res.status(400).json({
            success: false,
            message: `Số lượng vật tư không hợp lệ: ${item.quantity}`,
          });
        }

        // Tìm vật tư
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

        // Check tồn kho tổng (Material.quantity)
        if (mat.quantity < requestedQty) {
          return res.status(400).json({
            success: false,
            message: `Vật tư '${mat.name}' không đủ tồn kho (còn ${mat.quantity}, yêu cầu ${requestedQty}).`,
          });
        }

        // Trừ tồn kho nguồn
        mat.quantity -= requestedQty;
        await mat.save();

        // Thêm hoặc cộng số lượng vật tư trong repo
        const index = repo.materials.findIndex(
          (m) => m.material.toString() === mat._id.toString()
        );

        if (index >= 0) {
          repo.materials[index].quantity += requestedQty;
        } else {
          repo.materials.push({
            material: mat._id,
            quantity: requestedQty,
          });
        }
      }
    }

    // Update location + manager
    if (location) repo.location = location;
    repo.manager = newManagerId;

    // Lưu thay đổi
    await repo.save();

    // Trả về repo đầy đủ
    const updatedRepo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "fullName email role")
      .populate("materials.material", "materialID name type unit quantity");

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
    const { materialID, quantity } = req.body;

    if (!materialID || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã vật tư hoặc số lượng!",
      });
    }

    const removeQty = Number(quantity);
    if (isNaN(removeQty) || removeQty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng cần xóa phải lớn hơn 0!",
      });
    }

    // Tìm kho
    const repo = await Repository.findOne({ repoID: req.params.id });

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Kho không tồn tại!",
      });
    }

    const repoType = repo.repoType.trim().toLowerCase();

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

    // Check loại vật tư có khớp loại kho không
    // Không cho remove vật tư không thuộc kho (dạng mismatch)
    if (mat.type.trim().toLowerCase() !== repoType) {
      return res.status(400).json({
        success: false,
        message: `Vật tư '${mat.name}' thuộc loại '${mat.type}', không thể xử lý trong kho '${repo.repoName}' (${repoType})!`,
      });
    }

    // Tìm vật tư trong kho
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

    // Validate tồn kho trong repo
    if (removeQty > currentQty) {
      return res.status(400).json({
        success: false,
        message: `Số lượng cần xóa (${removeQty}) vượt quá số lượng hiện có (${currentQty})!`,
      });
    }

    // Cập nhật số lượng
    if (removeQty === currentQty) {
      // Xóa hoàn toàn khỏi repo
      repo.materials.splice(index, 1);
    } else {
      // Giảm số lượng
      repo.materials[index].quantity -= removeQty;
    }

    // Trả lại số lượng vào bảng Material (tồn kho tổng)
    mat.quantity += removeQty;
    await mat.save();

    // Lưu repo
    await repo.save();

    // Trả về bản repo mới
    const updatedRepo = await Repository.findOne({ repoID: req.params.id })
      .populate("manager", "fullName email role")
      .populate("materials.material", "materialID name type unit quantity");

    res.status(200).json({
      success: true,
      message:
        removeQty === currentQty
          ? `Đã loại bỏ vật tư '${mat.name}' khỏi kho '${repo.repoName}'.`
          : `Đã giảm ${removeQty} vật tư '${mat.name}' trong kho '${repo.repoName}'.`,
      data: updatedRepo,
    });
  } catch (error) {
    console.error("Lỗi khi xóa vật tư khỏi kho:", error);
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
