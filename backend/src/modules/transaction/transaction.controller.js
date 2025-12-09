import transactionService from "./transaction.service.js";

/* LẤY DANH SÁCH GIAO DỊCH */
export const getTransaction = async (req, res) => {
  try {
    const result = await transactionService.getTransaction(req.query);

    res.status(200).json({
      success: true,
      count: result.transactions.length,
      message: result.message,
      data: result.transactions,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getTransaction:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------ THÊM GIAO DỊCH ------------------ */
export const addTransaction = async (req, res) => {
  try {
    const result = await transactionService.addTransaction(req.body);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.transaction,
    });
  } catch (error) {
    console.error("Lỗi khi thêm giao dịch:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
};
