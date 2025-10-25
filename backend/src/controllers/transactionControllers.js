import Repository from "../models/Repository.js";
import Material from "../models/Material.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getTransaction = async (req, res) => {
  try {
    const { repoID, materialID, type, userID } = req.query;

    // Tạo điều kiện lọc động
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

    // Tìm giao dịch phù hợp
    const transactions = await Transaction.find(filter)
      .populate("repository", "repoID repoName -_id")
      .populate("material", "materialID name type unit -_id")
      .populate("createdBy", "userID fullName email -_id")
      .sort({ createdAt: -1 }); // sắp xếp giao dịch mới nhất lên đầu

    // Nếu không có giao dịch nào
    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "Không có giao dịch nào phù hợp!",
      });
    }

    // Trả kết quả
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

export const addTransaction = async (req, res) => {
  try {
    const { repository, material, type, quantity, createdBy, note } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!repository || !material || !type || !quantity || !createdBy) {
      return res.status(400).json({ message: "Thiếu thông tin giao dịch!" });
    }

    const existingRepo = await Repository.findOne({ repoID: repository });
    if (!existingRepo) {
      return res
        .status(404)
        .json({ success: false, message: "Kho không tồn tại!" });
    }

    const existingMaterial = await Material.findOne({ materialID: material });
    if (!existingMaterial) {
      return res
        .status(404)
        .json({ success: false, message: "Vật tư không tồn tại!" });
    }

    const existingUser = await User.findOne({ userID: createdBy });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại!" });
    }

    // Tạo mã giao dịch
    const count = await Transaction.countDocuments();
    const transactionID = `GD${count + 1}`;

    // Tìm xem vật tư này có trong kho chưa
    const matIndex = existingRepo.materials.findIndex(
      (m) => m.material.toString() === existingMaterial._id.toString()
    );

    let beforeQuantity = 0;
    let afterQuantity = 0;

    if (matIndex === -1) {
      // Nếu vật tư chưa có trong kho mà lại xuất => lỗi
      if (type === "export") {
        return res
          .status(400)
          .json({ message: "Vật tư chưa có trong kho để xuất!" });
      }
      // Nếu nhập -> thêm mới
      existingRepo.materials.push({
        material: existingMaterial._id,
        quantity,
      });
      afterQuantity = quantity;
    } else {
      // Nếu đã có trong kho
      beforeQuantity = existingRepo.materials[matIndex].quantity;

      if (type === "import") {
        existingRepo.materials[matIndex].quantity += quantity;
      } else if (type === "export") {
        if (beforeQuantity < quantity) {
          return res
            .status(400)
            .json({ message: "Không đủ số lượng trong kho để xuất!" });
        }
        existingRepo.materials[matIndex].quantity -= quantity;
      }

      afterQuantity = existingRepo.materials[matIndex].quantity;
    }

    // Lưu thay đổi tồn kho
    await existingRepo.save();

    // Tạo giao dịch
    const transaction = await Transaction.create({
      transactionID,
      repository: existingRepo._id,
      material: existingMaterial._id,
      type,
      quantity,
      createdBy: existingUser._id,
      beforeQuantity,
      afterQuantity,
      note,
    });

    res.status(201).json({
      success: true,
      message: `Tạo giao dịch ${
        type === "import" ? "nhập" : "xuất"
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

