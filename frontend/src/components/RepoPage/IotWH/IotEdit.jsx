import React from "react";
import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { Pen, Pencil } from "lucide-react";
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
import { toast } from "sonner";

const IotEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [sensorType, setSensorType] = useState(item.sensorType || "");
  const [cpuClock, setCpuClock] = useState(item.cpuClock || "");
  const [communicationProtocol, setCommunicationProtocol] = useState(
    item.communicationProtocol || ""
  );
  const [wirelessTech, setWirelessTech] = useState(item.wirelessTech || "");
  const [powerSupply, setPowerSupply] = useState(item.powerSupply || "");
  const [ioPins, setIoPins] = useState(item.ioPins || "");
  const [memory, setMemory] = useState(item.memory || "");
  const [operatingTemp, setOperatingTemp] = useState(item.operatingTemp || "");
  const [deviceInterface, setDeviceInterface] = useState(
    item.deviceInterface || ""
  );
  const [moduleSize, setModuleSize] = useState(item.moduleSize || "");
  const [powerConsumption, setPowerConsumption] = useState(
    item.powerConsumption || ""
  );
  const [accuracy, setAccuracy] = useState(item.accuracy || "");
  const [responseTime, setResponseTime] = useState(item.responseTime || "");

  const originalDescription = item.description || "";
  const originalSensorType = item.sensorType || "";
  const originalCpuClock = item.cpuClock || "";
  const originalCommunicationProtocol = item.communicationProtocol || "";
  const originalWirelessTech = item.wirelessTech || "";
  const originalPowerSupply = item.powerSupply || "";
  const originalIoPins = item.ioPins || "";
  const originalMemory = item.memory || "";
  const originalOperatingTemp = item.operatingTemp || "";
  const originalDeviceInterface = item.deviceInterface || "";
  const originalModuleSize = item.moduleSize || "";
  const originalPowerConsumption = item.powerConsumption || "";
  const originalAccuracy = item.accuracy || "";
  const originalResponseTime = item.responseTime || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setSensorType(item.sensorType || "");
      setCpuClock(item.cpuClock || "");
      setCommunicationProtocol(item.communicationProtocol || "");
      setWirelessTech(item.wirelessTech || "");
      setPowerSupply(item.powerSupply || "");
      setIoPins(item.ioPins || "");
      setMemory(item.memory || "");
      setOperatingTemp(item / operatingTemp || "");
      setDeviceInterface(item.deviceInterface || "");
      setModuleSize(item.moduleSize || "");
      setPowerConsumption(item.powerConsumption || "");
      setAccuracy(item.accuracy || "");
      setResponseTime(item.responseTime || "");
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    sensorType !== originalSensorType ||
    cpuClock !== originalCpuClock ||
    communicationProtocol !== originalCommunicationProtocol ||
    wirelessTech !== originalWirelessTech ||
    powerSupply !== originalPowerSupply ||
    ioPins !== originalIoPins ||
    memory !== originalMemory ||
    operatingTemp !== originalOperatingTemp ||
    deviceInterface !== originalDeviceInterface ||
    moduleSize !== originalModuleSize ||
    powerConsumption !== originalPowerConsumption ||
    accuracy !== originalAccuracy ||
    responseTime !== originalResponseTime;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,
        sensorType,
        cpuClock,
        communicationProtocol,
        wirelessTech,
        powerSupply,
        ioPins,
        memory,
        operatingTemp,
        deviceInterface,
        moduleSize,
        powerConsumption,
        accuracy,
        responseTime,
      };

      const res = await axiosClient.put(`/material/${item.materialID}`, body);

      if (res.data.success) {
        toast.success(`Đã cập nhật vật tư ${item.materialID}!`);
        setTimeout(() => onReload(), 500);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi sửa vật tư!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer p-[5px] justify-center text-red-500 hover:text-red-400">
          <Pencil size={15} />{" "}
        </button>
      </DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-[#1a1a1a] !max-w-none w-auto max-w-fit  h-auto max-h-fit rounded-[12px] border-none text-white p-[25px] "
      >
        <DialogHeader>
          <DialogTitle>Chỉnh sửa vật tư</DialogTitle>
          <DialogDescription>
            <div className="w-[420px]">
              <span className=" text-[#5eead4] text-[25px] font-semibold">
                {item.name}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[5px] text-left">
            <p
              className={`ml-[10px] ${
                description == originalDescription
                  ? "text-textsec"
                  : "text-[#5eead4]"
              }`}
            >
              Ghi chú
            </p>
            <input
              type="text"
              placeholder="Ghi chú thêm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-[420px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                     description == originalDescription
                       ? "text-textsec"
                       : "text-white"
                   }
    ${
      description == originalDescription ? "border-textsec" : "border-[#5eead4]"
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>
          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Loại cảm biến"
              placeholder="VD: Nhiệt độ, độ ẩm,..."
              recent={sensorType}
              original={originalSensorType}
              value={sensorType}
              onChange={setSensorType}
            />

            <InputField
              label="Giao thức kết nối"
              placeholder="VD: 1-Wire,..."
              value={communicationProtocol}
              recent={communicationProtocol}
              original={originalCommunicationProtocol}
              onChange={setCommunicationProtocol}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Công nghệ không dây"
              placeholder="VD: Wifi, bluetooth,..."
              value={wirelessTech}
              recent={wirelessTech}
              original={originalWirelessTech}
              onChange={setWirelessTech}
            />

            <InputField
              label="Xung nhịp CPU"
              placeholder="VD: 240 MHz,..."
              value={cpuClock}
              recent={cpuClock}
              original={originalCpuClock}
              onChange={setCpuClock}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Nguồn cấp"
              placeholder="VD: 3.6V,..."
              value={powerSupply}
              recent={powerSupply}
              original={originalPowerSupply}
              onChange={setPowerSupply}
            />

            <InputField
              label="Số chân I/O"
              placeholder="VD: 34 GPIO,..."
              value={ioPins}
              recent={ioPins}
              original={originalIoPins}
              onChange={setIoPins}
            />
          </div>
        </div>

        <DialogFooter className="mt-5 flex justify-end gap-3">
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-[12px] hover:bg-gray-600 transition-all duration-200 cursor-pointer">
              Hủy
            </button>
          </DialogClose>

          <button
            disabled={!isValid}
            onClick={() => {
              handleChange();
            }}
            className={`${
              isValid
                ? "bg-[#5eead4] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#87f3e1] transition-all duration-200"
                : "bg-gray-700 text-textsec px-4 py-2 rounded-[12px] cursor-not-allowed"
            }`}
          >
            Sửa vật tư
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  recent,
  original,
  width = "200px",
}) => (
  <div className="flex flex-col gap-[5px] items-left">
    <p
      className={`ml-[10px] ${
        recent == original ? "text-textsec" : "text-[#5eead4]"
      }`}
    >
      {label}:
    </p>
    <input
      placeholder={value ? value : "—"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-[${width}] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200  ${
                     recent == original ? "text-textsec" : "text-white"
                   }
    ${recent == original ? "border-textsec" : "border-[#5eead4]"}
    `}
    />
  </div>
);

export default IotEdit;
