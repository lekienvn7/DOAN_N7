import React from "react";
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
import { ReceiptText } from "lucide-react";
import cadivi from "@/assets/images/cadivi225.png";

const ElectricDetail = ({ item }) => {
  if (!item) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-[#ffd700] hover:text-[#ffb700]">
          <ReceiptText size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] !max-w-none w-[1000px]  h-auto max-h-fit rounded-[12px] border-none whitespace-nowrap text-white p-[25px] ">
        <>
          <DialogHeader>
            <DialogTitle>
              Chi tiết vật tư
              <span className="text-[#ffd700]"> {item.name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {item.description?.length > 0 ? item.description : "—"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-[25px]">
            <div className="border-[1px] border-[#fdd700] rounded-[12px]">
              <img
                src={cadivi}
                alt="day-dien-2x2.5-cadivi"
                className="w-[250px] h-[250px] rounded-[12px] "
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              <ul className="flex flex-col gap-[10px] ">
                <div className="flex flex-row gap-[25px]">
                  <div className="flex flex-col gap-[10px]">
                    <li>
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
                        Chu kỳ bảo trì:
                      </span>{" "}
                      {item.maintenanceCycle == 0
                        ? "—"
                        : `${item.maintenanceCycle} tháng`}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Thêm bởi:
                      </span>{" "}
                      {item.createdBy.fullName} {"-"} {item.createdBy.email}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Cách điện:
                      </span>{" "}
                      <span>
                        {item.materialInsulation
                          ? item.materialInsulation === "Cách điện"
                            ? "Có"
                            : "Không"
                          : "—"}
                      </span>
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Tần số:
                      </span>{" "}
                      {item.frequency ? `${item.frequency}Hz` : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Điện trở:
                      </span>{" "}
                      {item.resistance ? `${item.resistance}Ω` : "—"}
                    </li>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Loại pha điện:
                      </span>{" "}
                      {item.phaseType ? item.phaseType : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Vật liệu lõi:
                      </span>{" "}
                      {item.conductorMaterial ? item.conductorMaterial : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Lớp bọc ngoài:
                      </span>{" "}
                      {item.insulationMaterial ? item.insulationMaterial : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Khả năng chịu lửa:
                      </span>{" "}
                      {item.fireResistance ? item.fireResistance : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Đường kính dây:
                      </span>{" "}
                      {item.cableDiameter ? `${item.cableDiameter} mm²` : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Mức độ bảo vệ:
                      </span>{" "}
                      {item.waterproofLevel ? item.waterproofLevel : "—"}
                    </li>
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Nhiệt độ hoạt động:
                      </span>{" "}
                      {item.operatingTemp ? item.operatingTemp : "—"}
                    </li>
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

export default ElectricDetail;
