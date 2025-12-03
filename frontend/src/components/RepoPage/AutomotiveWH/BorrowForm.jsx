import React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BorrowForm = ({ borrowList, onUpdateQuantity }) => {
  const [qtyMap, setQtyMap] = useState({}); // mỗi item 1 quantity riêng

  const handleChange = (id, max, val) => {
    const value = Math.min(Number(val), max); // chặn vượt số lượng
    setQtyMap((prev) => ({ ...prev, [id]: value }));
    onUpdateQuantity(id, value);
  };

  const isValid = () => {
    if (borrowList.length === 0) return false;

    for (const item of borrowList) {
      const qty = qtyMap[item._id];

      // Không được để trống
      if (qty === "" || qty === undefined || qty === null) return false;

      // Không được = 0
      if (Number(qty) <= 0) return false;

      // Không được vượt tồn kho
      if (Number(qty) > item.quantity) return false;
    }

    return true;
  };

  return (
    <AnimatePresence>
      <div className="flex flex-col gap-[35px] p-[15px] w-[240px]">
        <div className="flex flex-col gap-[5px]">
          <h2 className="text-center text-[18px] font-bold">
            Phiếu mượn vật tư
          </h2>
          <p className="text-[12px] text-textsec">
            <span className="text-red-400">Chú ý: </span>không được mượn bằng
            hoặc quá số lượng tồn kho
          </p>
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60">
          <table>
            <thead className="border-b border-gray-700 bg-[#1a0f08]">
              <tr className="text-left text-[#fb923c] p-[10px]">
                <th className="w-[65%]">Tên vật tư</th>
                <th className="w-[35%]">S.lượng</th>
              </tr>
            </thead>

            <tbody>
              {borrowList.length === 0 && (
                <p className="opacity-40">Chưa chọn vật tư</p>
              )}

              {borrowList.map((item) => (
                <tr key={item._id} className="text-[14px]">
                  <td className="p-[5px]">{item.name}</td>

                  <td>
                    <div className="flex flex-row gap-[5px]">
                      <input
                        type="number"
                        max={item.quantity}
                        value={qtyMap[item._id] || ""}
                        onChange={(e) =>
                          handleChange(item._id, item.quantity, e.target.value)
                        }
                        className="no-arrows w-[40px] px-[10px] bg-[#222] rounded-[12px]"
                      />
                      / {item.quantity}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button disabled={!isValid()} className={` rounded-[12px] p-[10px] w-[200px] ${!isValid() ? "bg-textsec cursor-not-allowed": "bg-highlightcl cursor-pointer hover:bg-[#60a5fa]"}`}>
          Gửi phiếu mượn
        </button>
      </div>
    </AnimatePresence>
  );
};

export default BorrowForm;
