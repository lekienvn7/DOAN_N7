import jwt from "jsonwebtoken";

// Middleware xác thực token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền truy cập!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // chứa userID, role
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// Middleware kiểm tra quyền
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.roleName)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện hành động này!" });
    }
    next();
  };
};

export const checkRepositoryAccess = async (req, res, next) => {
  try {
    const repo = await Repository.findOne({
      repoID: req.params.repoID,
    }).populate("manager");
    if (!repo) {
      return res.status(404).json({ message: "Kho không tồn tại!" });
    }

    // Quản lý tổng kho => bỏ qua kiểm tra
    if (req.user.roleName === "Quản lý tổng") {
      req.repo = repo;
      return next();
    }

    // 🔒 Quản lý kho => chỉ được thao tác kho mình phụ trách
    if (repo.manager?._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập kho này!" });
    }

    req.repo = repo; // lưu repo lại để controller có thể dùng
    next();
  } catch (error) {
    console.error("Lỗi checkRepositoryAccess:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
