import {
  createNotification,
  getAllNotifications,
  markAsRead,
} from "./notice.service.js";

export const getNotifications = async (req, res) => {
  try {
    const data = await getAllNotifications();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await markAsRead(id, req.user._id);

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
