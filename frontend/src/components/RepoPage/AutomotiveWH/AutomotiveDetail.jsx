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

const AutomotiveDetail = ({ item }) => {
  if (!item) return null;
  const [showInfo, setShowInfo] = useState(null);

  const tempList = [
    { type: "Low", name: "Mức thấp (0°C → 70°C)" },
    { type: "Medium", name: "Mức trung bình (-20°C → 120°C)" },
    { type: "High", name: "Mức cao (-40°C → 180°C)" },
    { type: "Extreme", name: "Mức rất cao (-50°C → 300°C)" },
    { type: "Ultra", name: "Mức siêu cao (500°C → 800°C)" },
  ];

  const tempColor = (item) => {
    if (item.heatResistance === "Low") {
      return "text-[#22c55e]";
    } else if (item.heatResistance === "Medium") {
      return "text-[#eab308]";
    } else if (item.heatResistance === "High") {
      return "text-[#fb923c]";
    } else if (item.heatResistance === "Extreme") {
      return "text-[#f97316]";
    } else {
      return "text-[#ef4444]";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-[#fb923c] hover:text-[#fca86b]">
          <ReceiptText size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] !max-w-none w-fit  h-auto max-h-fit rounded-[12px] border-none  text-white p-[25px] ">
        <DialogHeader>
          <DialogTitle>
            {" "}
            <span className="text-[#fb923c] font-bold text-[24px]">
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
                  className="info ml-[8px] mt-[2px] cursor-pointer hover:text-[#fb923c] outline-none"
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
                  {item.description}
                </motion.span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <>
          <div className="flex flex-row gap-[25px]">
            <div className="flex flex-col gap-[25px]">
              <div className="w-[250px] h-[250px] border-[1px] border-[#fb923c] rounded-[12px]">
                <img
                  src={cadivi}
                  alt="day-dien-2x2.5-cadivi"
                  className="w-[250px] h-[250px] rounded-[12px] "
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
                  <div className="bg-[#111111] w-[350px] p-5 rounded-[12px] border border-gray-400">
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
                    </div>
                  </div>

                  <div className="bg-[#111111] w-[350px] p-5 rounded-[12px] border border-gray-400">
                    <h2 className="text-[18px] font-semibold mb-3">
                      Thông số kỹ thuật
                    </h2>
                    <div className="flex flex-col gap-[10px] text-[14px] border-t border-gray-400">
                      <li className={`mt-3 ${tempColor(item)}`}>
                        <span className="text-[#60A5FA] font-semibold">
                          Mức chịu nhiệt:
                        </span>{" "}
                        {item.heatResistance
                          ? `${
                              tempList.find(
                                (prev) => prev.type === item.heatResistance
                              )?.name
                            }`
                          : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Chất liệu:
                        </span>{" "}
                        {item.material ? `${item.material}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Tiêu chuẩn chất lỏng:
                        </span>{" "}
                        {item.fluidSpec ? `${item.fluidSpec}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Tuổi thọ linh kiện:
                        </span>{" "}
                        <span>{item.lifespan ? `${item.lifespan}` : "—"}</span>
                      </li>
                    </div>
                  </div>
                </div>
              </ul>
              <p className="ml-[10px] text-textsec font-inter text-left ">
                • <span className="text-[#fb923c]">Dòng xe tương thích:</span>{" "}
                {item.compatibility ? item.compatibility : "—"}
              </p>
            </motion.div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default AutomotiveDetail;
