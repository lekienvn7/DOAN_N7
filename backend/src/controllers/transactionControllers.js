import Repository from "../models/Repository.js";
import Material from "../models/Material.js";
import Equipment from "../models/Equipment.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/* LẤY DANH SÁCH GIAO DỊCH */
export const getTransaction = async (req, res) => {
  try {
    const { repoID, materialID, equipmentID, type, userID } = req.query;

    const filter = {};

    // Lọc theo kho
    if (repoID) {
      const repo = await Repository.findOne({ repoID });
      if (!repo)
        return res
          .status(404)
          .json({ message: `Kho '${repoID}' không tồn tại!` });
      filter.repository = repo._id;
    }

    // Lọc theo vật tư
    if (materialID) {
      const material = await Material.findOne({ materialID });
      if (!material)
        return res
          .status(404)
          .json({ message: `Vật tư '${materialID}' không tồn tại!` });
      filter.material = material._id;
    }

    // Lọc theo thiết bị
    if (equipmentID) {
      const equipment = await Equipment.findOne({ equipmentID });
      if (!equipment)
        return res
          .status(404)
          .json({ message: `Thiết bị '${equipmentID}' không tồn tại!` });
      filter.equipment = equipment._id;
    }

    // Lọc theo loại giao dịch
    if (type) {
      if (!["import", "export"].includes(type))
        return res
          .status(400)
          .json({ message: "Loại giao dịch không hợp lệ!" });
      filter.type = type;
    }

    // Lọc theo người tạo
    if (userID) {
      const user = await User.findOne({ userID });
      if (!user)
        return res
          .status(404)
          .json({ message: `Người dùng '${userID}' không tồn tại!` });
      filter.createdBy = user._id;
    }

    const transactions = await Transaction.find(filter)
      .populate("repository", "repoID repoName -_id")
      .populate("material", "materialID name type -_id")
      .populate("equipment", "equipmentID equipmentName type status -_id")
      .populate("createdBy", "userID fullName email -_id")
      .sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "Không có giao dịch nào phù hợp!",
      });
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      message: "Lấy danh sách giao dịch thành công!",
      data: transactions,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getTransaction:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

/* ------------------ THÊM GIAO DỊCH (VẬT TƯ / THIẾT BỊ) ------------------ */
export const addTransaction = async (req, res) => {
  try {
    const {
      repository,
      material,
      equipment, 
      type,
      quantity,
      createdBy,
      note,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !repository ||
      (!material && !equipment) ||
      !type ||
      !quantity ||
      !createdBy
    ) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin giao dịch!",
      });
    }

    const existingRepo = await Repository.findOne({ repoID: repository });
    if (!existingRepo) {
      return res.status(404).json({
        success: false,
        message: "Kho không tồn tại!",
      });
    }

    const existingUser = await User.findOne({ userID: createdBy });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    // Kiểm tra loại (vật tư hoặc thiết bị)
    let targetItem = null;
    let itemType = "";

    if (material) {
      targetItem = await Material.findOne({ materialID: material });
      itemType = "material";
    } else if (equipment) {
      targetItem = await Equipment.findOne({ equipmentID: equipment });
      itemType = "equipment";
    }

    if (!targetItem) {
      return res.status(404).json({
        success: false,
        message: `${
          itemType === "material" ? "Vật tư" : "Thiết bị"
        } không tồn tại!`,
      });
    }

    // Tạo mã giao dịch tự động
    const count = await Transaction.countDocuments();
    const transactionID = `GD${count + 1}`;

    // 🔹 Xử lý thay đổi tồn kho
    let beforeQuantity = 0;
    let afterQuantity = 0;

    if (itemType === "material") {
      // Với vật tư
      const matIndex = existingRepo.materials.findIndex(
        (m) => m.material.toString() === targetItem._id.toString()
      );

      if (matIndex === -1) {
        if (type === "export") {
          return res
            .status(400)
            .json({ message: "Vật tư chưa có trong kho để xuất!" });
        }
        existingRepo.materials.push({ material: targetItem._id, quantity });
        afterQuantity = quantity;
      } else {
        beforeQuantity = existingRepo.materials[matIndex].quantity;
        if (type === "import") {
          existingRepo.materials[matIndex].quantity += quantity;
        } else {
          if (beforeQuantity < quantity) {
            return res
              .status(400)
              .json({ message: "Không đủ số lượng vật tư trong kho!" });
          }
          existingRepo.materials[matIndex].quantity -= quantity;
        }
        afterQuantity = existingRepo.materials[matIndex].quantity;
      }
    } else {
      // Với thiết bị
      const eqIndex =
        existingRepo.equipments?.findIndex(
          (e) => e.equipment.toString() === targetItem._id.toString()
        ) ?? -1;

      if (eqIndex === -1) {
        if (type === "export") {
          return res
            .status(400)
            .json({ message: "Thiết bị chưa có trong kho để xuất!" });
        }
        existingRepo.equipments = existingRepo.equipments || [];
        existingRepo.equipments.push({ equipment: targetItem._id, quantity });
        afterQuantity = quantity;
      } else {
        beforeQuantity = existingRepo.equipments[eqIndex].quantity;
        if (type === "import") {
          existingRepo.equipments[eqIndex].quantity += quantity;
        } else {
          if (beforeQuantity < quantity) {
            return res
              .status(400)
              .json({ message: "Không đủ số lượng thiết bị trong kho!" });
          }
          existingRepo.equipments[eqIndex].quantity -= quantity;
        }
        afterQuantity = existingRepo.equipments[eqIndex].quantity;
      }
    }

    await existingRepo.save();

    // Tạo giao dịch
    const transaction = await Transaction.create({
      transactionID,
      repository: existingRepo._id,
      material: itemType === "material" ? targetItem._id : null,
      equipment: itemType === "equipment" ? targetItem._id : null,
      type,
      quantity,
      createdBy: existingUser._id,
      beforeQuantity,
      afterQuantity,
      note,
    });

    res.status(201).json({
      success: true,
      message: `Tạo giao dịch ${type === "import" ? "nhập" : "xuất"} ${
        itemType === "material" ? "vật tư" : "thiết bị"
      } thành công!`,
      data: transaction,
    });
  } catch (error) {
    console.error("Lỗi khi thêm giao dịch:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
