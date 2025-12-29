import React, { useEffect, useMemo, useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Lock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const BorrowForm = ({ repositoryId }) => {
  const { user, refreshUser } = useAuth();
  const isLocked = !!user?.isLocked;

  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState([]);
  const [qtyMap, setQtyMap] = useState({});
  const [note, setNote] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const ONE_DAY = 24 * 60 * 60 * 1000;

  /* ================= FETCH MATERIAL ================= */
  useEffect(() => {
    axiosClient
      .get("/repository/material/mechanical", { params: { repositoryId } })
      .then((res) => {
        if (res.data?.success) setMaterials(res.data.materials || []);
        else setMaterials(res.data?.materials || []);
      })
      .catch(() => toast.error("Không tải được danh sách vật tư"));
  }, [repositoryId]);

  console.log("user", user);

  /* ================= DATE HELPERS (BẢO TRÌ) ================= */
  const getNextMaintenanceDate = useCallback((startDate, months) => {
    if (!startDate || !months) return null;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + Number(months));
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const getDaysLeft = useCallback((targetDate) => {
    if (!targetDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = targetDate - now;
    return Math.ceil(diff / ONE_DAY);
  }, []);

  const formatShortDate = useCallback((dateValue) => {
    const date = new Date(dateValue);
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear().toString().slice(-2);
    return `${d}/${m}/${y}`;
  }, []);

  console.log("User", user);

  /* ================= TOGGLE SELECT ================= */
  const toggleSelect = (mat) => {
    if (isLocked) return;
    if (!mat?._id) return;
    if (mat.quantity === 0) return;

    setSelected((prev) => {
      const existed = prev.some((i) => i._id === mat._id);

      if (existed) {
        // remove
        setQtyMap((q) => {
          const clone = { ...q };
          delete clone[mat._id];
          return clone;
        });
        return prev.filter((i) => i._id !== mat._id);
      }

      // add + default qty = 1
      setQtyMap((q) => ({
        ...q,
        [mat._id]: q[mat._id] ? q[mat._id] : 1,
      }));
      return [...prev, mat];
    });
  };

  /* ================= QTY CHANGE ================= */
  const handleQtyChange = (id, max, value) => {
    if (isLocked) return;
    const raw = Number(value);
    if (Number.isNaN(raw)) {
      setQtyMap((prev) => ({ ...prev, [id]: "" }));
      return;
    }
    const qty = Math.min(Math.max(raw, 1), Number(max || 1));
    setQtyMap((prev) => ({ ...prev, [id]: qty }));
  };

  /* ================= DERIVED ================= */
  const hasSpecialSelected = useMemo(
    () => selected.some((m) => m.borrowType === "approval"),
    [selected]
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isValid = useMemo(() => {
    if (isLocked) return false;
    if (!expectedReturnDate) return false;
    if (selected.length === 0) return false;

    // qtyMap must be filled and >0
    return selected.every((m) => {
      const qty = Number(qtyMap[m._id]);
      return qty > 0 && qty <= Number(m.quantity || qty);
    });
  }, [isLocked, expectedReturnDate, selected, qtyMap]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const items = selected.map((m) => ({
        material: m._id,
        quantity: qtyMap[m._id],
      }));
      await axiosClient.post("/borrow-requests", {
        repository: repositoryId,
        teacher: user.userID,
        expectedReturnDate,
        note,
        items,
      });
      toast.success(
        hasSpecialSelected
          ? "Phiếu mượn đã gửi và đang chờ duyệt"
          : "Mượn vật tư thành công"
      );
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi phiếu thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-[50px] relative">
      <p className="text-[34px] font-bold font-googleSans text-[var(--text-tertiary)]">
        <span className="gradient-text">Phiếu nhập</span> vật tư
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-[40px] relative"
      >
        {/* ===== OVERLAY KHÓA ===== */}
        {isLocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-[20px]">
            {" "}
            <div className="flex flex-col items-center gap-3 text-center">
              {" "}
              <Lock className="w-10 h-10 text-red-500" />{" "}
              <p className="text-red-500 text-[20px] font-semibold">
                {" "}
                Tài khoản đã bị khóa{" "}
              </p>{" "}
              <p className="text-textpri text-sm max-w-[320px]">
                {" "}
                Bạn đã làm hỏng vật tư quá số lần cho phép. <br /> Vui lòng liên
                hệ quản lý kho để được xem xét mở khóa.{" "}
              </p>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {/* ================= LEFT ================= */}
        <div
          className={cn(
            "bg-[var(--bg-panel)] rounded-[20px] p-[20px] border border-[var(--border-light)]",
            isLocked && "opacity-40 pointer-events-none"
          )}
        >
          <h3 className="text-[var(--text-primary)] mb-[4px] font-semibold">
            Danh sách vật tư
          </h3>
          <p className="text-[12px] text-[var(--text-tertiary)] mb-[10px]">
            Vật tư{" "}
            <span className="text-[var(--warning)]">đặc biệt cần duyệt</span> sẽ
            được làm nổi bật
          </p>

          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-[14px]">
              <thead className="sticky top-0 bg-[var(--bg-panel)] z-10 text-left border-b border-[var(--border-light)]">
                <tr className="text-[var(--text-tertiary)]">
                  <th className="py-2">#</th>
                  <th>Tên</th>
                  <th>SL</th>
                  <th>Bảo trì</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {materials.map((m, idx) => {
                  const disabled = Number(m.quantity) === 0;
                  const checked = selected.some((i) => i._id === m._id);
                  const isSpecial = m.borrowType === "approval";

                  return (
                    <tr
                      key={m._id}
                      className={cn(
                        "border-b border-[var(--border-light)] transition",
                        disabled && "opacity-40",
                        isSpecial && "bg-[var(--warning)]/10",
                        checked && "bg-[var(--accent-blue)]/10"
                      )}
                    >
                      <td className="py-2">{idx + 1}</td>

                      <td className="items-center gap-2">
                        <div className="flex flex-row items-center gap-[20px]">
                          <span
                            className={cn(
                              "text-[var(--text-secondary)]",
                              isSpecial && "font-medium"
                            )}
                          >
                            {m.name}
                          </span>

                          {isSpecial && (
                            <span className="text-[11px] px-2 py-[2px] rounded-full bg-[var(--warning)]/20 text-[var(--warning)]">
                              Cần duyệt
                            </span>
                          )}
                        </div>
                      </td>

                      <td>{m.quantity}</td>

                      <td>
                        {m.maintenanceCycle
                          ? (() => {
                              const nextDate = getNextMaintenanceDate(
                                m.createdAt,
                                m.maintenanceCycle
                              );
                              const daysLeft = getDaysLeft(nextDate);

                              return (
                                <span
                                  className={
                                    daysLeft != null && daysLeft <= 7
                                      ? "text-[var(--danger)]"
                                      : "text-[var(--text-secondary)]"
                                  }
                                >
                                  {daysLeft != null && daysLeft <= 7
                                    ? `Còn ${daysLeft} ngày`
                                    : nextDate
                                    ? formatShortDate(nextDate)
                                    : "—"}
                                </span>
                              );
                            })()
                          : "—"}
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          disabled={disabled}
                          checked={checked}
                          onChange={() => toggleSelect(m)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* ================= RIGHT ================= */}
        <div
          className={cn(
            "h-fit bg-[var(--bg-panel)] rounded-[20px] p-[20px] border border-[var(--border-light)]",
            isLocked && "opacity-40 pointer-events-none"
          )}
        >
          <h3 className="text-[var(--text-primary)] mb-[8px] font-semibold">
            Phiếu mượn vật tư
          </h3>

          {hasSpecialSelected && (
            <p className="text-[13px] text-[var(--warning)] mb-[10px]">
              Phiếu này sẽ <b>cần duyệt</b> do có vật tư đặc biệt
            </p>
          )}

          {/* DATE PICKER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "mb-[15px] w-full justify-start bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-light)]",
                  "hover:bg-[var(--bg-hover)]",
                  !expectedReturnDate && "text-[var(--text-quaternary)]"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expectedReturnDate
                  ? format(expectedReturnDate, "dd/MM/yyyy")
                  : "Chọn hạn trả"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-light)]">
              <Calendar
                mode="single"
                selected={expectedReturnDate}
                onSelect={setExpectedReturnDate}
                disabled={(date) => date < today || date - today > 14 * ONE_DAY}
              />
            </PopoverContent>
          </Popover>

          {/* SELECTED ITEMS + QTY */}
          <div className="max-h-[300px] overflow-y-auto mb-[10px]">
            {selected.length === 0 && (
              <p className="text-[var(--text-quaternary)] text-sm">
                Chưa chọn vật tư
              </p>
            )}

            {selected.map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-[10px] mb-[8px]"
              >
                <p className="flex-1 truncate text-[var(--text-secondary)]">
                  {m.name}
                </p>

                <input
                  type="number"
                  min={1}
                  max={m.quantity}
                  value={qtyMap[m._id] ?? ""}
                  className="w-[80px] bg-[var(--bg-subtle)] border border-[var(--border-light)] rounded px-2 py-1 text-[var(--text-primary)]"
                  onChange={(e) =>
                    handleQtyChange(m._id, m.quantity, e.target.value)
                  }
                />

                <span className="text-[var(--text-tertiary)]">
                  / {m.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => toggleSelect(m)}
                  className="text-[var(--text-quaternary)] hover:text-[var(--text-primary)] px-2"
                  title="Bỏ chọn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* NOTE */}
          <input
            className="w-full mt-[12px] bg-[var(--bg-subtle)] border border-[var(--border-light)] px-3 py-2 rounded text-[var(--text-primary)] placeholder:text-[var(--text-quaternary)]"
            placeholder="Ghi chú..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || isLocked}
            className={cn(
              "mt-[16px] w-full py-2 rounded font-semibold transition",
              isValid
                ? "bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-hover)]"
                : "bg-[var(--bg-hover)] text-[var(--text-quaternary)] cursor-not-allowed"
            )}
          >
            {loading ? "Đang gửi..." : "Gửi phiếu mượn"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BorrowForm;
