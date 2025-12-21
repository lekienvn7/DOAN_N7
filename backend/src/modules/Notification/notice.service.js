import Notification from "./Notice.model.js";

export async function createNotification({ type, title, message, user }) {
  if (!user) {
    console.warn("createNotification skipped: user is undefined");
    return null;
  }

  const userId = typeof user === "object" && user._id ? user._id : user;

  return Notification.create({
    type,
    title,
    message,
    user: userId,
  });
}

export async function getAllNotifications() {
  return Notification.find()
    .populate("user", "fullName userID")
    .sort({ createdAt: -1 })
    .limit(50); // tránh quá tải UI
}

export async function markAsRead(id, userId) {
  const not = await Notification.findOne({ _id: id, user: userId });
  if (!not) throw new Error("Không tìm thấy thông báo");

  not.isRead = true;
  await not.save();
  return not;
}
