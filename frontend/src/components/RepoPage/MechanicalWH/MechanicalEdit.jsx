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

const MechanicalEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [metalType, setMetalType] = useState(item.metalType || "");
  const [hardness, setHardness] = useState(item.hardness || "");
  const [tensileStrength, setTensileStrength] = useState(
    item.tensileStrength || ""
  );
  const [weight, setWeight] = useState(item.weight || "");
  const [coating, setCoating] = useState(item.coating || "");
  const [thickness, setThickness] = useState(item.thickness || "");
  const [size, setSize] = useState(item.size || "");
  const [tolerance, setTolerance] = useState(item.tolerance || "");
  const [loadCapacity, setLoadCapacity] = useState(item.loadCapacity || "");
  const [heatResistance, setHeatResistance] = useState(
    item.heatResistance || ""
  );
  const [corrosionResistance, setCorrosionResistance] = useState(
    item.corrosionResistance || ""
  );

  const originalDescription = item.description || "";
  const originalMetalType = item.metalType || "";
  const originalHardness = item.hardness || "";
  const originalTensileStrength = item.tensileStrength || "";
  const originalWeight = item.weight || "";
  const originalCoating = item.coating || "";
  const originalThickness = item.thickness || "";
  const originalSize = item.size || "";
  const originalTolerance = item.tolerance || "";
  const originalLoadCapacity = item.loadCapacity || "";
  const originalHeatResistance = item.heatResistance || "";
  const originalCorrosionResistance = item.corrosionResistance || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setMetalType(item.metalType || "");
      setHardness(item.hardness || "");
      setTensileStrength(item.tensileStrength || "");
      setWeight(item.weight || "");
      setCoating(item.coating || "");
      setThickness(item.thickness || "");
      setSize(item.size || "");
      setTolerance(item.tolerance || "");
      setLoadCapacity(item.loadCapacity || "");
      setHeatResistance(item.heatResistance || "");
      setCorrosionResistance(item.corrosionResistance || "");
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    metalType !== originalMetalType ||
    hardness !== originalHardness ||
    tensileStrength !== originalTensileStrength ||
    weight !== originalWeight ||
    coating !== originalCoating ||
    thickness !== originalThickness ||
    size !== originalSize ||
    tolerance !== originalTolerance ||
    loadCapacity !== originalLoadCapacity ||
    heatResistance !== originalHeatResistance ||
    corrosionResistance !== originalCorrosionResistance;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,

        metalType,
        hardness,
        tensileStrength,
        weight,
        coating,
        thickness,
        size,
        tolerance,
        loadCapacity,
        heatResistance,
        corrosionResistance,
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
              <span
                className=" text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] text-[25px] font-semibold"
              >
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
                  : `text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]`
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
      description == originalDescription ? "border-textsec" : `border-[#e6eef2]
[border-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]`
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>
          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Trọng lượng"
              placeholder="VD: Nhiệt độ, độ ẩm,..."
              recent={weight}
              original={originalWeight}
              value={weight}
              onChange={setWeight}
            />

            <InputField
              label="Độ dày"
              placeholder="VD: 3 mm,..."
              value={thickness}
              recent={thickness}
              original={originalThickness}
              onChange={setThickness}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Kim loại"
              placeholder="VD: Đồng, Sắt,..."
              value={metalType}
              recent={metalType}
              original={originalMetalType}
              onChange={setMetalType}
            />

            <InputField
              label="Lớp phủ"
              placeholder="VD: Nhiệt luyện,..."
              value={coating}
              recent={coating}
              original={originalCoating}
              onChange={setCoating}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Kích thước"
              placeholder="VD: 3m,..."
              value={size}
              recent={size}
              original={originalSize}
              onChange={setSize}
            />

            <InputField
              label="Sai số / Dung sai"
              placeholder="VD: ±0.01 mm,..."
              value={tolerance}
              recent={tolerance}
              original={originalTolerance}
              onChange={setTolerance}
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
                ? "bg-[#e6eef2] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#aaaaaa] transition-all duration-200"
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
        recent == original ? "text-textsec" : `text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]`
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
    ${recent == original ? "border-textsec" : `border-[#e6eef2]
[border-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]`}
    `}
    />
  </div>
);

export default MechanicalEdit;
