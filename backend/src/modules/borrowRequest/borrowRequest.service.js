import BorrowRequest from "./BorrowRequest.model.js";
import User from "../user/User.model.js";
import Transaction from "../transaction/Transaction.model.js";
import Repository from "../repository/Repository.model.js";
import mongoose from "mongoose";
import Material from "../material/Material.model.js";
import MaterialProblem from "../materialProblem/MaterialProblem.model.js";
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
    /* ======================================================
       0) VALIDATE DATA TRẢ
    ====================================================== */
    if (!Array.isArray(returnItems) || !returnItems.length) {
      throw new Error("Thiếu danh sách vật tư trả");
    }

    returnItems.forEach((r) => {
      if (!r.materialId) throw new Error("Thiếu materialId trong returnItems");

      // normalize
      if (!r.condition) r.condition = "intact";

      if (r.condition === "damaged") {
        const dq = Number(r.damagedQty);
        if (!dq || dq <= 0) {
          throw new Error("Vật tư hỏng phải có damagedQty > 0");
        }
        r.damagedQty = dq;
        // default: hỏng do người mượn (để tránh khóa oan vì hỏng tự nhiên)
        if (!r.damageReason) r.damageReason = "borrower_fault";
      } else {
        r.damagedQty = 0;
        r.damageReason = null;
      }
    });

    /* ======================================================
       1) LẤY PHIẾU MƯỢN
    ====================================================== */
    const br = await BorrowRequest.findById(id)
      .populate("items.material")
      .populate("teacher")
      .session(session);

    if (!br) throw new Error("Không tìm thấy phiếu mượn");
    if (br.status !== "approved")
      throw new Error("Phiếu chưa được duyệt hoặc đã trả");
    if (!br.repository) throw new Error("Phiếu mượn không gắn kho");

    // chặn luôn nếu user đang bị khóa (phòng trường hợp lách)
    if (br.teacher?.isLocked) {
      throw new Error("Tài khoản người mượn đang bị khóa");
    }

    /* ======================================================
       2) LẤY KHO
    ====================================================== */
    const repo = await Repository.findById(br.repository).session(session);
    if (!repo) throw new Error("Kho không tồn tại");

    /* ======================================================
       3) MAP DATA TRẢ
    ====================================================== */
    const returnMap = new Map();
    returnItems.forEach((r) => returnMap.set(r.materialId.toString(), r));

    const changeList = [];
    const intactList = [];
    const damagedList = [];

    // flag tính “1 lần hỏng” cho phiếu này (đúng ý bạn: hỏng quá 7 lần)
    let hasBorrowerFaultDamage = false;

    /* ======================================================
       4) XỬ LÝ TỪNG VẬT TƯ
    ====================================================== */
    for (const it of br.items) {
      const matId = it.material._id.toString();
      const returnInfo = returnMap.get(matId);

      if (!returnInfo) {
        throw new Error(`Thiếu thông tin trả vật tư: ${it.material.name}`);
      }

      const repoItem = repo.materials.find(
        (m) => m.material.toString() === matId
      );
      if (!repoItem) {
        throw new Error(
          `Kho ${repo.repoName} không chứa vật tư ${it.material.name}`
        );
      }

      const borrowedQty = Number(it.quantity);
      let returnQty = borrowedQty;

      /* ---------- TRƯỜNG HỢP HỎNG ---------- */
      if (returnInfo.condition === "damaged") {
        const damagedQty = Number(returnInfo.damagedQty || 0);

        if (damagedQty > borrowedQty) {
          throw new Error(
            `Số lượng hỏng vượt quá số lượng mượn của ${it.material.name}`
          );
        }

        returnQty = borrowedQty - damagedQty;

        damagedList.push({
          name: it.material.name,
          quantity: damagedQty,
          damageReason: returnInfo.damageReason || "borrower_fault",
        });

        // chỉ tính vào “điểm phạt” nếu là lỗi người mượn
        if (
          (returnInfo.damageReason || "borrower_fault") === "borrower_fault"
        ) {
          hasBorrowerFaultDamage = true;
        }

        
        await MaterialProblem.create(
          [
            {
              material: it.material._id,
              quantity: damagedQty,
              reason: "Hỏng khi mượn",
              sourceBorrowRequest: br._id,
              createdBy: managerId,
              status: "pending",
              damageReason: returnInfo.damageReason || "borrower_fault",
            },
          ],
          { session }
        );
      } else {
        /* ---------- NGUYÊN VẸN ---------- */
        intactList.push({
          name: it.material.name,
          quantity: borrowedQty,
        });
      }

      /* ---------- CẬP NHẬT KHO ---------- */
      const before = Number(repoItem.quantity);
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

    /* ======================================================
       5) HỎNG QUÁ 7 LẦN → KHÓA GIẢNG VIÊN
    ====================================================== */
    let lockMessage = "";
    if (hasBorrowerFaultDamage) {
      const teacher = await User.findById(br.teacher._id).session(session);
      if (!teacher) throw new Error("Không tìm thấy người mượn");

      teacher.damageCount = Number(teacher.damageCount || 0) + 1;

      if (teacher.damageCount >= 2) {
        teacher.isLocked = true;
        lockMessage = `\nTài khoản đã bị khóa (hỏng ${teacher.damageCount}/7 lần).`;
      }

      await teacher.save({ session });
    }

    await repo.save({ session });

    /* ======================================================
       6) TẠO TRANSACTION NHẬP KHO
    ====================================================== */
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

    /* ======================================================
       7) UPDATE PHIẾU (CHỈ ĐỂ LỊCH SỬ)
    ====================================================== */
    br.status = "returned";
    br.returnedAt = new Date();
    br.returnDetail = returnItems; // ⚠️ chỉ để xem lại lịch sử

    // lưu thêm tóm tắt hỏng cho dễ hiển thị + báo cáo
    br.damageSummary = {
      hasBorrowerFaultDamage,
      intactCount: intactList.length,
      damagedCount: damagedList.length,
    };

    await br.save({ session });

    /* ======================================================
       8) COMMIT
    ====================================================== */
    await session.commitTransaction();
    session.endSession();

    /* ======================================================
       9) THÔNG BÁO
    ====================================================== */
    let message = `${br.teacher.fullName} đã trả vật tư.\n`;

    if (intactList.length) {
      message += `\n✅ Nguyên vẹn:\n`;
      intactList.forEach((i) => (message += `- ${i.name}: ${i.quantity}\n`));
    }

    if (damagedList.length) {
      message += `\n⚠️ Hỏng:\n`;
      damagedList.forEach((d) => {
        const reasonTxt =
          d.damageReason === "natural_expiry"
            ? " (hỏng tự nhiên)"
            : " (lỗi người mượn)";
        message += `- ${d.name}: ${d.quantity}${reasonTxt}\n`;
      });
    }

    if (lockMessage) message += lockMessage;

    await createNotification({
      type: "return",
      title: "Trả vật tư",
      message,
      user: br.teacher._id,
    });

    return {
      success: true,
      message: lockMessage
        ? "Trả vật tư thành công. Tài khoản người mượn đã bị khóa do hỏng quá số lần."
        : "Trả vật tư thành công",
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
