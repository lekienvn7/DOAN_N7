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

const MechanicalDetail = ({ item }) => {
  if (!item) return null;
  const [showInfo, setShowInfo] = useState(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="cursor-pointer p-[5px] justify-center text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] hover:text-[#87f3e1]"
        >
          <ReceiptText size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] !max-w-none w-fit  h-auto max-h-fit rounded-[12px] border-none  text-white p-[25px] ">
        <DialogHeader>
          <DialogTitle>
            {" "}
            <span
              className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] font-bold text-[24px]"
            >
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
                  className="info ml-[8px] mt-[2px] cursor-pointer hover:text-[#e6eef2] outline-none"
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
              <div
                className="w-[280px] h-[280px] border-[1px] border-[#e6eef2]
[border-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] rounded-[12px]"
              >
                <img
                  src={cadivi}
                  alt="day-dien-2x2.5-cadivi"
                  className="w-[280px] h-[280px] rounded-[12px] "
                />
              </div>

              <p>
                  <span
                    className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
                  >
                    • Ghi chú:{" "}
                  </span>{" "}
                  {item.description}
                </p>
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

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ dày:
                        </span>{" "}
                        {item.thickness ? item.thickness : "—"}
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Khả năng chịu tải:
                        </span>{" "}
                        <span>
                          {item.loadCapacity ? `${item.loadCapacity} ` : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ nhẵn bề mặt:
                        </span>{" "}
                        <span>
                          {item.surfaceFinish ? `${item.surfaceFinish} ` : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ dẻo:
                        </span>{" "}
                        <span>
                          {item.ductility ? `${item.ductility} ` : "—"}
                        </span>
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
                          Kim loại:
                        </span>{" "}
                        {item.metalType ? `${item.metalType}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ cứng:
                        </span>{" "}
                        {item.hardness ? `${item.hardness}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ bền kéo:
                        </span>{" "}
                        {item.tensileStrength ? `${item.tensileStrength}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Lớp phủ:
                        </span>{" "}
                        <span>{item.coating ? `${item.coating} ` : "—"}</span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Kích thước:
                        </span>{" "}
                        <span>{item.size ? `${item.size} ` : "—"}</span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Sai số / Dung sai:
                        </span>{" "}
                        <span>
                          {item.tolerance ? `${item.tolerance} ` : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Từ tính:
                        </span>{" "}
                        <span>
                          {item.magneticProperty
                            ? `${item.magneticProperty} `
                            : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Khả năng chịu va đập:
                        </span>{" "}
                        <span>
                          {item.impactResistance
                            ? `${item.impactResistance} `
                            : "—"}
                        </span>
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

export default MechanicalDetail;
