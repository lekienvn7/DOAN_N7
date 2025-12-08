import BorrowRequest from "./BorrowRequest.model.js";
import Material from "../material/Material.model.js";
import Transaction from "../transaction/Transaction.model.js";
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
    .populate("teacher", "fullName userID -_id")
    .populate("items.material", "name -category -_id");
}

export async function getMyBorrowing(teacherId) {
  return BorrowRequest.find({
    teacher: teacherId,
    status: "approved",
  }).populate("items.material", "name quantity unit");
}

async function approveBorrowRequest({ id, managerId }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let br = await BorrowRequest.findById(id)
      .populate("items.material")
      .session(session);

    if (!br) throw new Error("Không tìm thấy phiếu mượn");
    if (br.status !== "pending") throw new Error("Phiếu đã xử lý");

    // LOOP từng item
    for (const it of br.items) {
      const mat = await Material.findById(it.material._id).session(session);

      if (!mat) throw new Error("Vật tư không tồn tại");
      if (mat.quantity < it.quantity)
        throw new Error(`Vật tư ${mat.name} không đủ số lượng`);

      // trừ kho
      mat.quantity -= it.quantity;
      await mat.save({ session });

      // tạo transaction
      await Transaction.create(
        [
          {
            repository: br.repository,
            material: mat._id,
            type: "export",
            quantity: it.quantity,
            createdBy: managerId,
            note: `Giảng viên mượn`,
          },
        ],
        { session }
      );
    }

    br.status = "approved";
    br.approvedBy = managerId;
    br.approvedAt = new Date();
    await br.save({ session });

    await session.commitTransaction();
    session.endSession();

    return br;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function rejectBorrowRequest({ id, managerId }) {
  const br = await BorrowRequest.findById(id);
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
