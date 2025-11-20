import Repository from "../repository/Repository.model.js";
import Material from "../material/Material.model.js";
import User from "../user/User.model.js";

function removeNull(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

async function getAllRepository() {
  const repo = await Repository.find()
    .populate({
      path: "manager",
      select: "userID fullName email -_id",
      populate: { path: "role", select: "roleName -_id" },
    })
    .populate("materials.material", "name type status -_id");

  return repo;
}

async function getRepoMaterials(repoID) {
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
    const err = new Error("Không tìm thấy kho!");
    err.status = 404;
    throw err;
  }

  const materials = repo.materials.map((item) => {
    const mat = item.material || {};
    return {
      ...removeNull(mat),
      materialID: mat.materialID,
      modelType: mat.category,
      quantity: item.quantity,
    };
  });

  return {
    repoName: repo.repoName,
    materials,
  };
}

async function getRepository(repoID) {
  const repo = await Repository.findOne({ repoID })
    .populate("manager", "userID fullName email -_id")
    .populate("materials.material", "materialID name type status");

  if (!repo) {
    const err = new Error("Không tìm thấy kho!");
    err.status = 404;
    throw err;
  }

  const totalMaterials = repo.materials.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return { repo, totalMaterials };
}

async function addRepository(data) {
  const { repoName, location, managerUserID, materials, repoType, repoID } =
    data;

  // Validate input
  if (!repoName || !repoType) {
    const err = new Error("Thiếu tên kho hoặc loại kho!");
    err.status = 400;
    throw err;
  }

  // Check trùng repoName
  if (await Repository.findOne({ repoName })) {
    const err = new Error("Kho đã tồn tại!");
    err.status = 409;
    throw err;
  }

  // Validate manager
  let managerId = null;

  if (managerUserID) {
    const manager = await User.findOne({ userID: managerUserID }).populate(
      "role",
      "roleName roleType"
    );

    if (!manager) {
      const err = new Error("Không tìm thấy người quản lý!");
      err.status = 404;
      throw err;
    }

    if (manager.role.roleName === "Quản lý tổng") {
      managerId = manager._id;
    } else if (manager.role.roleName === "Quản lý kho") {
      if (manager.yourRepo !== repoType) {
        const err = new Error(
          `Người quản lý '${manager.fullName}' thuộc kho '${manager.yourRepo}', không thể quản lý kho '${repoType}'!`
        );
        err.status = 400;
        throw err;
      }
      managerId = manager._id;
    } else {
      const err = new Error("Người này không có quyền quản lý kho!");
      err.status = 403;
      throw err;
    }
  }

  // Validate & xử lý vật tư nhập kho
  const validMaterials = [];

  if (Array.isArray(materials) && materials.length > 0) {
    for (const item of materials) {
      const mat = await Material.findOne({
        materialID: item.material.trim().toUpperCase(),
      });

      if (!mat) {
        const err = new Error(`Không tìm thấy vật tư '${item.material}'!`);
        err.status = 404;
        throw err;
      }

      validMaterials.push({
        material: mat._id,
        quantity: Number(item.quantity) || 0,
      });

      // Trừ vào tồn kho tổng
      mat.quantity -= Number(item.quantity);
      await mat.save();
    }
  }

  // Tạo kho mới
  const newRepo = await Repository.create({
    repoID,
    repoName,
    location,
    repoType,
    manager: managerId,
    materials: validMaterials,
  });

  return {
    message:
      managerId === null
        ? `Tạo kho '${repoName}' thành công (chưa có người quản lý)!`
        : `Tạo kho '${repoName}' thành công và gán cho quản lý!`,
    repo: newRepo,
  };
}

