import Maintenance from "./Maintenance.model.js";
import Material from "../material/Material.model.js";
import Repository from "../repository/Repository.model.js";
import User from "../user/User.model.js";

async function addMaintenance(data) {
  const { material, repository, checkedBy, cost, note } = data;

  if (!material || !repository || !checkedBy) {
    const err = new Error("Thiếu thông tin bắt buộc!");
    err.status = 400;
    throw err;
  }

  const repo = await Repository.findOne({ repoID: repository });
  if (!repo) {
    const err = new Error(`Kho '${repository}' không tồn tại!`);
    err.status = 404;
    throw err;
  }

  const mat =
    (await Material.findById(material)) ||
    (await Material.findOne({ materialID: material }));

  if (!mat) {
    const err = new Error(`Vật tư '${material}' không tồn tại!`);
    err.status = 404;
    throw err;
  }

  const user = await User.findOne({ userID: checkedBy }).populate(
    "role",
    "roleName"
  );

  if (!user) {
    const err = new Error(`Tài khoản '${checkedBy}' không tồn tại!`);
    err.status = 404;
    throw err;
  }

  // Role validation
  if (user.role.roleName !== "Quản lý bảo trì") {
    const err = new Error(
      `Người dùng '${user.fullName}' không có quyền bảo trì vật tư!`
    );
    err.status = 403;
    throw err;
  }

  // Tạo mã BT tự động
  const count = await Maintenance.countDocuments();
  const maintenanceID = `BT${count + 1}`;

  // Tính ngày bảo trì tiếp theo
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + (mat.maintenanceCycle || 1));

  const maintenance = await Maintenance.create({
    maintenanceID,
    material: mat._id,
    repository: repo._id,
    performedBy: user._id,
    cost: cost || 0,
    note: note || "",
    startDate: new Date(),
    nextMaintenance: nextDate,
    status: "inProgress",
  });

  // cập nhật vật tư -> đang bảo trì
  mat.status = "repairing";
  await mat.save();

  return {
    message: `Đã thêm lịch bảo trì cho vật tư '${mat.name}'`,
    maintenance,
  };
}

async function updateMaintenance(id, data) {
  const { status, cost, note, endDate } = data;

  const maintenance = await Maintenance.findOne({
    maintenanceID: id,
  }).populate("material");

  if (!maintenance) {
    const err = new Error("Không tìm thấy bản ghi bảo trì!");
    err.status = 404;
    throw err;
  }

  if (status) maintenance.status = status;
  if (cost !== undefined) maintenance.cost = cost;
  if (note) maintenance.note = note;
  if (endDate) maintenance.endDate = endDate;

  // nếu hoàn thành -> cập nhật vật tư
  if (status === "completed") {
    const mat = await Material.findById(maintenance.material._id);
    if (mat) {
      mat.status = "inRepo";
      mat.repairedAt = new Date();
      await mat.save();
    }
  }

  await maintenance.save();

  return {
    message: "Cập nhật thông tin bảo trì thành công!",
    maintenance,
  };
}

async function getMaintenance(userID, query) {
  const user = await User.findOne({ userID }).populate("role", "roleName");

  if (!user) {
    const err = new Error("Người dùng không tồn tại!");
    err.status = 404;
    throw err;
  }

  if (user.role.roleName !== "Quản lý bảo trì") {
    const err = new Error("Bạn không có quyền truy cập lịch sử bảo trì!");
    err.status = 403;
    throw err;
  }

  const { repoID, materialID, status } = query;

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

  const list = await Maintenance.find(filter)
    .populate("material", "materialID name type status")
    .populate("repository", "repoID repoName repoType")
    .populate("performedBy", "fullName email userID role")
    .sort({ createdAt: -1 });

  return list;
}

async function autoCheckMaintenance() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const list = await Maintenance.find({
    nextMaintenance: { $lte: nextWeek, $gte: now },
    status: { $ne: "completed" },
  })
    .populate("material", "name type")
    .populate("repository", "repoName")
    .populate("performedBy", "fullName");

  return list;
}

export default {
  addMaintenance,
  updateMaintenance,
  getMaintenance,
  autoCheckMaintenance,
};
