import Repository from "../repository/Repository.model.js";
import Material from "../material/Material.model.js";
import Transaction from "./Transaction.model.js";
import User from "../user/User.model.js";

async function getTransaction(data) {
  const { repoID, materialID, type, userID } = data;

  const filter = {};

  // Lọc theo kho
  if (repoID) {
    const repo = await Repository.findOne({ repoID });
    if (!repo) {
      const error = new Error(`Kho '${repoID}' không tồn tại!`);
      error.status = 404;
      throw error;
    }
    filter.repository = repo._id;
  }

  // Lọc theo vật tư
  if (materialID) {
    const material = await Material.findOne({ materialID });
    if (!material) {
      const error = new Error(`Vật tư '${materialID}' không tồn tại!`);
      error.status = 404;
      throw error;
    }
    filter.material = material._id;
  }

  // Lọc theo loại giao dịch
  if (type) {
    if (!["import", "export"].includes(type)) {
      const error = new Error("Loại giao dịch không hợp lệ!");
      error.status = 400;
      throw error;
    }
    filter.type = type;
  }

  // Lọc theo người tạo
  if (userID) {
    const user = await User.findOne({ userID });
    if (!user) {
      const error = new Error(`Người dùng '${userID}' không tồn tại!`);
      error.status = 404;
      throw error;
    }
    filter.createdBy = user._id;
  }

  const transactions = await Transaction.find(filter)
    .populate("repository", "repoID repoName -_id")
    .populate("material", "materialID name type -_id")
    .populate("createdBy", "userID fullName email -_id")
    .sort({ createdAt: -1 });

  if (!transactions.length) {
    const error = new Error("Không có giao dịch nào phù hợp!");
    error.status = 404;
    throw error;
  }

  return { message: "Lấy danh sách giao dịch thành công!", transactions };
}

async function addTransaction(data) {
  const { repository, material, type, quantity, createdBy, note } = data;

  // Kiểm tra đầu vào
  if (!repository || !material || !type || !quantity || !createdBy) {
    const error = new Error("Thiếu thông tin giao dịch!");
    error.status = 400;
    throw error;
  }

  // Tìm kho
  const existingRepo = await Repository.findOne({ repoID: repository });
  if (!existingRepo) {
    const error = new Error("Kho không tồn tại!");
    error.status = 404;
    throw error;
  }

  // Tìm người tạo
  const existingUser = await User.findOne({ userID: createdBy });
  if (!existingUser) {
    const error = new Error("Người dùng không tồn tại!");
    error.status = 404;
    throw error;
  }

  // Tìm vật tư
  const targetItem = await Material.findOne({ materialID: material });
  if (!targetItem) {
    const error = new Error("Vật tư không tồn tại!");
    error.status = 404;
    throw error;
  }

  // Mã giao dịch tự động
  const transactionID = `GD${Date.now()}`;

  // Xử lý tồn kho
  let beforeQuantity = 0;
  let afterQuantity = 0;

  const matIndex = existingRepo.materials.findIndex(
    (m) => m.material.toString() === targetItem._id.toString()
  );

  if (matIndex === -1) {
    // Vật tư chưa có trong kho
    if (type === "export") {
      const error = new Error("Vật tư chưa có trong kho để xuất!");
      error.status = 400;
      throw error;
    }

    // import → thêm mới
    existingRepo.materials.push({
      material: targetItem._id,
      quantity,
    });

    beforeQuantity = 0;
    afterQuantity = quantity;
  } else {
    // Vật tư đã có trong kho
    beforeQuantity = existingRepo.materials[matIndex].quantity;

    if (type === "import") {
      existingRepo.materials[matIndex].quantity += quantity;
    } else {
      // export
      if (beforeQuantity < quantity) {
        const error = new Error("Không đủ số lượng vật tư trong kho!");
        error.status = 400;
        throw error;
      }

      existingRepo.materials[matIndex].quantity -= quantity;
    }

    afterQuantity = existingRepo.materials[matIndex].quantity;
  }

  await existingRepo.save();

  // Tạo giao dịch
  const transaction = await Transaction.create({
    transactionID,
    repository: existingRepo._id,
    material: targetItem._id,
    type,
    quantity,
    createdBy: existingUser._id,
    beforeQuantity,
    afterQuantity,
    note,
  });

  return {
    message: `Tạo giao dịch ${
      type === "import" ? "nhập" : "xuất"
    } vật tư thành công!`,
    transaction,
  };
}

export default {
  getTransaction,
  addTransaction,
};
