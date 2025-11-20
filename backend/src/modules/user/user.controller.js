
import dotenv from "dotenv";
import userService from "./user.service.js";

dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách tài khoản thành công!",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllUser:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const result = await userService.addUser(req.body);

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công!",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi khi tạo user:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const result = await userService.changePassword(req.params.id, req.body);

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error("Lỗi changePassword:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi updateUser:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const result = await userService.resetUserPassword(req.params);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Lỗi khi reset mật khẩu:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteUser", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Lỗi hệ thống!",
    });
  }
};
