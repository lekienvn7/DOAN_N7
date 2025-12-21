import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const BorrowForm = ({ borrowList, onUpdateQuantity, repositoryId }) => {
  const [qtyMap, setQtyMap] = useState({});
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expectedReturnDate, setExpectedReturnDate] = useState(undefined);
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const { user } = useAuth();

  const getMaterialId = (item) => item.material?._id || item._id;

  const getMaterialName = (item) => item.material?.name || item.name || "—";

  const handleChange = (id, max, val) => {
    const value = Math.min(Number(val), max);
    setQtyMap((prev) => ({ ...prev, [id]: value }));
    onUpdateQuantity(id, value);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isValid = () => {
    if (borrowList.length === 0) return false;
    if (!expectedReturnDate) return false;

    for (const item of borrowList) {
      const id = getMaterialId(item);
      const qty = qtyMap[id];

      if (qty === "" || qty === undefined || qty === null) return false;
      if (Number(qty) <= 0) return false;
      if (Number(qty) > item.quantity) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const items = borrowList.map((item) => {
        const id = getMaterialId(item);
        return {
          material: id,
          quantity: qtyMap[id],
        };
      });

      const payload = {
        repository: repositoryId,
        items,
        note: notice,
        teacher: user.userID,
        expectedReturnDate,
      };

      if (user.isLocked) {
        throw new Error("Tài khoản đã bị khóa do trả vật tư quá hạn");
      }

      await axiosClient.post("/borrow-requests", payload);

      toast.success("Đã gửi phiếu mượn!");

      setTimeout(() => {
        window.location.reload();
      }, 300);

      // Reset form
      setQtyMap({});
      setNotice("");
      setExpectedReturnDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi phiếu thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="flex flex-col gap-[25px] w-[500px]">
        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[5px]">
            <p className="ml-[5px] text-[13px]">
              Hạn trả <span className="text-red-400">*</span>
            </p>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal bg-[#222] text-white cursor-pointer",
                    !expectedReturnDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expectedReturnDate
                    ? format(expectedReturnDate, "dd/MM/yyyy")
                    : "Chọn ngày trả"}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0 bg-[#0f0f0f] text-textpri "
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={expectedReturnDate}
                  onSelect={setExpectedReturnDate}
                  disabled={(date) =>
                    date < today || date - today > 14 * ONE_DAY
                  } // không chọn ngày quá khứ
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="max-h-[250px] w-[570px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60">
          <table>
            <thead className="border-b border-gray-700 bg-[#1a0f08]">
              <tr className="text-left text-[#fdd700] p-[10px]">
                <th className="w-[60%]">Tên vật tư</th>
                <th className="w-[10%]">S.lượng</th>
              </tr>
            </thead>

            <tbody>
              {borrowList.length === 0 && (
                <tr>
                  <td colSpan={2}>
                    <p className="opacity-40">Chưa chọn vật tư muốn mượn</p>
                  </td>
                </tr>
              )}

              {borrowList.map((item) => (
                <tr key={getMaterialId(item)} className="text-[14px]">
                  <td className="p-[5px]">{getMaterialName(item)}</td>

                  <td>
                    <div className="flex flex-row gap-[5px]">
                      <input
                        type="number"
                        max={item.quantity}
                        value={qtyMap[getMaterialId(item)] || ""}
                        onChange={(e) =>
                          handleChange(
                            getMaterialId(item),
                            item.quantity,
                            e.target.value
                          )
                        }
                        className="no-arrows w-[40px] px-[10px] bg-[#222] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#fdd700]"
                      />
                      / {item.quantity}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-[5px]">
          <p className="ml-[5px]">Ghi chú</p>
          <input
            type="text"
            value={notice}
            placeholder="Ghi chú..."
            onChange={(e) => setNotice(e.target.value)}
            className="w-[570px] px-[10px] py-[5px] bg-[#222] placeholder:text-gray-400 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#fdd700]"
          />
        </div>

        <div className="w-[570px] flex flex-col items-center">
          <button
            disabled={!isValid() || submitting}
            onClick={handleSubmit}
            className={`rounded-[12px] p-[10px] w-[200px] ${
              !isValid()
                ? "bg-textsec cursor-not-allowed"
                : "bg-highlightcl cursor-pointer hover:bg-[#60a5fa]"
            }`}
          >
            {submitting ? "Đang gửi..." : "Gửi phiếu mượn"}
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default BorrowForm;
