import jwt from "jsonwebtoken";
import Session from "../modules/session/Session.model.js";
import Repository from "../modules/repository/Repository.model.js";
import User from "../modules/user/User.model.js";

// Middleware xác thực token
export const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Không có token, từ chối truy cập!" });
    }

    // Giải mã access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gán user info vào request để route sau dùng

    // Kiểm tra refresh token trong Session (đoạn bạn hỏi nè)
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const session = await Session.findOne({ refreshToken });
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn!" });
      }
    }

    next(); // hợp lệ thì cho qua
  } catch (error) {
    console.error("Lỗi verifyToken:", error);
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
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
