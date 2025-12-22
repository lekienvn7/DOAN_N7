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
    <div
      className="
        max-h-[550px]
        overflow-y-auto
        pr-[6px]
        space-y-[12px]
      "
    >
      {/* ===== LOADING ===== */}
      {loading && (
        <p className="text-[14px] text-[var(--text-secondary)]">
          Đang tải thông báo…
        </p>
      )}

      {/* ===== EMPTY ===== */}
      {!loading && notifications.length === 0 && (
        <p className="text-[14px] text-[var(--text-secondary)]">
          Không có thông báo nào
        </p>
      )}

      {/* ===== LIST ===== */}
      {notifications.map((not) => (
        <div
          key={not._id}
          className="
            bg-[var(--bg-subtle)]
            rounded-[14px]
            p-[14px]
            border
            border-[var(--border-light)]
            hover:bg-[var(--bg-hover)]
            transition
          "
        >
          <div className="flex items-start justify-between gap-[12px]">
            {/* LEFT */}
            <div className="flex flex-col gap-[4px]">
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                {not.title}
              </p>

              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.4]">
                {not.message}
              </p>
            </div>

            {/* DATE */}
            <span className="text-[12px] text-[var(--text-tertiary)] whitespace-nowrap">
              {new Date(not.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticePage;
