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

const TelecomEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [signalType, setSignalType] = useState(item.signalType || "");
  const [frequency, setFrequency] = useState(item.frequency || "");
  const [bandwidth, setBandwidth] = useState(item.bandwidth || "");
  const [connectorType, setConnectorType] = useState(item.connectorType || "");
  const [cableType, setCableType] = useState(item.cableType || "");
  const [transmissionRate, setTransmissionRate] = useState(
    item.transmissionRate || ""
  );
  const [range, setRange] = useState(item.range || "");
  const [impedance, setImpedance] = useState(item.impedance || "");
  const [modulationType, setModulationType] = useState(
    item.modulationType || ""
  );
  const [attenuation, setAttenuation] = useState(item.attenuation || "");
  const [polarization, setPolarization] = useState(item.polarization || "");
  const [noiseFigure, setNoiseFigure] = useState(item.noiseFigure || "");

  const originalDescription = item.description || "";
  const originalSignalType = item.signalType || "";
  const originalFrequency = item.frequency || "";
  const originalBandwidth = item.bandwidth || "";
  const originalConnectorType = item.connectorType || "";
  const originalCableType = item.cableType || "";
  const originalTransmissionRate = item.transmissionRate || "";
  const originalRange = item.range || "";
  const originalImpedance = item.impedance || "";
  const originalModulationType = item.modulationType || "";
  const originalAttenuation = item.attenuation || "";
  const originalPolarization = item.polarization || "";
  const originalNoiseFigure = item.noiseFigure || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setSignalType(item.signalType || "");
      setFrequency(item.frequency || "");
      setBandwidth(item.bandwidth || "");
      setConnectorType(item.connectorType || "");
      setCableType(item.cableType || "");
      setTransmissionRate(item.transmissionRate || "");
      setRange(item.range || "");
      setImpedance(item.impedance || "");
      setModulationType(item.modulationType || "");
      setAttenuation(item.attenuation || "");
      setPolarization(item.polarization || "");
      setNoiseFigure(item.noiseFigure || "");
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    signalType !== originalSignalType ||
    frequency !== originalFrequency ||
    bandwidth !== originalBandwidth ||
    connectorType !== originalConnectorType ||
    cableType !== originalCableType ||
    transmissionRate !== originalTransmissionRate ||
    range !== originalRange ||
    impedance !== originalImpedance ||
    modulationType !== originalModulationType ||
    attenuation !== originalAttenuation ||
    polarization !== originalPolarization ||
    noiseFigure !== originalNoiseFigure;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,

        signalType,
        frequency,
        bandwidth,
        connectorType,
        cableType,
        transmissionRate,
        range,
        impedance,
        modulationType,
        attenuation,
        polarization,
        noiseFigure,
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
              <span className=" text-[#ff3434] text-[25px] font-semibold">
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
                  : `text-[#ff3434]`
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
      description == originalDescription ? "border-textsec" : `border-[#ff3434]`
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>
          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Tần số"
              placeholder="VD: 2.4 GHz,..."
              recent={frequency}
              original={originalFrequency}
              value={frequency}
              onChange={setFrequency}
            />

            <InputField
              label="Loại tín hiệu"
              placeholder="VD: Digital,..."
              value={signalType}
              recent={signalType}
              original={originalSignalType}
              onChange={setSignalType}
            />

            <InputField
              label="Băng thông"
              placeholder="VD: 	20–40 MHz,..."
              value={bandwidth}
              recent={bandwidth}
              original={originalBandwidth}
              onChange={setBandwidth}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Loại đầu nối"
              placeholder="VD: SMA, RJ45,..."
              value={connectorType}
              recent={connectorType}
              original={originalConnectorType}
              onChange={setConnectorType}
            />

            <InputField
              label="Phân cực sóng"
              placeholder="VD: 2.5-inch SSD,..."
              value={polarization}
              recent={polarization}
              original={originalPolarization}
              onChange={setPolarization}
            />

            <InputField
              label="Loại cáp"
              placeholder="VD: Coaxial RG-6,..."
              value={cableType}
              recent={cableType}
              original={originalCableType}
              onChange={setCableType}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Tốc độ truyền tải"
              placeholder="VD: 100 Mbps,..."
              value={transmissionRate}
              recent={transmissionRate}
              original={originalTransmissionRate}
              onChange={setTransmissionRate}
            />

            <InputField
              label="Tầm hoạt động"
              placeholder="VD: 30m, 5km,..."
              value={range}
              recent={range}
              original={originalRange}
              onChange={setRange}
            />

            <InputField
              label="Trở kháng"
              placeholder="VD: 50Ω,..."
              value={impedance}
              recent={impedance}
              original={originalImpedance}
              onChange={setImpedance}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Kiểu điều chế"
              placeholder="VD: QAM,..."
              value={modulationType}
              recent={modulationType}
              original={originalModulationType}
              onChange={setModulationType}
            />

            <InputField
              label="Suy hao"
              placeholder="VD: 6 dB/100m,..."
              value={attenuation}
              recent={attenuation}
              original={originalAttenuation}
              onChange={setAttenuation}
            />

            <InputField
              label="Hệ số nhiễu"
              placeholder="VD: 3200MHz,..."
              value={noiseFigure}
              recent={noiseFigure}
              original={originalNoiseFigure}
              onChange={setNoiseFigure}
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
                ? "bg-[#ff3434] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#e02626] transition-all duration-200"
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
        recent == original ? "text-textsec" : `text-[#ff3434]`
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
    ${recent == original ? "border-textsec" : `border-[#ff3434]`}
    `}
    />
  </div>
);

export default TelecomEdit;
