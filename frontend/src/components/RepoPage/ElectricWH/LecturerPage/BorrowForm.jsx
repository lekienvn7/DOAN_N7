import React, { useEffect, useState } from "react";
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
  const { user } = useAuth();
  const isLocked = user?.isLocked;

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
      .get("/repository/material/electric")
      .then((res) => {
        if (res.data?.success) {
          setMaterials(res.data.materials || []);
        }
      })
      .catch(() => toast.error("Không tải được danh sách vật tư"));
  }, [repositoryId]);


  /* ================= TOGGLE SELECT ================= */
  const toggleSelect = (mat) => {
    if (isLocked) return;

    setSelected((prev) => {
      const existed = prev.find((i) => i._id === mat._id);

      if (existed) {
        setQtyMap((q) => {
          const clone = { ...q };
          delete clone[mat._id];
          return clone;
        });
        return prev.filter((i) => i._id !== mat._id);
      }

      return [...prev, mat];
    });
  };

  /* ================= QTY CHANGE ================= */
  const handleQtyChange = (id, max, value) => {
    if (isLocked) return;
    const qty = Math.min(Math.max(Number(value), 1), max);
    setQtyMap((prev) => ({ ...prev, [id]: qty }));
  };

  const hasSpecialSelected = selected.some((m) => m.borrowType === "approval");

  const isValid =
    !isLocked &&
    !!expectedReturnDate &&
    selected.length > 0 &&
    selected.every((m) => qtyMap[m._id] > 0);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isValid || loading || isLocked) return;
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
          ? "Phiếu mượn đã gửi và đang chờ duyệt ⏳"
          : "Mượn vật tư thành công ✨"
      );

      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi phiếu thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DATE ================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
            <div className="flex flex-col items-center gap-3 text-center">
              <Lock className="w-10 h-10 text-red-500" />
              <p className="text-red-500 text-[20px] font-semibold">
                Tài khoản đã bị khóa
              </p>
              <p className="text-[var(--text-tertiary)] text-sm max-w-[320px]">
                Bạn đã làm hỏng vật tư quá số lần cho phép.
                <br />
                Vui lòng liên hệ quản lý kho để được xem xét mở khóa.
              </p>
            </div>
          </div>
        )}

        {/* ================= LEFT ================= */}
        <div
          className={cn(
            "bg-[var(--bg-panel)] rounded-[20px] p-[20px] border border-[var(--border-light)]",
            isLocked && "opacity-40 pointer-events-none"
          )}
        >
          <h3 className="text-[var(--text-primary)] mb-[8px] font-semibold">
            Danh sách vật tư
          </h3>

          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-[14px]">
              <thead className="sticky top-0 bg-[var(--bg-panel)] z-10 border-b border-[var(--border-light)]">
                <tr className="text-[var(--text-tertiary)] text-left">
                  <th>#</th>
                  <th>Tên</th>
                  <th>SL</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {materials.map((m, idx) => {
                  const checked = selected.some((i) => i._id === m._id);

                  return (
                    <tr
                      key={m._id}
                      className={cn(
                        "border-b border-[var(--border-light)]",
                        checked && "bg-[var(--accent-blue)]/10"
                      )}
                    >
                      <td>{idx + 1}</td>
                      <td>{m.name}</td>
                      <td>{m.quantity}</td>
                      <td>
                        <input
                          type="checkbox"
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
            "bg-[var(--bg-panel)] rounded-[20px] p-[20px] border border-[var(--border-light)]",
            isLocked && "opacity-40 pointer-events-none"
          )}
        >
          <h3 className="text-[var(--text-primary)] mb-[10px] font-semibold">
            Phiếu mượn vật tư
          </h3>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start mb-4">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expectedReturnDate
                  ? format(expectedReturnDate, "dd/MM/yyyy")
                  : "Chọn hạn trả"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={expectedReturnDate}
                onSelect={setExpectedReturnDate}
                disabled={(date) => date < today || date - today > 14 * ONE_DAY}
              />
            </PopoverContent>
          </Popover>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={cn(
              "mt-4 w-full py-2 rounded font-semibold",
              isValid
                ? "bg-[var(--accent-blue)] text-white"
                : "bg-[var(--bg-hover)] text-[var(--text-quaternary)]"
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
