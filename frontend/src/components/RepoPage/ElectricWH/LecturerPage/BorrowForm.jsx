import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const BorrowForm = ({ repositoryId }) => {
  const { user } = useAuth();

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
    const qty = Math.min(Math.max(Number(value), 1), max);
    setQtyMap((prev) => ({ ...prev, [id]: qty }));
  };

  /* ================= CHECK SPECIAL ================= */
  const hasSpecialSelected = selected.some((m) => m.borrowType === "approval");

  /* ================= VALIDATE ================= */
  const isValid =
    !!expectedReturnDate &&
    selected.length > 0 &&
    selected.every((m) => qtyMap[m._id] > 0);

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

  /* ================= DATE HELPERS ================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getNextMaintenanceDate = (startDate, months) => {
    if (!startDate || !months) return null;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const getDaysLeft = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    const diff = targetDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear().toString().slice(-2);
    return `${d}/${m}/${y}`;
  };

  /* ================= UI ================= */
  return (
    <div className="grid grid-cols-2 gap-[40px]">
      {/* ================= LEFT ================= */}
      <div className="bg-[#111] rounded-[20px] p-[20px]">
        <h3 className="text-[#fdd700] mb-[4px] font-bold">Danh sách vật tư</h3>
        <p className="text-[12px] text-gray-400 mb-[10px]">
          Vật tư <span className="text-pink-400">đặc biệt cần duyệt</span> sẽ
          được làm nổi bật
        </p>

        <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-[14px]">
            <thead className="sticky top-0 bg-[#111] z-10 text-left opacity-70 border-b border-gray-700">
              <tr>
                <th className="py-2">#</th>
                <th>Tên</th>
                <th>SL</th>
                <th>Bảo trì</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {materials.map((m, idx) => {
                const disabled = m.quantity === 0;
                const checked = selected.some((i) => i._id === m._id);
                const isSpecial = m.borrowType === "approval";

                return (
                  <tr
                    key={m._id}
                    className={cn(
                      "border-b border-gray-800 transition",
                      disabled && "opacity-40",
                      isSpecial && "bg-pink-500/10",
                      checked && "bg-[#fdd700]/10"
                    )}
                  >
                    <td className="py-2">{idx + 1}</td>

                    <td className="flex items-center gap-2">
                      <span
                        className={cn(isSpecial && "text-pink-300 font-medium")}
                      >
                        {m.name}
                      </span>
                      {isSpecial && (
                        <span className="text-[11px] px-2 py-[2px] rounded-full bg-pink-500/20 text-pink-400">
                          Cần duyệt
                        </span>
                      )}
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
                                  daysLeft <= 7
                                    ? "text-red-500"
                                    : "text-textpri"
                                }
                              >
                                {daysLeft <= 7
                                  ? `Còn ${daysLeft} ngày`
                                  : formatDate(nextDate)}
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
      <div className="h-fit bg-[#111] rounded-[20px] p-[20px]">
        <h3 className="text-[#fdd700] mb-[8px] font-bold">Phiếu mượn vật tư</h3>

        {hasSpecialSelected && (
          <p className="text-[13px] text-pink-400 mb-[10px]">
            Phiếu này sẽ <b>cần duyệt</b> do có vật tư đặc biệt
          </p>
        )}

        {/* DATE PICKER */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "mb-[15px] w-full justify-start bg-[#111] text-white border border-gray-700",
                "hover:bg-[#1a1a1a]",
                !expectedReturnDate && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expectedReturnDate
                ? format(expectedReturnDate, "dd/MM/yyyy")
                : "Chọn hạn trả"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="bg-bgmain text-textpri">
            <Calendar
              mode="single"
              selected={expectedReturnDate}
              onSelect={setExpectedReturnDate}
              disabled={(date) => date < today || date - today > 14 * ONE_DAY}
            />
          </PopoverContent>
        </Popover>

        {/* SELECTED */}
        <div className="max-h-[300px] overflow-y-auto mb-[10px]">
          {selected.length === 0 && (
            <p className="text-gray-500 text-sm">Chưa chọn vật tư</p>
          )}

          {selected.map((m) => (
            <div key={m._id} className="flex items-center gap-[10px] mb-[8px]">
              <p className="flex-1 truncate">{m.name}</p>
              <input
                type="number"
                min={1}
                max={m.quantity}
                value={qtyMap[m._id] || ""}
                className="w-[70px] bg-[#222] rounded px-2 py-1"
                onChange={(e) =>
                  handleQtyChange(m._id, m.quantity, e.target.value)
                }
              />
              <span className="opacity-50">/ {m.quantity}</span>
            </div>
          ))}
        </div>

        {/* NOTE */}
        <input
          className="w-full mt-[12px] bg-[#222] px-3 py-2 rounded"
          placeholder="Ghi chú..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={cn(
            "mt-[16px] w-full py-2 rounded font-semibold transition",
            isValid
              ? "bg-[#fdd700] text-black hover:bg-[#ffe066]"
              : "bg-gray-600 cursor-not-allowed"
          )}
        >
          {loading ? "Đang gửi..." : "Gửi phiếu mượn"}
        </button>
      </div>
    </div>
  );
};

export default BorrowForm;
