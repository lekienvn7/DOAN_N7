import Report from "../models/Report.js";
import Repository from "../models/Repository.js";
import User from "../models/User.js";

export const addReport = async (req, res) => {
  try {
    const { title, repository, reportType, createdBy, note } = req.body;

    const existingRepo = await Repository.findOne({
      repoID: repository,
    }).populate("materials.material");
    if (!existingRepo) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kho!",
      });
    }

    const existingUser = await User.findOne({ userID: createdBy });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Người tạo báo cáo không tồn tại!",
      });
    }

    const count = await Report.countDocuments();
    const reportID = `BC${count + 1}`;

    // Tính tổng vật tư và tổng giá trị
    const totalMaterials = existingRepo.materials.length;
    const materialsData = existingRepo.materials.map((m) => ({
      material: m.material._id,
      quantity: m.quantity,
      totalValue: m.quantity * (m.material.price || 0),
    }));

    const totalValue = materialsData.reduce((sum, m) => sum + m.totalValue, 0);

    const report = await Report.create({
      reportID,
      title,
      repository: existingRepo._id,
      materials: materialsData,
      totalMaterials,
      totalValue,
      reportType,
      createdBy: existingUser._id,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Tạo báo cáo thành công!",
      data: report,
    });
  } catch (error) {
    console.error("Lỗi khi tạo báo cáo:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};

// Lấy danh sách báo cáo (lọc động)
export const getReports = async (req, res) => {
  try {
    const { repoID, reportType, fromDate, toDate } = req.query;
    const query = {};

    if (repoID) {
      const repo = await Repository.findOne({ repoID });
      if (repo) query.repository = repo._id;
    }
    if (reportType) query.reportType = reportType;
    if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const reports = await Report.find(query)
      .populate("repository", "repoName location")
      .populate("generatedBy", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách báo cáo thành công!",
      data: reports,
    });
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
