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

const TelecomDetail = ({ item }) => {
  if (!item) return null;
  const [showInfo, setShowInfo] = useState(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-[#ff3434] hover:text-[#e02626]">
          <ReceiptText size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] !max-w-none w-fit  h-auto max-h-fit rounded-[12px] border-none  text-white p-[25px] ">
        <DialogHeader>
          <DialogTitle>
            {" "}
            <span className="text-[#ff3434] font-bold text-[24px]">
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
                  className="info ml-[8px] mt-[2px] cursor-pointer hover:text-[#ff3434] outline-none"
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
              <div className="w-[300px] h-[300px] border-[1px] border-[#ff3434] rounded-[12px]">
                <img
                  src={cadivi}
                  alt="day-dien-2x2.5-cadivi"
                  className="w-[300px] h-[300px] rounded-[12px] "
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
                        <span className="text-[#60a5fa] font-semibold">
                          Mã vật tư:
                        </span>{" "}
                        {item.materialID}
                      </li>
                      <li>
                        <span className="text-[#60a5fa] font-semibold">
                          Số lượng:
                        </span>{" "}
                        {item.quantity} {item.unit}
                      </li>
                      <li>
                        <span className="text-[#60a5fa] font-semibold">
                          Thêm bởi:
                        </span>{" "}
                        {item.createdBy ? item.createdBy.fullName : "—"}
                      </li>
                      <li>
                        <span className="text-[#60a5fa] font-semibold">
                          Email:
                        </span>{" "}
                        {item.createdBy ? item.createdBy.email : "—"}
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Hạn bảo trì:
                        </span>{" "}
                        <span>
                          {item.maintenanceCycle
                            ? `${item.maintenanceCycle} tháng`
                            : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Loại đầu nối:
                        </span>{" "}
                        <span>
                          {item.connectorType ? `${item.connectorType} ` : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Phân cực sóng:
                        </span>{" "}
                        <span>
                          {item.polarization ? `${item.polarization}` : "—"}
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
                        <span className="text-[#60a5fa] font-semibold">
                          Loại cáp:
                        </span>{" "}
                        {item.cableType ? `${item.cableType}` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60a5fa] font-semibold">
                          Tốc độ truyền tải:
                        </span>{" "}
                        {item.transmissionRate
                          ? `${item.transmissionRate}`
                          : "—"}
                      </li>
                      <li>
                        <span className="text-[#60a5fa] font-semibold">
                          Tầm hoạt động:
                        </span>{" "}
                        {item.range ? `${item.range} ` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Trở kháng:
                        </span>{" "}
                        <span>
                          {item.impedance ? `${item.impedance} Ω` : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Kiểu điều chế:
                        </span>{" "}
                        <span>
                          {item.modulationType
                            ? `${item.modulationType} `
                            : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Suy hao:
                        </span>{" "}
                        <span>
                          {item.attenuation ? `${item.attenuation} ` : "—"}
                        </span>
                      </li>

                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Hệ số nhiễu:
                        </span>{" "}
                        <span>
                          {item.noiseFigure ? `${item.noiseFigure} ` : "—"}
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

export default TelecomDetail;
