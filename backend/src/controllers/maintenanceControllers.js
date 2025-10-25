import Maintenance from "../models/maintenance.js";
import Material from "../models/Material.js";
import Repository from "../models/Repository.js";
import User from "../models/User.js";

export const addMaintenance = async (req, res) => {
  try {
    const { material, repository, checkedBy, cost, note } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!material || !repository || !checkedBy) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc!",
      });
    }

    // Kiểm tra kho
    const existingRepo = await Repository.findOne({ repoID: repository });
    if (!existingRepo) {
      return res.status(404).json({
        success: false,
        message: `Kho ${repository} không tồn tại!`,
      });
    }

    // Kiểm tra vật tư
    const existingMaterial =
      (await Material.findById(material)) ||
      (await Material.findOne({ materialID: material }));
    if (!existingMaterial) {
      return res.status(404).json({
        success: false,
        message: `Vật tư ${material} không tồn tại!`,
      });
    }

    // Kiểm tra người thực hiện
    const existingUser = await User.findOne({ userID: checkedBy }).populate(
      "role",
      "roleName"
    );
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `Tài khoản ${checkedBy} không tồn tại!`,
      });
    }

    // Chỉ cho phép Quản lý bảo trì thực hiện
    if (existingUser.role.roleName !== "Quản lý bảo trì") {
      return res.status(403).json({
        success: false,
        message: `Người dùng '${existingUser.fullName}' không có quyền bảo trì vật tư!`,
      });
    }

    // Tạo mã bảo trì tự động
    const count = await Maintenance.countDocuments();
    const maintenanceID = `BT${count + 1}`;

    // Tính ngày bảo trì tiếp theo (dựa vào maintenanceCycle của vật tư)
    const nextDate = new Date();
    nextDate.setMonth(
      nextDate.getMonth() + (existingMaterial.maintenanceCycle || 1)
    );

    // Tạo bản ghi bảo trì mới
    const maintenance = await Maintenance.create({
      maintenanceID,
      material: existingMaterial._id,
      repository: existingRepo._id,
      performedBy: existingUser._id,
      cost: cost || 0,
      note: note || "",
      startDate: new Date(),
      nextMaintenance: nextDate,
      status: "inProgress",
    });

    // Cập nhật trạng thái vật tư
    existingMaterial.status = "repairing";
    await existingMaterial.save();

    res.status(201).json({
      success: true,
      message: `Đã thêm lịch bảo trì cho vật tư '${existingMaterial.name}'`,
      data: maintenance,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bảo trì:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

/**
 * 2. Cập nhật bảo trì (trạng thái, chi phí, ghi chú)
 */
export const updateMaintenance = async (req, res) => {
  try {
    const { status, cost, note, endDate } = req.body;

    const maintenance = await Maintenance.findOne({
      maintenanceID: req.params.id,
    }).populate("material");

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bản ghi bảo trì!",
      });
    }

    // Cập nhật thông tin
    if (status) maintenance.status = status;
    if (cost !== undefined) maintenance.cost = cost;
    if (note) maintenance.note = note;
    if (endDate) maintenance.endDate = endDate;

    // Nếu hoàn thành -> cập nhật vật tư về trạng thái "inRepo"
    if (status === "completed") {
      const mat = await Material.findById(maintenance.material._id);
      if (mat) {
        mat.status = "inRepo";
        mat.repairedAt = new Date();
        await mat.save();
      }
    }

    await maintenance.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin bảo trì thành công!",
      data: maintenance,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật bảo trì:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

/**
 * 3. Xem lịch sử bảo trì (lọc động theo vật tư / kho / trạng thái)
 */
export const getMaintenance = async (req, res) => {
  try {
    const userId = req.user?.userID; // lấy từ middleware verifyToken
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không xác định được người dùng!",
      });
    }

    const existingUser = await User.findOne({ userID: userId }).populate(
      "role",
      "roleName"
    );

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    // Chỉ cho phép Quản lý bảo trì xem
    if (existingUser.role.roleName !== "Quản lý bảo trì") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập lịch sử bảo trì!",
      });
    }

    // Lọc động: cho phép truyền ?repoID=KH1 hoặc ?material=VT1
    const { repoID, materialID, status } = req.query;

    const filter = {};
    if (repoID) {
      const repo = await Repository.findOne({ repoID });
      if (repo) filter.repository = repo._id;
    }
    if (materialID) {
      const mat = await Material.findOne({ materialID });
      if (mat) filter.material = mat._id;
    }
    if (status) filter.status = status;

    // Truy vấn bảo trì
    const maintenanceList = await Maintenance.find(filter)
      .populate("material", "materialID name type status")
      .populate("repository", "repoID repoName repoType")
      .populate("performedBy", "fullName email userID role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bảo trì thành công!",
      count: maintenanceList.length,
      data: maintenanceList,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bảo trì:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

/**
 * 4. Cron job kiểm tra vật tư sắp tới kỳ bảo trì
 * (Ví dụ: những vật tư có nextMaintenance trong 7 ngày tới)
 */
export const autoCheckMaintenance = async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const upcomingMaintenances = await Maintenance.find({
      nextMaintenance: { $lte: nextWeek, $gte: now },
      status: { $ne: "completed" },
    })
      .populate("material", "name type")
      .populate("repository", "repoName")
      .populate("checkedBy", "fullName");

    if (upcomingMaintenances.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không có vật tư nào sắp đến kỳ bảo trì!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Danh sách vật tư sắp tới kỳ bảo trì:",
      data: upcomingMaintenances,
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra bảo trì định kỳ:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
