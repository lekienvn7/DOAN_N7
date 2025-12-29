import Material from "../material/Material.model.js";
import BorrowRequest from "../borrowRequest/BorrowRequest.model.js";
import Transaction from "../transaction/Transaction.model.js";
import MaterialProblem from "../materialProblem/materialProblem.model.js";
import Repository from "../repository/Repository.model.js";

/* =========================
   HELPER: TẠO RANGE THÁNG
========================= */
function getMonthRange(month, year) {
  const start = new Date(year, month - 1, 1, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0);
  return { start, end };
}

/* =========================
   MAIN REPORT SERVICE
========================= */
export async function getMonthlyReport(month, year) {
  const { start, end } = getMonthRange(month, year);

  const [borrowFrequency, newMaterials, damagedMaterials, repoSummary] =
    await Promise.all([
      getBorrowFrequency(start, end),
      getNewMaterials(start, end),
      getDamagedMaterials(start, end),
      getRepoSummary(start, end),
    ]);

  return {
    month,
    year,
    borrowFrequency,
    newMaterials,
    damagedMaterials,
    repoSummary,
  };
}

/* =========================
   1. VẬT TƯ MƯỢN BAO NHIÊU LẦN
========================= */
async function getBorrowFrequency(start, end) {
  return BorrowRequest.aggregate([
    // 1️⃣ Lọc phiếu đã duyệt trong tháng
    {
      $match: {
        status: "approved",
        approvedAt: {
          $gte: start,
          $lt: end,
        },
      },
    },

    // 2️⃣ Lấy danh sách material KHÔNG TRÙNG trong mỗi phiếu
    {
      $project: {
        materials: {
          $setUnion: ["$items.material", []],
        },
      },
    },

    // 3️⃣ Tách từng material
    { $unwind: "$materials" },

    // 4️⃣ Đếm số PHIẾU chứa material
    {
      $group: {
        _id: "$materials",
        borrowCount: { $sum: 1 },
      },
    },

    // 5️⃣ Join sang Material
    {
      $lookup: {
        from: "materials",
        localField: "_id",
        foreignField: "_id",
        as: "material",
      },
    },
    { $unwind: "$material" },

    // 6️⃣ Trả dữ liệu gọn gàng
    {
      $project: {
        _id: 0,
        materialId: "$material._id",
        name: "$material.name",
        borrowCount: 1,
      },
    },

    { $sort: { borrowCount: -1 } },
  ]);
}

/* =========================
   2. VẬT TƯ ĐƯỢC THÊM MỚI
========================= */
async function getNewMaterials(start, end) {
  const list = await Material.find({
    createdAt: { $gte: start, $lt: end },
  }).select("name materialID createdAt");

  return {
    total: list.length,
    list,
  };
}

/* =========================
   3. VẬT TƯ BỊ HỎNG
========================= */
/*
 Giả định:
 - Transaction.type = "DAMAGED"
 - createdAt là thời điểm ghi nhận hỏng
*/
async function getDamagedMaterials(start, end) {
  return MaterialProblem.aggregate([
    // 1️⃣ Lọc hỏng trong tháng
    {
      $match: {
        createdAt: { $gte: start, $lt: end },
      },
    },

    // 2️⃣ Gom theo vật tư, cộng số lượng hỏng
    {
      $group: {
        _id: "$material",
        damagedQuantity: { $sum: "$quantity" },
      },
    },

    // 3️⃣ Join sang Material
    {
      $lookup: {
        from: "materials",
        localField: "_id",
        foreignField: "_id",
        as: "material",
      },
    },
    { $unwind: "$material" },

    // 4️⃣ Format dữ liệu
    {
      $project: {
        _id: 0,
        materialId: "$material._id",
        materialCode: "$material.materialID",
        name: "$material.name",
        damagedQuantity: 1,
      },
    },

    // 5️⃣ Hay hỏng nhất lên đầu
    { $sort: { damagedQuantity: -1 } },
  ]);
}

async function getRepoSummary(start, end) {
  return Repository.aggregate([
    {
      $lookup: {
        from: "materialproblems",
        localField: "materials.material",
        foreignField: "material",
        as: "damagedLogs",
      },
    },
    {
      $addFields: {
        total: { $sum: "$materials.quantity" },
        damaged: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$damagedLogs",
                  as: "d",
                  cond: {
                    $and: [
                      { $gte: ["$$d.createdAt", start] },
                      { $lt: ["$$d.createdAt", end] },
                    ],
                  },
                },
              },
              as: "d",
              in: "$$d.quantity",
            },
          },
        },
      },
    },
    {
      $project: {
        repoID: "$repoType",
        repoName: 1,
        total: 1,
        damaged: 1,
      },
    },
  ]);
}
