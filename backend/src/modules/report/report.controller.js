import * as reportService from "./report.service.js";

export async function getMonthlyReport(req, res) {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Thiếu tháng hoặc năm",
      });
    }

    const data = await reportService.getMonthlyReport(
      Number(month),
      Number(year)
    );

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
