import React from "react";
import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog";
import { toast } from "sonner";

const AddElectric = () => {
  const [materialName, setMaterialName] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");
  const [type, setType] = useState("");
  const [statusMaterial, setStatusMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [voltageRange, setVoltageRange] = useState("");
  const [power, setPower] = useState("");
  const [materialInsulation, setMaterialInsulation] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axiosClient.post("/material", {
        materialName: materialName,
        maintenanceCycle: maintenanceCycle,
        type: type,
        statusMaterial: statusMaterial,
        quantity: quantity,
        unit: unit,
        description: description,
        createdBy: createdBy,
        voltageRange: voltageRange,
        power: power,
        materialInsulation: materialInsulation,
      });

      if (res.data.success) {
        toast.success("Thêm vật tư thành công!");

        setMaterialName("");
        setMaintenanceCycle("");
        setType("");
        setStatusMaterial("");
        setQuantity("");
        setUnit("");
        setDescription("");
        setCreatedBy("");
        setVoltageRange("");
        setPower("");
        setMaterialInsulation("");

        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error("Thêm vật tư thất bại!");
      }
    } catch (error) {
      console.error("Lỗi thêm vật tư!", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col  gap-[20px] justify-center text-textpri">
        <div className="flex flex-row gap-[10px] items-center">
          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Tên vật tư:</p>
            <input
              type="text"
              placeholder="Tên vật tư"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Hạn bảo trì:</p>
            <input
              type="number"
              placeholder="Hạn bảo trì"
              value={maintenanceCycle}
              onChange={(e) => setMaintenanceCycle(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Số lượng:</p>
            <input
              type="number"
              placeholder="Số lượng"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-row gap-[10px] items-center">
          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Đơn vị:</p>
            <input
              type="text"
              placeholder="Đơn vị"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Mô tả (nếu có):</p>
            <input
              type="text"
              placeholder="Mô tả tổng quát"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-[310px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-row gap-[10px] items-center">
          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Điện áp (V):</p>
            <input
              type="number"
              placeholder="Điện áp"
              value={voltageRange}
              onChange={(e) => setVoltageRange(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Công suất (W):</p>
            <input
              type="number"
              placeholder="Công suất định mức"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Cách điện không?:</p>
            <select
              value={materialInsulation}
              onChange={(e) => setMaterialInsulation(e.target.value)}
              className="w-[150px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             placeholder:text-gray-400 transition-all duration-200"
            >
              <option value="">-- Cách điện? --</option>
              <option value="Cách điện">Có</option>
              <option value="Dẫn điện">Không</option>
            </select>
          </div>
        </div>
      </div>
      <DialogFooter className="mt-3 flex justify-end gap-3">
        <DialogClose asChild>
          <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
            Hủy
          </button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default AddElectric;
