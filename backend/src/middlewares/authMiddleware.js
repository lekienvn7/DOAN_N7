import jwt from "jsonwebtoken";
import Session from "../modules/session/Session.model.js";
import Repository from "../modules/repository/Repository.model.js";
import User from "../modules/user/User.model.js";

// Middleware xác thực token
// src/middleware/auth.middleware.js

export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Thiếu token truy cập!" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn user vào req để dùng sau
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT error:", err);

    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
}

// Optional: middleware check role
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.roleName)) {
      return res.status(403).json({ message: "Không có quyền truy cập!" });
    }
    next();
  };
}

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

    // Quản lý kho => chỉ được thao tác kho mình phụ trách
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

export const checkRepositoryPermission = async (req, res, next) => {
  try {
    const repo = await Repository.findOne({ repoID: req.params.repoID });
    if (!repo) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy kho!" });
    }

    const user = req.params.userID
      ? await User.findOne({ userID: req.params.userID })
      : await User.findById(req.user.id); // fallback nếu không có userID

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });
    }
    if (!user.yourRepo.includes(repo.repoType)) {
      return res.status(403).json({
        success: false,
        message: `Không có quyền trong kho ${repo.repoType}`,
      });
    }

    req.repo = repo;
    next();
  } catch (error) {
    console.error("Lỗi khi gọi checkRepositoryPermission", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};
