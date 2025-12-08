import borrowRequestService from "./borrowRequest.service.js";
import { getIO } from "../../utils/socket.js";

export async function createBorrowRequest(req, res) {
  try {
    const { repository, teacher, items, note, expectedReturnDate } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Danh sách vật tư trống" });

    const br = await borrowRequestService.createBorrowRequest({
      repository,
      teacher,
      items,
      note,
      expectedReturnDate,
    });

    // Báo cho quản lý kho
    const io = getIO();
    io.to(`repo:${repository}:manager`).emit("borrowRequest:new", br);

    res.status(201).json(br);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPendingRequests(req, res) {
  const { repoID } = req.params;

  const list = await borrowRequestService.getPendingRequests(repoID);
  res.json(list);
}

export async function approveBorrowRequest(req, res) {
  try {
    const { id } = req.params;
    const managerId = req.user._id;

    const br = await borrowRequestService.approveBorrowRequest({
      id,
      managerId,
    });

    // Emit cho giảng viên + quản lý kho
    const io = getIO();
    io.to(`user:${br.teacher}`).emit("borrowRequest:approved", br);
    io.to(`repo:${br.repository}:manager`).emit("borrowRequest:approved", br);

    res.json(br);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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
    const { id } = req.params;
    const managerId = req.user._id;

    const br = await borrowRequestService.rejectBorrowRequest({
      id,
      managerId,
    });

    const io = getIO();
    io.to(`user:${br.teacher}`).emit("borrowRequest:rejected", br);
    io.to(`repo:${br.repository}:manager`).emit("borrowRequest:rejected", br);

    res.json(br);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
