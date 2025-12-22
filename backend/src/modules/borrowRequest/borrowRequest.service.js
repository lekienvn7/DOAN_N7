import BorrowRequest from "./BorrowRequest.model.js";
import User from "../user/User.model.js";
import Transaction from "../transaction/Transaction.model.js";
import Repository from "../repository/Repository.model.js";
import mongoose from "mongoose";
import Material from "../material/Material.model.js";
import { createNotification } from "../Notification/notice.service.js";

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
       2) LẤY MATERIAL & CHECK BORROW TYPE
    ------------------------------------------------------ */
    const materials = await Material.find({
      _id: { $in: normalizedItems.map((i) => i.material) },
    }).session(session);

    if (materials.length !== normalizedItems.length) {
      throw new Error("Có vật tư không tồn tại");
    }

    // 🔥 CHUẨN NGHIỆP VỤ MỚI
    const hasApprovalMaterial = materials.some(
      (m) => m.borrowType === "approval"
    );

    /* ------------------------------------------------------
       3) NẾU CÓ VẬT TƯ CẦN DUYỆT → TẠO PHIẾU PENDING
    ------------------------------------------------------ */
    if (hasApprovalMaterial) {
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
       4) KHÔNG CÓ VẬT TƯ CẦN DUYỆT → MƯỢN LUÔN
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
          status: "approved", // ✅ mượn ngay
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

    try {
      await createNotification({
        type: "borrow",
        title: "Mượn vật tư",
        message: `Giảng viên ${teacher.fullName} đã mượn vật tư thành công`,
        user: teacher._id,
      });
    } catch (err) {
      console.error("Notification error:", err.message);
    }

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

    try {
      await createNotification({
        type: "borrow",
        title: "Phiếu mượn được duyệt",
        message: `Phiếu mượn của ${br.teacher.fullName} đã được duyệt.`,
        user: br.teacher._id,
      });
    } catch (err) {
      console.error("Notification error:", err.message);
    }

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

  try {
    await createNotification({
      type: "borrow",
      title: "Phiếu mượn bị từ chối",
      message: `Phiếu mượn của ${br.teacher.fullName} đã bị từ chối.`,
      user: br.teacher._id,
    });
  } catch (err) {
    console.error("Notification error:", err.message);
  }

  return br;
}

export async function returnBorrowRequest({ id, managerId, returnItems }) {
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
       3) MAP DATA TRẢ VẬT TƯ
    ------------------------------------------------------ */
    const returnMap = new Map();
    for (const r of returnItems) {
      returnMap.set(r.materialId.toString(), r);
    }

    const changeList = [];
    const intactList = [];
    const damagedList = [];

    /* ------------------------------------------------------
       4) XỬ LÝ TỪNG VẬT TƯ
    ------------------------------------------------------ */
    for (const it of br.items) {
      const matId = it.material._id.toString();
      const returnInfo = returnMap.get(matId);

      if (!returnInfo)
        throw new Error(`Thiếu thông tin trả vật tư: ${it.material.name}`);

      const repoItem = repo.materials.find(
        (m) => m.material.toString() === matId
      );

      if (!repoItem)
        throw new Error(
          `Kho ${repo.repoName} không chứa vật tư ${it.material.name}`
        );

      const borrowedQty = it.quantity;
      let returnQty = borrowedQty;

      if (returnInfo.condition === "damaged") {
        if (returnInfo.damagedQty <= 0 || returnInfo.damagedQty > borrowedQty) {
          throw new Error(
            `Số lượng hỏng không hợp lệ cho vật tư ${it.material.name}`
          );
        }

        returnQty = borrowedQty - returnInfo.damagedQty;

        damagedList.push({
          name: it.material.name,
          quantity: returnInfo.damagedQty,
        });
      } else {
        intactList.push({
          name: it.material.name,
          quantity: borrowedQty,
        });
      }

      const before = repoItem.quantity;
      const after = before + returnQty;

      repoItem.quantity = after;

      changeList.push({
        materialID: matId,
        name: it.material.name,
        returnQty,
        beforeQuantity: before,
        afterQuantity: after,
      });
    }

    /* ------------------------------------------------------
       5) QUÁ HẠN → KHÓA GIẢNG VIÊN
    ------------------------------------------------------ */
    if (new Date() > br.expectedReturnDate) {
      const teacher = await User.findById(br.teacher._id).session(session);
      teacher.isLocked = true;
      await teacher.save({ session });
    }

    await repo.save({ session });

    /* ------------------------------------------------------
       6) TẠO TRANSACTION NHẬP KHO
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
            quantity: item.returnQty,
            beforeQuantity: item.beforeQuantity,
            afterQuantity: item.afterQuantity,
            createdBy: managerId || null,
            note: "Trả vật tư",
          },
        ],
        { session }
      );
    }

    /* ------------------------------------------------------
       7) UPDATE PHIẾU
    ------------------------------------------------------ */
    br.status = "returned";
    br.returnedAt = new Date();
    br.returnDetail = returnItems; // optional: lưu chi tiết trả

    await br.save({ session });

    /* ------------------------------------------------------
       8) COMMIT
    ------------------------------------------------------ */
    await session.commitTransaction();
    session.endSession();

    /* ------------------------------------------------------
       9) THÔNG BÁO
    ------------------------------------------------------ */
    let message = `${br.teacher.fullName} đã trả vật tư.\n`;

    if (intactList.length) {
      message += `\n✅ Nguyên vẹn:\n`;
      intactList.forEach((i) => (message += `- ${i.name}: ${i.quantity}\n`));
    }

    if (damagedList.length) {
      message += `\n⚠️ Hỏng:\n`;
      damagedList.forEach((d) => (message += `- ${d.name}: ${d.quantity}\n`));
    }

    await createNotification({
      type: "return",
      title: "Trả vật tư",
      message,
      user: br.teacher._id,
    });

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
