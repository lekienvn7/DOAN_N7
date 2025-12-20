import BorrowRequest from "./BorrowRequest.model.js";
import User from "../user/User.model.js";
import Transaction from "../transaction/Transaction.model.js";
import Repository from "../repository/Repository.model.js";
import mongoose from "mongoose";
import Material from "../material/Material.model.js";

export async function createBorrowRequest({
  repository,
  teacher,
  items,
  note,
  expectedReturnDate,
}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /* ------------------------------------------------------
       1) VALIDATE INPUT
    ------------------------------------------------------ */
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Danh sách vật tư không hợp lệ");
    }

    if (!expectedReturnDate) {
      throw new Error("Bắt buộc phải có thời hạn trả");
    }

    const normalizedItems = items.map((it, index) => {
      const materialId = it.material?._id || it.material;

      if (!materialId) {
        throw new Error(`Item #${index + 1} thiếu material`);
      }

      if (!it.quantity || it.quantity <= 0) {
        throw new Error(`Số lượng item #${index + 1} không hợp lệ`);
      }

      return {
        material: materialId,
        quantity: it.quantity,
      };
    });

    /* ------------------------------------------------------
       2) LẤY DANH SÁCH MATERIAL & KIỂM TRA VẬT TƯ ĐẶC BIỆT
    ------------------------------------------------------ */
    const materials = await Material.find({
      _id: { $in: normalizedItems.map((i) => i.material) },
    }).session(session);

    if (materials.length !== normalizedItems.length) {
      throw new Error("Có vật tư không tồn tại");
    }

    const hasSpecialMaterial = materials.some((m) => m.isSpecial === true);

    /* ------------------------------------------------------
       3) NẾU CÓ VẬT TƯ ĐẶC BIỆT → TẠO PHIẾU CHỜ DUYỆT
    ------------------------------------------------------ */
    if (hasSpecialMaterial) {
      const br = await BorrowRequest.create(
        [
          {
            repository,
            teacher,
            items: normalizedItems,
            note,
            expectedReturnDate,
            status: "pending",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Phiếu mượn đã gửi và đang chờ duyệt",
        data: br[0],
      };
    }

    /* ------------------------------------------------------
       4) KHÔNG CÓ VẬT TƯ ĐẶC BIỆT → MƯỢN LUÔN
    ------------------------------------------------------ */
    const repo = await Repository.findById(repository).session(session);
    if (!repo) throw new Error("Kho không tồn tại");

    for (const it of normalizedItems) {
      const repoItem = repo.materials.find(
        (m) => m.material.toString() === it.material.toString()
      );

      if (!repoItem) {
        throw new Error("Vật tư không tồn tại trong kho");
      }

      if (repoItem.quantity < it.quantity) {
        throw new Error("Không đủ số lượng vật tư trong kho");
      }

      repoItem.quantity -= it.quantity;
    }

    await repo.save({ session });

    const br = await BorrowRequest.create(
      [
        {
          repository,
          teacher,
          items: normalizedItems,
          note,
          expectedReturnDate,
          status: "approved", // mượn ngay
          approvedAt: new Date(),
        },
      ],
      { session }
    );

    /* ------------------------------------------------------
       5) COMMIT
    ------------------------------------------------------ */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Mượn vật tư thành công",
      data: br[0],
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
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
  })
    .populate("items.material", "name quantity unit")
    .populate("teacher", "fullName");
}

