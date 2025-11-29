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

const ElectricEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [voltageRange, setVoltageRange] = useState(item.voltageRange || "");
  const [power, setPower] = useState(item.power || "");
  const [materialInsulation, setMaterialInsulation] = useState(
    item.materialInsulation || ""
  );
  const [current, setCurrent] = useState(item.current || "");
  const [frequency, setFrequency] = useState(item.frequency || "");
  const [resistance, setResistance] = useState(item.resistance || "");
  const [phaseType, setPhaseType] = useState(item.phaseType || "");
  const [conductorMaterial, setConductorMaterial] = useState(
    item.conductorMaterial || ""
  );
  const [insulationMaterial, setInsulationMaterial] = useState(
    item.insulationMaterial || ""
  );
  const [fireResistance, setFireResistance] = useState(
    item.fireResistance || ""
  );
  const [cableDiameter, setCableDiameter] = useState(item.cableDiameter || "");
  const [waterproofLevel, setWaterproofLevel] = useState(
    item.waterproofLevel || ""
  );
  const [operatingTemp, setOperatingTemp] = useState(item.operatingTemp || "");

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setVoltageRange(item.voltageRange || "");
      setPower(item.power || "");
      setMaterialInsulation(item.materialInsulation || "");
      setCurrent(item.current || "");
      setFrequency(item.frequency || "");
      setResistance(item.resistance || "");
      setPhaseType(item.phaseType || "");
      setConductorMaterial(item.conductorMaterial || "");
      setInsulationMaterial(item.insulationMaterial || "");
      setFireResistance(item.fireResistance || "");
      setCableDiameter(item.cableDiameter || "");
      setWaterproofLevel(item.waterproofLevel || "");
      setOperatingTemp(item.operatingTemp || "");
    }
  }, [item]);

  const isValid = item && item.materialID;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,
        voltageRange,
        power,
        materialInsulation,
        current,
        frequency,
        resistance,
        phaseType,
        conductorMaterial,
        insulationMaterial,
        fireResistance,
        cableDiameter,
        waterproofLevel,
        operatingTemp,
      };

      const res = await axiosClient.put(`/material/${item.materialID}`, body);

      if (res.data.success) {
        toast.success("Đã cập nhật vật tư!");
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

      <DialogContent className="bg-[#1a1a1a] !max-w-none w-auto max-w-fit  h-auto max-h-fit rounded-[12px] border-none whitespace-nowrap text-white p-[25px] ">
        <DialogHeader>
          <DialogTitle>
            Chỉnh sửa vật tư <span className="text-[#fdd700]">{item.name}</span>{" "}
            {"-"}{" "}
            {item.updatedBy
              ? `Đã chỉnh sửa bởi ${item.updatedBy.fullName}`
              : "Chưa chỉnh sửa"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[5px] text-left">
            <p className="ml-[10px]">Ghi chú</p>
            <input
              type="text"
              placeholder="Ghi chú thêm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-[420px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>
          <div className="flex flex-row gap-[20px]">
            <InputField
              label="Công suất định mức"
              placeholder="VD: 10W"
              value={power}
              onChange={setPower}
            />

            <InputField
            label="Công suất định mức"
            placeholder="VD: 10W"
            value={power}
            onChange={setPower}
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
            className="bg-[#ffd700] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#faa900] transition-all duration-200"
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
  width = "200px",
}) => (
  <div className="flex flex-col gap-[5px] items-left">
    <p className="ml-[10px]">{label}:</p>
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-[${width}] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200`}
    />
  </div>
);

export default ElectricEdit;
