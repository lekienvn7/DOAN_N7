import borrowRequestService from "./borrowRequest.service.js";
import { getIO } from "../../utils/socket.js";
import User from "../user/User.model.js";
import mongoose from "mongoose";

export async function createBorrowRequest(req, res) {
  try {
    const { repository, teacher, items, note, expectedReturnDate } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Danh sách vật tư trống" });

    // Validate teacher
    const teacherData = await User.findOne({ userID: teacher });

    if (!teacherData) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên!" });
    }

    const br = await borrowRequestService.createBorrowRequest({
      repository,
      teacher: teacherData, // <-- ObjectId hợp lệ
      items,
      note,
      expectedReturnDate,
    });

    const io = getIO();
    io.to(`repo:${repository}:manager`).emit("borrowRequest:new", br);

    res.status(201).json(br);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPendingRequests(req, res) {
  const list = await borrowRequestService.getPendingRequests();
  res.json(list);
}

export async function getMyBorrowing(req, res) {
  const teacherId = req.body.userID;

  if (!teacherId) {
    return res.status(400).json({ message: "Không thấy userID" });
  }
  const list = await borrowRequestService.getMyBorrowing(teacherId);
  res.json(list);
}

export async function rejectBorrowRequest(req, res) {
  try {
    const { id, managerId, repoID } = req.body;

    if (!managerId) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID phiếu mượn!" });
    }

    if (!repoID) {
      return res.status(400).json({ message: "Thiếu ID kho!" });
    }

    const br = await borrowRequestService.rejectBorrowRequest({
      id,
      managerId,
      repoID,
    });

    const io = getIO();

    const teacherId = br.teacher._id.toString();
    io.to(`user:${teacherId}`).emit("borrowRequest:rejected", br);

    io.to(`repo:${br.repository}:manager`).emit("borrowRequest:rejected", br);

    return res.json(br);
  } catch (err) {
    console.error("Reject error:", err);
    return res.status(400).json({ message: err.message });
  }
}

export async function approveBorrowRequest(req, res) {
  try {
    const { id, managerId, repoID } = req.body;

    if (!managerId) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    if (!repoID) {
      return res.status(404).json({ message: "Không tìm thấy kho!" });
    }

    const br = await borrowRequestService.approveBorrowRequest({
      id,
      managerId, 
      repoID, 
    });

    // Emit cho giảng viên + quản lý kho
    const io = getIO();
    const teacherId = br.teacher._id.toString();

    io.to(`user:${teacherId}`).emit("borrowRequest:approved", br);
    io.to(`repo:${repoID}:manager`).emit("borrowRequest:approved", br);

    return res.json(br);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
