import BorrowRequest from "./BorrowRequest.model.js";
import Transaction from "../transaction/Transaction.model.js";
import Repository from "../repository/Repository.model.js";
import mongoose from "mongoose";

async function createBorrowRequest({
  repository,
  teacher,
  items,
  note,
  expectedReturnDate,
}) {
  const br = await BorrowRequest.create({
    repository,
    teacher,
    items,
    note,
    expectedReturnDate,
  });

  return br;
}

async function getPendingRequests() {
  return BorrowRequest.find({
    status: "pending",
  })
    .populate("teacher", "_id fullName userID")
    .populate("items.material", "name -category");
}

export async function getMyBorrowing(teacherId) {
  return BorrowRequest.find({
    teacher: teacherId,
    status: "approved",
  }).populate("items.material", "name quantity unit");
}

export async function approveBorrowRequest({ id, managerId, repoID }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Lấy phiếu mượn + populate vật tư
    const br = await BorrowRequest.findById(id)
      .populate("items.material")
      .populate("teacher")
      .session(session);

    if (!br) throw new Error("Không tìm thấy phiếu mượn");
    if (br.status !== "pending") throw new Error("Phiếu đã xử lý");

    // Lấy kho
    const repo = await Repository.findById(repoID).session(session);
    if (!repo) throw new Error("Kho không tồn tại!");

    // Danh sách thay đổi để tạo transaction
    const changeList = [];

    /* ------------------------------------------------------
       1) CHECK SỐ LƯỢNG & CẬP NHẬT SỐ LƯỢNG TRONG KHO
    ------------------------------------------------------ */
    for (const it of br.items) {
      const matID = it.material._id || it.material;

      const repoItem = repo.materials.find(
        (m) => m.material.toString() === matID.toString()
      );

      if (!repoItem)
        throw new Error(
          `Kho không chứa vật tư: ${it.material.name || "Unknown"}`
        );

      if (repoItem.quantity < it.quantity)
        throw new Error(`Vật tư ${it.material.name || "—"} không đủ số lượng`);

      const before = repoItem.quantity;
      const after = before - it.quantity;

      repoItem.quantity = after;

      changeList.push({
        materialID: matID,
        quantity: it.quantity,
        beforeQuantity: before,
        afterQuantity: after,
      });
    }

    // lưu kho
    await repo.save({ session });

    /* ------------------------------------------------------
       2) TẠO TRANSACTION (history)
    ------------------------------------------------------ */
    for (const item of changeList) {
      const transactionID = `GD-${Date.now()}-${Math.floor(
        Math.random() * 9999
      )}`;

      await Transaction.create(
        [
          {
            transactionID,
            repository: repo._id,
            material: item.materialID,
            type: "export",
            quantity: item.quantity,
            beforeQuantity: item.beforeQuantity,
            afterQuantity: item.afterQuantity,
            createdBy: managerId,
            note: "Giảng viên mượn vật tư",
          },
        ],
        { session }
      );
    }

    /* ------------------------------------------------------
       3) UPDATE PHIẾU MƯỢN
    ------------------------------------------------------ */
    br.status = "approved";
    br.approvedBy = managerId;
    br.approvedAt = new Date();
    br.repository = repoID;

    await br.save({ session });

    /* ------------------------------------------------------
       4) COMMIT & RETURN
    ------------------------------------------------------ */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Duyệt phiếu mượn thành công!",
      data: br,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function rejectBorrowRequest({ id, managerId }) {
  const br = await BorrowRequest.findById(id)
    .populate("teacher")
    .populate("repository");

  if (!br) throw new Error("Không tìm thấy phiếu mượn");
  if (br.status !== "pending") throw new Error("Phiếu đã xử lý");

  br.status = "rejected";
  br.rejectedBy = managerId;
  br.rejectedAt = new Date();

  await br.save();

  return br;
}

export default {
  createBorrowRequest,
  approveBorrowRequest,
  getMyBorrowing,
  getPendingRequests,
  rejectBorrowRequest,
};
