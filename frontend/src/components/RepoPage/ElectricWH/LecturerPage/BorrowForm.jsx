import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";

const BorrowForm = ({
  borrowList,
  onUpdateQuantity,
  repositoryId,
  onBorrowSuccess,
}) => {
  const [qtyMap, setQtyMap] = useState({});
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const getMaterialId = (item) => item.material?._id || item._id;

  const getMaterialName = (item) => item.material?.name || item.name || "—";

  const handleChange = (id, max, val) => {
    const value = Math.min(Number(val), max);
    setQtyMap((prev) => ({ ...prev, [id]: value }));
    onUpdateQuantity(id, value);
  };

  const isValid = () => {
    if (borrowList.length === 0) return false;

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
      };

      await axiosClient.post("/borrow-requests", payload);

      toast.success("Đã gửi phiếu mượn!");

      setTimeout(() => {
        window.location.reload();
      }, 300);

      // Reset form
      setQtyMap({});
      setNotice("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi phiếu thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="flex flex-col gap-[35px] p-[15px] w-[240px] bg-bgmain border-t-1 border-r-1 border-gray-700">
        <div className="flex flex-col gap-[5px]">
          <h2 className="text-center text-[20px] font-bold">
            Phiếu mượn vật tư
          </h2>
          <p className="text-center text-[12px] text-textsec">
            <span className="text-red-400">Chú ý:</span> không được mượn bằng
            hoặc quá số lượng tồn kho
          </p>
        </div>

        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60">
          <table>
            <thead className="border-b border-gray-700 bg-[#1a0f08]">
              <tr className="text-left text-[#fdd700] p-[10px]">
                <th className="w-[65%]">Tên vật tư</th>
                <th className="w-[35%]">S.lượng</th>
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
            className="w-[200px] px-[10px] py-[5px] bg-[#222] placeholder:text-gray-400 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#fdd700]"
          />
        </div>

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
    </AnimatePresence>
  );
};

export default BorrowForm;
