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

const ChemicalDetail = ({ item }) => {
  if (!item) return null;

  const tempList = [
    { type: "Room Temperature", name: "Nhiệt độ phòng (15°C – 25°C)" },
    { type: "Cool", name: "Mát (8°C – 15°C)" },
    { type: "Refrigerated", name: "Lạnh (2°C – 8°C)" },
    { type: "Frozen", name: "Đông lạnh (–10°C đến –20°C)" },
    { type: "Deep Freezing", name: "Siêu lạnh (–70°C đến –80°C)" },
    { type: "Cryogenic", name: "Nitơ lỏng (≈ –196°C)" },
  ];

  const tempColor = (prev) => {
    if (prev.storageTemperature === "Room Temperature") return "text-[#facc15]";
    if (prev.storageTemperature === "Cool") return "text-[#38bdf8]";
    if (prev.storageTemperature === "Refrigerated") return "text-[#0ea5e9]";
    if (prev.storageTemperature === "Frozen") return "text-[#0a84ff]";
    if (prev.storageTemperature === "Deep Freezing") return "text-[#1e40af]";
    if (prev.storageTemperature === "Cryogenic") return "text-[#0f172a]";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-[#c7a7ff] hover:text-[#e8d6ff]">
          <ReceiptText size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] !max-w-none w-fit  h-auto max-h-fit rounded-[12px] border-none  text-white p-[25px] ">
        <>
          <div className="flex flex-row gap-[25px]">
            <div className="flex flex-col gap-[25px]">
              <div className="w-[250px] h-[250px] border-[1px] border-[#c7a7ff] rounded-[12px]">
                <img
                  src={cadivi}
                  alt="day-dien-2x2.5-cadivi"
                  className="w-[250px] h-[250px] rounded-[12px] "
                />
              </div>
              <p className="ml-[10px] text-textsec font-inter text-left ">
                • {item.safetyNote ? item.safetyNote : "—"}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 90, damping: 12 }}
              className="flex flex-col gap-[25px] whitespace-nowrap"
            >
              <div className="flex flex-col text-left">
                <span className="text-[#c7a7ff] font-bold text-[24px]">
                  {" "}
                  {item.name}
                </span>
                <p className="text-textsec">
                  • {item.description ? item.description : "—"}
                </p>
              </div>
              <ul className="flex flex-col gap-[10px] ">
                <div className="flex flex-row gap-[25px]">
                  <div className="bg-[#111111] p-5 rounded-[12px] border border-gray-400">
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
                          Công thức hóa học:
                        </span>{" "}
                        <span>
                          {item.chemicalFormula ? item.chemicalFormula : "—"}
                        </span>
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Nồng độ:
                        </span>{" "}
                        {item.concentration ? `${item.concentration} %` : "—"}
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

                  <div className="bg-[#111111] p-5 rounded-[12px] border border-gray-400">
                    <h2 className="text-[18px] font-semibold mb-3">
                      Thông số kỹ thuật
                    </h2>
                    <div className="flex flex-col gap-[10px] text-[14px] border-t border-gray-400">
                      <li className="mt-3">
                        <span className="text-[#60A5FA] font-semibold">
                          Điểm nóng chảy / đông đặc:
                        </span>{" "}
                        {item.meltingPoint ? `${item.meltingPoint} °C` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Điểm sôi:
                        </span>{" "}
                        {item.boilingPoint ? `${item.boilingPoint} °C` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Khối lượng mol:
                        </span>{" "}
                        {item.molarMass ? `${item.molarMass} g/mol` : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Độ PH:
                        </span>{" "}
                        {item.phLevel ? item.phLevel : "—"}
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Nhiệt độ bảo quản:
                        </span>{" "}
                        <span
                          className={`${
                            item.storageTemperature
                              ? `${tempColor(item)}`
                              : "text-textpri"
                          }`}
                        >
                          {item.storageTemperature
                            ? `${
                                tempList.find(
                                  (prev) =>
                                    prev.type === item.storageTemperature
                                )?.name
                              } °C`
                            : "—"}
                        </span>
                      </li>
                      <li>
                        <span className="text-[#60A5FA] font-semibold">
                          Số CAS:
                        </span>{" "}
                        {item.casNumber ? item.casNumber : "—"}
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

export default ChemicalDetail;
