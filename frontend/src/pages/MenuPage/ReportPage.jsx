import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { motion, AnimatePresence } from "framer-motion";

const ReportPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [returningId, setReturningId] = useState(null);

  const [openReturn, setOpenReturn] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [returnItems, setReturnItems] = useState([]);

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

  /* ================== OPEN RETURN MODAL ================== */
  const openReturnModal = (request) => {
    setCurrentRequest(request);
    setReturnItems(
      request.items.map((it) => ({
        materialId: it.material._id,
        name: it.material.name,
        borrowedQty: it.quantity,
        condition: "intact",
        damagedQty: 0,
      }))
    );
    setOpenReturn(true);
  };

  const updateCondition = (idx, condition) => {
    setReturnItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? {
              ...it,
              condition,
              damagedQty: condition === "damaged" ? it.damagedQty : 0,
            }
          : it
      )
    );
  };

  const updateDamagedQty = (idx, value) => {
    setReturnItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? {
              ...it,
              damagedQty: Math.min(Math.max(0, Number(value)), it.borrowedQty),
            }
          : it
      )
    );
  };

  const isValidReturn = returnItems.every((it) => {
    if (it.condition === "intact") return true;
    return it.damagedQty > 0 && it.damagedQty <= it.borrowedQty;
  });

  /* ================== CONFIRM RETURN ================== */
  const confirmReturn = async () => {
    const toastId = toast.loading("Đang trả vật tư...");
    setReturningId(currentRequest._id);

    try {
      await axiosClient.put(`/borrow-requests/return/${currentRequest._id}`, {
        returnItems,
      });

      toast.success("Trả vật tư thành công!", { id: toastId });
      setOpenReturn(false);
      setCurrentRequest(null);
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
    <>
      <div className="flex flex-col px-[30px] gap-[20px]">
        <div className="p-[20px]">
          <p className="text-left text-textpri text-[20px]">
            Danh sách phiếu mượn của tôi
          </p>
        </div>

        <div className="w-[1460px] flex justify-center">
          <div className="flex flex-row gap-[20px] p-[20px] max-w-[1350px] h-[550px] items-center overflow-x-auto">
            {requests.map((item) => (
              <motion.div
                key={item._id}
                className="w-[350px] bg-[#2c2c2e] rounded-[12px] px-4 py-5 flex-shrink-0 border border-[#3F3F46]"
              >
                <p className="font-bold text-[#fb923c] text-[18px]">
                  Phiếu mượn
                </p>

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
                    <span className="font-semibold text-[#fb923c]">
                      Ngày trả (dự kiến):
                    </span>{" "}
                    {formatDate(item.expectedReturnDate)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#fb923c]">
                      Trạng thái:
                    </span>{" "}
                    <span className="text-green-400">Đang mượn</span>
                  </p>
                </div>

                <div className="mt-4">
                  {item.status === "approved" && (
                    <button
                      onClick={() => openReturnModal(item)}
                      className="w-full py-2 rounded-[10px] bg-green-600 hover:bg-green-700"
                    >
                      Trả vật tư
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================== RETURN MODAL ================== */}
      <AnimatePresence>
        {openReturn && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1f1f1f] w-[600px] rounded-[12px] p-5 text-textpri"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-[#fb923c] font-bold text-lg mb-4">
                Trả vật tư
              </p>

              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {returnItems.map((it, idx) => (
                  <div
                    key={idx}
                    className="border border-[#3F3F46] p-3 rounded"
                  >
                    <p className="font-semibold">{it.name}</p>
                    <p className="text-sm">Đã mượn: {it.borrowedQty}</p>

                    <div className="flex gap-4 mt-2">
                      <label>
                        <input
                          type="radio"
                          checked={it.condition === "intact"}
                          onChange={() => updateCondition(idx, "intact")}
                        />{" "}
                        Nguyên vẹn
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={it.condition === "damaged"}
                          onChange={() => updateCondition(idx, "damaged")}
                        />{" "}
                        Hỏng
                      </label>
                    </div>

                    {it.condition === "damaged" && (
                      <input
                        type="number"
                        min={1}
                        max={it.borrowedQty}
                        value={it.damagedQty}
                        onChange={(e) => updateDamagedQty(idx, e.target.value)}
                        className="mt-2 w-full bg-[#2c2c2e] border border-[#3F3F46] rounded px-2 py-1"
                        placeholder="Số lượng hỏng"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setOpenReturn(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Huỷ
                </button>
                <button
                  disabled={!isValidReturn}
                  onClick={confirmReturn}
                  className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
                >
                  Xác nhận trả
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportPage;