async function updateRepository(repoID, data) {
  const { location, manager, materials } = data;

  const repo = await Repository.findOne({ repoID });

  if (!repo) {
    const err = new Error("Kho không tồn tại!");
    err.status = 404;
    throw err;
  }

  // xử lý manager
  let newManagerID = repo.manager;

  if (manager) {
    const managerUser = await User.findOne({ userID: manager }).populate(
      "role",
      "roleName"
    );

    if (!managerUser) {
      const err = new Error(`Không tìm thấy người dùng ${manager}!`);
      err.status = 404;
      throw err;
    }

    if (managerUser.role.roleName !== "Quản lý kho") {
      const err = new Error("Người này không có quyền quản lý kho!");
      err.status = 403;
      throw err;
    }

    newManagerID = managerUser._id;
  }

  // update vật tư
  if (Array.isArray(materials) && materials.length > 0) {
    for (const item of materials) {
      const qty = Number(item.quantity);

      if (isNaN(qty) || qty <= 0) {
        const err = new Error(`Số lượng không hợp lệ: ${item.quantity}`);
        err.status = 400;
        throw err;
      }

      const mat =
        (await Material.findOne({ materialID: item.material })) ||
        (await Material.findById(item.material));

      if (!mat) {
        const err = new Error(`Không tìm thấy vật tư '${item.material}'!`);
        err.status = 404;
        throw err;
      }

      if (mat.quantity < qty) {
        const err = new Error(
          `Vật tư '${mat.name}' không đủ tồn (còn ${mat.quantity}, yêu cầu ${qty})`
        );
        err.status = 400;
        throw err;
      }

      mat.quantity -= qty;
      await mat.save();

      const index = repo.materials.findIndex(
        (m) => m.material.toString() === mat._id.toString()
      );

      if (index >= 0) repo.materials[index].quantity += qty;
      else repo.materials.push({ material: mat._id, quantity: qty });
    }
  }

  if (location) repo.location = location;
  repo.manager = newManagerID;

  await repo.save();

  const updatedRepo = await Repository.findOne({ repoID })
    .populate("manager", "fullName email role")
    .populate("materials.material", "materialID name type quantity");

  return {
    message: "Cập nhật kho thành công!",
    repo: updatedRepo,
  };
}

async function removeMaterialFromRepo(repoID, data) {
  const { materialID, quantity } = data;

  if (!materialID || quantity == null) {
    const err = new Error("Thiếu mã vật tư hoặc số lượng!");
    err.status = 400;
    throw err;
  }

  const removeQty = Number(quantity);
  if (isNaN(removeQty) || removeQty <= 0) {
    const err = new Error("Số lượng phải lớn hơn 0!");
    err.status = 400;
    throw err;
  }

  const repo = await Repository.findOne({ repoID });

  if (!repo) {
    const err = new Error("Kho không tồn tại!");
    err.status = 404;
    throw err;
  }

  const mat =
    (await Material.findOne({ materialID })) ||
    (await Material.findById(materialID));

  if (!mat) {
    const err = new Error(`Không tìm thấy vật tư '${materialID}'!`);
    err.status = 404;
    throw err;
  }

  const index = repo.materials.findIndex(
    (m) => m.material.toString() === mat._id.toString()
  );

  if (index === -1) {
    const err = new Error("Vật tư không có trong kho!");
    err.status = 404;
    throw err;
  }

  const currentQty = repo.materials[index].quantity;

  if (removeQty > currentQty) {
    const err = new Error(
      `Số lượng cần xóa (${removeQty}) vượt quá hiện có (${currentQty})`
    );
    err.status = 400;
    throw err;
  }

  if (removeQty === currentQty) repo.materials.splice(index, 1);
  else repo.materials[index].quantity -= removeQty;

  mat.quantity += removeQty;
  await mat.save();
  await repo.save();

  return {
    message:
      removeQty === currentQty
        ? `Đã loại bỏ hoàn toàn vật tư '${mat.name}' khỏi kho.`
        : `Đã giảm ${removeQty} vật tư '${mat.name}'.`,
  };
}

async function deleteRepository(repoID) {
  const repo = await Repository.findOne({ repoID });

  if (!repo) {
    const err = new Error("Kho không tồn tại!");
    err.status = 404;
    throw err;
  }

  if (repo.materials.length > 0) {
    const err = new Error(
      `Không thể xóa kho '${repo.repoName}' vì còn vật tư!`
    );
    err.status = 400;
    throw err;
  }

  await Repository.deleteOne({ repoID });

  return {
    message: `Xóa kho '${repo.repoName}' thành công!`,
  };
}

export default {
  getAllRepository,
  getRepoMaterials,
  getRepository,
  addRepository,
  updateRepository,
  removeMaterialFromRepo,
  deleteRepository,
};
