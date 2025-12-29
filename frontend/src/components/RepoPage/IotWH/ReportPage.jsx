import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { motion, AnimatePresence } from "framer-motion";

const ReportPage = ({ canReturn = false }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [returningId, setReturningId] = useState(null);

  const repoId = "6909810f5de9a612110089d3";

  const [openReturn, setOpenReturn] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [returnItems, setReturnItems] = useState([]);

  /* ================= HELPERS ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear().toString().slice(-2)}`;
  };

  /* ================= LOAD DATA ================= */
  const loadData = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/borrow-requests/my-borrowing/${user._id}`
      );
      
      const filtered = (res.data || []).filter(
        (r) => r.repository?._id === repoId || r.repository === repoId
      );

      setRequests(filtered);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ================= RETURN FLOW ================= */
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[420px] gap-4">
        <div className="w-10 h-10 border-4 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)]">Đang tải dữ liệu…</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <>
      <div className="flex flex-col gap-[50px]">
        <p className="text-[34px] font-bold font-googleSans text-[var(--text-tertiary)]">
          <span className="gradient-text">Vật tư</span> đang mượn
        </p>

        <div className="flex gap-[24px] overflow-x-auto pb-[10px]">
          {/* ===== EMPTY STATE ===== */}
          {requests.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                w-[340px] shrink-0
                bg-[var(--bg-panel)]
                border border-[var(--border-light)]
                rounded-[16px]
                p-[20px]
                flex flex-col items-center justify-center
                text-center
              "
            >
              <p className="font-semibold text-[var(--text-primary)] mb-2">
                Không có phiếu mượn
              </p>
              <p className="text-sm text-[var(--text-tertiary)]">
                Hiện tại bạn chưa mượn vật tư nào.
              </p>
            </motion.div>
          )}

          {/* ===== NORMAL CARDS ===== */}
          {requests.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                w-[340px] shrink-0
                bg-[var(--bg-panel)]
                border border-[var(--border-light)]
                rounded-[16px]
                p-[20px]
              "
            >
              <p className="font-semibold text-[var(--text-primary)]">
                Phiếu mượn
              </p>

              <div className="mt-3 text-sm space-y-1">
                <p>
                  <span className="text-[var(--text-tertiary)]">Mã:</span> BR-
                  {item._id.slice(-5).toUpperCase()}
                </p>

                <p>
                  <span className="text-[var(--text-tertiary)]">GV:</span>{" "}
                  {item.teacher?.fullName || "—"}
                </p>

                <p>
                  <span className="text-[var(--text-tertiary)]">
                    Ngày trả dự kiến:
                  </span>{" "}
                  {formatDate(item.expectedReturnDate)}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    Vật tư đang mượn
                  </p>

                  <div
                    className="h-[110px]
      max-h-[110px]
      overflow-y-auto
      pr-1
      space-y-1
      scrollbar-thin
      scrollbar-thumb-[#3a3a3c]
      scrollbar-track-transparent
    "
                  >
                    {item.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="
                            text-sm
                            flex justify-between items-center
                            text-[var(--text-secondary)]
                            bg-[var(--bg-hover)]
                            rounded-[8px]
                            px-2 py-1
        "
                      >
                        <span className="truncate max-w-[170px]">
                          {it.material?.name || "—"}
                        </span>
                        <span className="text-[var(--text-tertiary)] shrink-0">
                          × {it.quantity} {it.material?.unit || ""}
                        </span>
                      </div>
                    ))}

                    {item.items?.length === 0 && (
                      <p className="text-xs text-[var(--text-tertiary)] italic">
                        Không có vật tư
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-[var(--success)] font-medium">Đang mượn</p>
              </div>

              {canReturn && item.status === "approved" && (
                <button
                  disabled={returningId === item._id}
                  onClick={() => openReturnModal(item)}
                  className="
                    mt-4 w-full py-2
                    rounded-[12px]
                    border border-[#424245]
                    text-[var(--text-secondary)]
                    hover:bg-[#424245]
                    hover:text-textpri
                    transition
                  "
                >
                  Trả vật tư
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= RETURN MODAL ================= */}
      <AnimatePresence>
        {openReturn && canReturn && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-[620px] rounded-[20px] p-[24px]"
            >
              <p className="text-lg font-semibold mb-4">Trả vật tư</p>

              <div className="space-y-3 max-h-[360px] overflow-y-auto">
                {returnItems.map((it, idx) => (
                  <div key={idx} className="border rounded-[12px] p-3">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-sm text-gray-500">
                      Đã mượn: {it.borrowedQty}
                    </p>

                    <div className="flex gap-4 mt-2 text-sm">
                      <label className="flex gap-1 items-center">
                        <input
                          type="radio"
                          checked={it.condition === "intact"}
                          onChange={() => updateCondition(idx, "intact")}
                        />
                        Nguyên vẹn
                      </label>

                      <label className="flex gap-1 items-center">
                        <input
                          type="radio"
                          checked={it.condition === "damaged"}
                          onChange={() => updateCondition(idx, "damaged")}
                        />
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
                        className="mt-2 w-full border rounded px-2 py-1"
                        placeholder="Số lượng hỏng"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setOpenReturn(false)}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Huỷ
                </button>

                <button
                  disabled={!isValidReturn}
                  onClick={confirmReturn}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
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