export async function approveBorrowRequest({ id, managerId, repoID }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const manager = await User.findById(managerId).session(session);

    if (!manager) {
      throw new Error("Không tìm thấy người duyệt");
    }

    const managerObjectId = manager._id;

    /* ------------------------------------------------------
       1) LẤY PHIẾU MƯỢN
    ------------------------------------------------------ */
    const br = await BorrowRequest.findById(id)
      .populate("items.material")
      .populate("teacher")
      .session(session);

    if (!br) throw new Error("Không tìm thấy phiếu mượn");
    if (br.status !== "pending") throw new Error("Phiếu đã xử lý");

    /* ------------------------------------------------------
       2) LẤY KHO
    ------------------------------------------------------ */
    const repo = await Repository.findById(repoID).session(session);
    if (!repo) throw new Error("Kho không tồn tại!");

    const changeList = [];

    /* ------------------------------------------------------
       3) CHECK & TRỪ KHO
    ------------------------------------------------------ */
    for (const it of br.items) {
      const matID =
        typeof it.material === "object" ? it.material._id : it.material;

      const repoItem = repo.materials.find(
        (m) => m.material.toString() === matID.toString()
      );

      if (!repoItem) {
        throw new Error(
          `Kho ${repo.repoName} không chứa vật tư: ${
            it.material?.name || "Unknown"
          }`
        );
      }

      if (repoItem.quantity < it.quantity) {
        throw new Error(`Vật tư ${it.material?.name || "—"} không đủ số lượng`);
      }

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

    await repo.save({ session });

    /* ------------------------------------------------------
       4) TẠO TRANSACTION
    ------------------------------------------------------ */
    for (const item of changeList) {
      const transactionID = `GD-${Date.now()}-${Math.floor(
        Math.random() * 9999
      )}`;

      await Transaction.create(
        [
          {
            transactionID,
            repository: repoID,
            material: item.materialID,
            type: "export",
            quantity: item.quantity,
            beforeQuantity: item.beforeQuantity,
            afterQuantity: item.afterQuantity,
            createdBy: managerObjectId,
            note: "Giảng viên mượn vật tư",
          },
        ],
        { session }
      );
    }

    /* ------------------------------------------------------
       5) UPDATE PHIẾU MƯỢN
    ------------------------------------------------------ */
    br.status = "approved";
    br.approvedBy = managerObjectId; // ✅ SỬA CHỖ QUAN TRỌNG
    br.approvedAt = new Date();
    br.repository = repoID;

    await br.save({ session });

    /* ------------------------------------------------------
       6) COMMIT
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

export async function returnBorrowRequest({ id, managerId }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /* ------------------------------------------------------
       1) LẤY PHIẾU MƯỢN
    ------------------------------------------------------ */
    const br = await BorrowRequest.findById(id)
      .populate("items.material")
      .populate("teacher")
      .session(session);

    if (!br) throw new Error("Không tìm thấy phiếu mượn");
    if (br.status !== "approved")
      throw new Error("Phiếu chưa được duyệt hoặc đã trả");

    if (!br.repository) throw new Error("Phiếu mượn không gắn kho");

    /* ------------------------------------------------------
       2) LẤY KHO
    ------------------------------------------------------ */
    const repo = await Repository.findById(br.repository).session(session);
    if (!repo) throw new Error("Kho không tồn tại");

    /* ------------------------------------------------------
       3) CỘNG LẠI VẬT TƯ
    ------------------------------------------------------ */
    const changeList = [];

    for (const it of br.items) {
      const matID =
        typeof it.material === "object" ? it.material._id : it.material;

      const repoItem = repo.materials.find(
        (m) => m.material.toString() === matID.toString()
      );

      if (!repoItem) {
        throw new Error(
          `Kho ${repo.repoName} không chứa vật tư: ${
            it.material?.name || "Unknown"
          }`
        );
      }

      const before = repoItem.quantity;
      const after = before + it.quantity;

      repoItem.quantity = after;

      changeList.push({
        materialID: matID,
        quantity: it.quantity,
        beforeQuantity: before,
        afterQuantity: after,
      });
    }

    await repo.save({ session });

    /* ------------------------------------------------------
       4) TẠO TRANSACTION (NHẬP KHO)
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
            type: "import",
            quantity: item.quantity,
            beforeQuantity: item.beforeQuantity,
            afterQuantity: item.afterQuantity,
            createdBy: managerId || null,
            note: "Nhân viên trả vật tư",
          },
        ],
        { session }
      );
    }

    /* ------------------------------------------------------
       5) UPDATE PHIẾU
    ------------------------------------------------------ */
    br.status = "returned";
    br.returnedAt = new Date();

    await br.save({ session });

    /* ------------------------------------------------------
       6) COMMIT
    ------------------------------------------------------ */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Trả vật tư thành công",
      data: br,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export default {
  createBorrowRequest,
  approveBorrowRequest,
  getMyBorrowing,
  getPendingRequests,
  rejectBorrowRequest,
  returnBorrowRequest,
};
