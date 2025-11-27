import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ReceiptText, Info } from "lucide-react";
import cadivi from "@/assets/images/cadivi225.png";

const FashionDetail = ({ item }) => {
  if (!item) return null;
  const [showInfo, setShowInfo] = useState(null);

  const breathList = [
    { type: "highly", name: "Rất thoáng khí" },
    { type: "good", name: "Thoáng khí tốt" },
    { type: "medium", name: "Thoáng khí trung bình" },
    { type: "low", name: "Thoáng khí thấp" },
    { type: "none", name: "Không thoáng khí" },
  ];

  const breathColor = (prev) => {
    if (prev.breathability === "highly") return "text-[#e0f2fe]";
    else if (prev.breathability === "good") return "text-[#93c5fd]";
    else if (prev.breathability === "medium") return "text-[#60a5fa]";
    else if (prev.breathability === "low") return "text-[#2563eb]";
    else {
      return "text-[#1e3a8a]";
    }
  };

  const fabricList = [
    { type: "light", name: "Vải siêu mỏng" },
    { type: "Lightweight", name: "Vải mỏng" },
    { type: "medium", name: "Vải trung bình" },
    { type: "Heavyweight", name: "Vải dày" },
    { type: "ultra", name: "Vải siêu dày" },
  ];

  const fabricColor = (prev) => {
    if (prev.fabricThickness === "light") return "text-[#f1f5f9]";
    else if (prev.fabricThickness === "Lightweight") return "text-[#cbd5e1]";
    else if (prev.fabricThickness === "medium") return "text-[#94a3b8]";
    else if (prev.fabricThickness === "Heavyweight") return "text-[#475569]";
    else {
      return "text-[#1e293b]";
    }
  };

  const colorList = [
    { type: "Excellent", name: "Xuất sắc" },
    { type: "Good", name: "Tốt" },
    { type: "Fair", name: "Trung bình" },
    { type: "Poor", name: "Kém" },
    { type: "Very poor", name: "Rất kém" },
  ];

  const colorColor = (prev) => {
    if (prev.colorfastness === "Excellent") return "text-[#16a34a]";
    else if (prev.colorfastness === "Good") return "text-[#3b82f6]";
    else if (prev.colorfastness === "Fair") return "text-[#a3a3a3]";
    else if (prev.colorfastness === "Poor") return "text-[#f97316]";
    else {
      return "text-[#text-[#dc2626]]";
    }
  };

  const wrinkleList = [
    { type: "Free", name: "Không nhăn" },
    { type: "Easy Care", name: "Chống nhăn tốt" },
    { type: "Resistant", name: "Chống nhăn trung bình" },
    { type: "Crease-Prone", name: "Dễ nhăn" },
    { type: "High-Crease", name: "Rất dễ nhăn" },
  ];

  const wrinkleColor = (prev) => {
    if (prev.wrinkleResistance === "Free") return "text-[#16a34a]";
    else if (prev.wrinkleResistance === "Easy Care") return "text-[#3b82f6]";
    else if (prev.wrinkleResistance === "Resistant") return "text-[#a3a3a3]";
    else if (prev.wrinkleResistance === "Crease-Prone") return "text-[#f97316]";
    else {
      return "text-[#text-[#dc2626]]";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-[#f472b6] hover:text-[#fa8dc6]">
          <ReceiptText size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] !max-w-none w-fit  h-auto max-h-fit rounded-[12px] border-none  text-white p-[25px] ">
        <DialogHeader>
          <DialogTitle>
            <span className="text-[#f472b6] font-bold text-[24px]">
              {" "}
              {item.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col text-left">
              {" "}
              <div className="flex flex-row gap-[8px] items-center whitespace-nowrap">
                <Info
                  onClick={() => setShowInfo((prev) => !prev)}
                  size={14}
                  className="info ml-[8px] mt-[2px] cursor-pointer hover:text-[#f472b6] outline-none"
                />{" "}
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={
                    showInfo
                      ? {
                          x: 0,
                          opacity: 1,
                        }
                      : {
                          x: -10,
                          opacity: 0,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 12,
                  }}
                  className={`text-textpri ${
                    showInfo ? "" : "pointer-events-none"
                  }`}
                >
                  <div className="flex flex-row gap-[15px] items-center">
                    {item.description} <div>•</div>
                    <span className="text-[#f472b6]">Hướng dẫn giặt:</span>{" "}
                    {item.washInstruction ? item.washInstruction : "—"}
                  </div>
                </motion.span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <>
          <div className="flex flex-row gap-[25px]">
            <div className="flex flex-col gap-[25px]">
              <div className="w-[270px] h-[270px] border-[1px] border-[#f472b6] rounded-[12px]">
                <img
                  src={cadivi}
                  alt="day-dien-2x2.5-cadivi"
                  className="w-[270px] h-[270px] rounded-[12px] "
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 90, damping: 12 }}
              className="flex flex-col gap-[25px] whitespace-nowrap"
            >
              <ul className="flex flex-col gap-[10px] ">
                <div className="flex flex-row gap-[25px]">
                  <div className="bg-[#111111] w-[300px] p-5 rounded-[12px] border border-gray-400">
                    <h2 className="text-[18px] font-semibold mb-3">
                      Thông tin chung
                    </h2>
                    <div className="flex flex-col gap-[10px] text-[14px] border-t border-gray-400">
                      <li className="mt-3">
                        <span className="text-[#60A5FA] font-semibold">
                          Mã vật tư:
                        </span>{" "}
                        {item.materialID}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Số lượng:
                        </span>{" "}
                        {item.quantity} {item.unit}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Thêm bởi:
                        </span>{" "}
                        {item.createdBy ? item.createdBy.fullName : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Email:
                        </span>{" "}
                        {item.createdBy ? item.createdBy.email : "—"}
                      </li>
                      <li
                        className={`${
                          item.breathability
                            ? `${breathColor(item)}`
                            : "text-textpri"
                        }`}
                      >
                        <span className={`text-[#60A5FA] font-semibold `}>
                          Độ thoáng khí:
                        </span>{" "}
                        {item.breathability
                          ? `${
                              breathList.find(
                                (prev) => prev.type === item.breathability
                              )?.name
                            }`
                          : "—"}
                      </li>
                      <li
                        className={`${
                          item.fabricThickness
                            ? `${fabricColor(item)}`
                            : "text-textpri"
                        }`}
                      >
                        <span className={`text-[#60A5FA] font-semibold `}>
                          Độ dày vải:
                        </span>{" "}
                        {item.fabricThickness
                          ? `${
                              fabricList.find(
                                (prev) => prev.type === item.fabricThickness
                              )?.name
                            }`
                          : "—"}
                      </li>
                    </div>
                  </div>

                  <div className="bg-[#111111] w-[300px] p-5 rounded-[12px] border border-gray-400">
                    <h2 className="text-[18px] font-semibold mb-3">
                      Thông số kỹ thuật
                    </h2>
                    <div className="flex flex-col gap-[10px] text-[14px] border-t border-gray-400">
                      <li className="mt-3">
                        <span className="text-[#60A5FA] font-semibold">
                          Kích cỡ:
                        </span>{" "}
                        {item.size ? `${item.size}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Họa tiết / hoa văn:
                        </span>{" "}
                        {item.pattern ? `${item.pattern}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ co giãn:
                        </span>{" "}
                        {item.elasticity ? `${item.elasticity}` : "—"}
                      </li>
                      <li
                        className={`${
                          item.colorfastness
                            ? `${colorColor(item)}`
                            : "text-textpri"
                        }`}
                      >
                        <span className={`text-[#60A5FA] font-semibold `}>
                          Khả năng giữ màu:
                        </span>{" "}
                        {item.colorfastness
                          ? `${
                              colorList.find(
                                (prev) => prev.type === item.colorfastness
                              )?.name
                            }`
                          : "—"}
                      </li>

                      <li
                        className={`${
                          item.wrinkleResistance
                            ? `${wrinkleColor(item)}`
                            : "text-textpri"
                        }`}
                      >
                        <span className={`text-[#60A5FA] font-semibold `}>
                          Khả năng chống nhăn:
                        </span>{" "}
                        {item.wrinkleResistance
                          ? `${
                              wrinkleList.find(
                                (prev) => prev.type === item.wrinkleResistance
                              )?.name
                            }`
                          : "—"}
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Tốc độ mũi khâu (máy khâu):
                        </span>{" "}
                        {item.SPM ? item.SPM : "—"}
                      </li>
                    </div>
                  </div>
                </div>
              </ul>
            </motion.div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default FashionDetail;
