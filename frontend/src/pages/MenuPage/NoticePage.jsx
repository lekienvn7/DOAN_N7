import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";

const NoticePage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/notifications/");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy thông báo", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3">
      {loading && (
        <p className="text-sm text-gray-400">Đang tải thông báo...</p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-sm text-gray-400">Không có thông báo nào</p>
      )}

      {notifications.map((not) => (
        <div
          key={not._id}
          className="bg-[#1b1b1b] rounded-lg p-3 border border-white/10 hover:border-white/20 transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-[20px] font-bold text-textpri">{not.title}</p>
              <p className="text-xs text-gray-300 mt-1">{not.message}</p>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {new Date(not.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticePage;
