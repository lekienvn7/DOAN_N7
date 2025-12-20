import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { motion } from "framer-motion";

const ReportPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [returningId, setReturningId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear().toString().slice(-2)}`;
  };

  const loadData = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/borrow-requests/my-borrowing/${user._id}`
      );
      setRequests(res.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReturn = async (id) => {
    if (!id) return;

    const toastId = toast.loading("Đang trả vật tư...");
    setReturningId(id);

    try {
      await axiosClient.put(`/borrow-requests/return/${id}`);
      toast.success("Trả vật tư thành công!", { id: toastId });
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Trả vật tư thất bại!", {
        id: toastId,
      });
    } finally {
      setReturningId(null);
    }
  };

  const statusList = [{ type: "approved", name: "Đang mượn" }];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-[#fb923c] border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[30px] gap-[20px]">
      <div className="p-[20px]">
        <p className="text-left text-textpri text-[20px]">
          Danh sách phiếu mượn của tôi
        </p>
      </div>

      <div className="w-[1460px] flex justify-center">
        <div className="flex flex-row gap-[20px] p-[20px] max-w-[1350px] h-[550px] items-center overflow-x-auto scrollbar-thin scrollbar-thumb-[#fb923c]/50 hover:scrollbar-thumb-[#fca86b]/60">
          {requests.length === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-[350px] h-[300px] bg-[#2c2c2e] rounded-[12px] px-4 py-5 flex-shrink-0 text-center border border-[#3F3F46]"
            >
              <p className="text-textsec">Không có phiếu mượn nào.</p>
            </motion.div>
          )}

          {requests.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 12 }}
              className="w-[350px] bg-[#2c2c2e] rounded-[12px] px-4 py-5 flex-shrink-0 border border-[#3F3F46]"
            >
              <p className="font-bold text-[#fb923c] text-[18px]">Phiếu mượn</p>

              <div className="mt-2 text-textpri text-sm space-y-1">
                <p>
                  <span className="font-semibold text-[#fb923c]">
                    Mã phiếu:
                  </span>{" "}
                  BR-{item._id.slice(-5).toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold text-[#fb923c]">GV:</span>{" "}
                  {item.teacher?.fullName || "—"}
                </p>
                <p>
                  <span className="font-semibold text-[#fb923c]">Ghi chú:</span>{" "}
                  {item.note || "—"}
                </p>
                <p>
                  <span className="font-semibold text-[#fb923c]">
                    Ngày mượn:
                  </span>{" "}
                  {formatDate(item.createdAt)}
                </p>
                <p>
                  <span className="font-semibold text-[#fb923c]">
                    Ngày trả (dự kiến):
                  </span>{" "}
                  {formatDate(item.expectedReturnDate)}
                </p>
                <p>
                  <span className="font-semibold text-[#fb923c]">
                    Trạng thái:
                  </span>{" "}
                  <span
                    className={`font-semibold ${
                      item.status === "approved"
                        ? "text-green-400"
                        : item.status === "returned"
                        ? "text-blue-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {statusList.find((r) => r.type === item.status)?.name ||
                      item.status}
                  </span>
                </p>
              </div>

              <div className="mt-3">
                <p className="font-semibold text-[#fb923c] mb-1">
                  Vật tư mượn:
                </p>

                <div className="flex flex-col gap-2 max-h-[130px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#fb923c]/50 pr-1">
                  {item.items?.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between bg-[#1f1f1f] px-3 py-2 rounded-[10px] border border-[#3F3F46]"
                    >
                      <p className="text-textpri text-sm">
                        {it.material?.name || "—"}
                      </p>
                      <p className="text-[#fb923c] font-semibold text-sm">
                        x{it.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION */}
              <div className="mt-4">
                {item.status === "approved" ? (
                  <button
                    disabled={returningId === item._id}
                    onClick={() => handleReturn(item._id)}
                    className="w-full py-2 rounded-[10px] bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all"
                  >
                    {returningId === item._id ? "Đang trả..." : "Trả vật tư"}
                  </button>
                ) : (
                  <p className="text-center text-xs text-textsec italic">
                    {item.status === "returned"
                      ? "Phiếu đã được trả"
                      : "Chờ quản lý duyệt"}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
