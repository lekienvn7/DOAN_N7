import axiosClient from "@/api/axiosClient";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
window.socket = io("http://localhost:5001");

const BorrowList = ({ onBellChange, onReloadTicket, reload }) => {
  const [request, setRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const CHEMICAL_REPO_ID = "69230a5e163002521d0aa697";

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await axiosClient.get("/borrow-requests/pending");

      const filtered = (res.data || []).filter(
        (r) => r.repository === CHEMICAL_REPO_ID
      );

      setRequest(filtered);
      onBellChange(filtered.length);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Nhận tín hiệu realtime khi giảng viên (lecture) gửi phiếu
    window.socket.on("new-borrow-request", () => {
      loadData();
      toast.info("Có phiếu mượn mới!");
    });

    return () => {
      window.socket.off("new-borrow-request");
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosClient.patch("/borrow-requests/approve", {
        id,
        managerId: user.userID,
        repoID: "69230a5e163002521d0aa697",
      });

      setRequest((prev) => {
        const updated = prev.filter((r) => r._id !== id);
        onBellChange(updated.length);
        return updated;
      });

      toast.success("Duyệt phiếu thành công!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi duyệt phiếu!");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosClient.patch(`/borrow-requests/reject`, {
        id,
        managerId: user._id,
        repoID: "69230a5e163002521d0aa697",
      });

      setRequest((prev) => {
        const newList = prev.filter((r) => r._id !== id);
        onBellChange(newList.length); // <-- dùng newList mới CHUẨN
        return newList;
      });

      toast.success("Đã từ chối!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi từ chối phiếu!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-[#fb923c] border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#fb923c]/50 hover:scrollbar-thumb-[#fca86b]/60 pr-2"
      style={{ maxWidth: "calc(350px + 32px)" }}
    >
      {request.map((item) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 90, damping: 12 }}
          className="w-[350px]  bg-[#2c2c2e] rounded-[12px] px-4 py-5 flex-shrink-0 border border-[#3F3F46]"
        >
          <p className="font-bold text-[#fb923c] text-[18px]">
            Phiếu #{item._id.slice(-5)}
          </p>

          <div className="mt-2 text-textpri">
            <p>
              <span className="font-semibold text-[#fb923c]">GV:</span>{" "}
              {item.teacher.fullName || "—"}
            </p>
            <p>
              <span className="font-semibold text-[#fb923c]">Ghi chú:</span>{" "}
              {item.note || "—"}
            </p>
          </div>

          <div className="mt-3">
            <p className="font-semibold text-[#fb923c] mb-1">
              Vật tư cần mượn:
            </p>

            <div className="flex flex-col gap-2 h-[500px] max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#fb923c]/50 hover:scrollbar-thumb-[#fca86b]/60 pr-1">
              {item.items?.map((it, idx) => (
                <div
                  key={idx}
                  className=" flex justify-between bg-[#1f1f1f] px-3 py-2 rounded-[10px] border border-[#3F3F46]"
                >
                  <p className="text-textpri">{it.material?.name || "—"}</p>
                  <p className="text-[#fb923c] font-semibold">x{it.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-row gap-2">
            <button
              className="w-full py-2 rounded-[10px] bg-green-600 hover:bg-green-700 transition-all cursor-pointer"
              onClick={() => {
                handleApprove(item._id);
              }}
            >
              Duyệt
            </button>

            <button
              className="w-full py-2 rounded-[10px] bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
              onClick={() => handleReject(item._id)}
            >
              Từ chối
            </button>
          </div>
        </motion.div>
      ))}

      {request.length === 0 && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", stiffness: 90, damping: 12 }}
          className="w-[350px] h-[350px] bg-[#2c2c2e] rounded-[12px] px-4 py-5 flex-shrink-0 text-center border border-[#3F3F46]"
        >
          <p className="text-textsec">Không có phiếu nào.</p>
        </motion.div>
      )}
    </div>
  );
};

export default BorrowList;
