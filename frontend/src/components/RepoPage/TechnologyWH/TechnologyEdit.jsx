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

const TechnologyEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [deviceType, setDeviceType] = useState(item.deviceType || "");
  const [capacity, setCapacity] = useState(item.capacity || "");
  const [speed, setSpeed] = useState(item.speed || "");
  const [brand, setBrand] = useState(item.brand || "");
  const [connectorType, setConnectorType] = useState(item.connectorType || "");
  const [powerConsumption, setPowerConsumption] = useState(
    item.powerConsumption || ""
  );
  const [protocol, setProtocol] = useState(item.protocol || "");
  const [networkInterface, setNetworkInterface] = useState(
    item.networkInterface || ""
  );
  const [operatingSystem, setOperatingSystem] = useState(
    item.operatingSystem || ""
  );
  const [durabilityRating, setDurabilityRating] = useState(
    item.durabilityRating || ""
  );
  const [formFactor, setFormFactor] = useState(item.formFactor || "");
  const [dataTransferRate, setDataTransferRate] = useState(
    item.dataTransferRate || ""
  );

  const originalDescription = item.description || "";
  const originalDeviceType = item.deviceType || "";
  const originalCapacity = item.capacity || "";
  const originalSpeed = item.speed || "";
  const originalBrand = item.brand || "";
  const originalConnectorType = item.connectorType || "";
  const originalPowerConsumption = item.powerConsumption || "";
  const originalProtocol = item.protocol || "";
  const originalNetworkInterface = item.networkInterface || "";
  const originalOperatingSystem = item.operatingSystem || "";
  const originalDurabilityRating = item.durabilityRating || "";
  const originalFormFactor = item.formFactor || "";
  const originalDataTransferRate = item.dataTransferRate || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setDeviceType(item.deviceType || "");
      setCapacity(item.capacity || "");
      setSpeed(item.speed || "");
      setBrand(item.brand || "");
      setConnectorType(item.connectorType || "");
      setPowerConsumption(item.powerConsumption || "");
      setProtocol(item.protocol || "");
      setNetworkInterface(item.networkInterface || "");
      setOperatingSystem(item.operatingSystem || "");
      setDurabilityRating(item.durabilityRating || "");
      setFormFactor(item.formFactor || "");
      setDataTransferRate(item.dataTransferRate || "");
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    deviceType !== originalDeviceType ||
    capacity !== originalCapacity ||
    speed !== originalSpeed ||
    brand !== originalBrand ||
    connectorType !== originalConnectorType ||
    powerConsumption !== originalPowerConsumption ||
    protocol !== originalProtocol ||
    networkInterface !== originalNetworkInterface ||
    operatingSystem !== originalOperatingSystem ||
    durabilityRating !== originalDurabilityRating ||
    formFactor !== originalFormFactor ||
    dataTransferRate !== originalDataTransferRate;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,

        deviceType,
        capacity,
        speed,
        brand,
        connectorType,
        powerConsumption,
        protocol,
        networkInterface,
        operatingSystem,
        durabilityRating,
        formFactor,
        dataTransferRate,
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
              <span className=" text-[#60a5fa] text-[25px] font-semibold">
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
                  : `text-[#60a5fa]`
              }`}
            >
              Ghi chú
            </p>
            <input
              type="text"
              placeholder="Ghi chú thêm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-[640px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                     description == originalDescription
                       ? "text-textsec"
                       : "text-white"
                   }
    ${
      description == originalDescription ? "border-textsec" : `border-[#60a5fa]`
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>
          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Loại thiết bị"
              placeholder="VD: Chuột, bàn phím,..."
              recent={deviceType}
              original={originalDeviceType}
              value={deviceType}
              onChange={setDeviceType}
            />

            <InputField
              label="Thương hiệu"
              placeholder="VD: Samsung, Dell,..."
              value={brand}
              recent={brand}
              original={originalBrand}
              onChange={setBrand}
            />

            <InputField
              label="Hệ điều hành hỗ trợ"
              placeholder="VD: MacOS, Linux,..."
              value={operatingSystem}
              recent={operatingSystem}
              original={originalOperatingSystem}
              onChange={setOperatingSystem}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Mức tiêu thụ điện"
              placeholder="VD: 6W,..."
              value={powerConsumption}
              recent={powerConsumption}
              original={originalPowerConsumption}
              onChange={setPowerConsumption}
            />

            <InputField
              label="Chuẩn kích thước"
              placeholder="VD: 2.5-inch SSD,..."
              value={formFactor}
              recent={formFactor}
              original={originalFormFactor}
              onChange={setFormFactor}
            />

            <InputField
              label="Độ bền"
              placeholder="VD: 600 TBW,..."
              value={durabilityRating}
              recent={durabilityRating}
              original={originalDurabilityRating}
              onChange={setDurabilityRating}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Dung lượng"
              placeholder="VD: 128GB,..."
              value={capacity}
              recent={capacity}
              original={originalCapacity}
              onChange={setCapacity}
            />

            <InputField
              label="Chuẩn kết nối"
              placeholder="VD: NVMe,..."
              value={connectorType}
              recent={connectorType}
              original={originalConnectorType}
              onChange={setConnectorType}
            />

            <InputField
              label="Tốc độ truyền dữ liệu"
              placeholder="VD: 7.5GB/s,..."
              value={dataTransferRate}
              recent={dataTransferRate}
              original={originalDataTransferRate}
              onChange={setDataTransferRate}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Giao thức hỗ trợ"
              placeholder="VD: NVMe 1.4,..."
              value={protocol}
              recent={protocol}
              original={originalProtocol}
              onChange={setProtocol}
            />

            <InputField
              label="Giao diện mạng"
              placeholder="VD: Wifi 6,..."
              value={networkInterface}
              recent={networkInterface}
              original={originalNetworkInterface}
              onChange={setNetworkInterface}
            />

            <InputField
              label="Tốc độ"
              placeholder="VD: 3200MHz,..."
              value={speed}
              recent={speed}
              original={originalSpeed}
              onChange={setSpeed}
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
                ? "bg-[#60a5fa] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#3184f3] transition-all duration-200"
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
        recent == original ? "text-textsec" : `text-[#60a5fa]`
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
    ${recent == original ? "border-textsec" : `border-[#60a5fa]`}
    `}
    />
  </div>
);

export default TechnologyEdit;
