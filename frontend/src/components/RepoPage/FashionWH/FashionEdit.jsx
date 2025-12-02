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

const FashionEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [fabricType, setFabricType] = useState(item.fabricType || "");
  const [color, setColor] = useState(item.color || "");
  const [colorType, setColorType] = useState(item.colorType || "");
  const [size, setSize] = useState(item.size || "");
  const [pattern, setPattern] = useState(item.pattern || "");
  const [elasticity, setElasticity] = useState(item.elasticity || "");
  const [origin, setOrigin] = useState(item.origin || "");
  const [washInstruction, setWashInstruction] = useState(
    item.washInstruction || ""
  );
  const [durability, setDurability] = useState(item.durability || "");
  const [breathability, setBreathability] = useState(item.breathability || "");
  const [fabricThickness, setFabricThickness] = useState(
    item.fabricThickness || ""
  );
  const [colorfastness, setColorfastness] = useState(item.colorfastness || "");
  const [wrinkleResistance, setWrinkleResistance] = useState(
    item.wrinkleResistance || ""
  );
  const [SPM, setSPM] = useState(item.SPM || "");

  const originalDescription = item.description || "";
  const originalFabricType = item.fabricType || "";
  const originalColor = item.color || "";
  const originalColorType = item.colorType || "";
  const originalSize = item.size || "";
  const originalPattern = item.pattern || "";
  const originalElasticity = item.elasticity || "";
  const originalOrigin = item.origin || "";
  const originalWashInstruction = item.washInstruction || "";
  const originalDurability = item.durability || "";
  const originalBreathability = item.breathability || "";
  const originalFabricThickness = item.fabricThickness || "";
  const originalColorfastness = item.colorfastness || "";
  const originalWrinkleResistance = item.wrinkleResistance || "";
  const originalSPM = item.SPM || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setFabricType(originalFabricType);
      setColor(originalColor);
      setColorType(originalColorType);
      setSize(originalSize);
      setPattern(originalPattern);
      setElasticity(originalElasticity);
      setOrigin(originalOrigin);
      setWashInstruction(originalWashInstruction);
      setDurability(originalDurability);
      setBreathability(originalBreathability);
      setFabricThickness(originalFabricThickness);
      setColorfastness(originalColorfastness);
      setWrinkleResistance(originalWrinkleResistance);
      setSPM(originalSPM);
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    fabricType !== originalFabricType ||
    color !== originalColor ||
    colorType !== originalColorType ||
    size !== originalSize ||
    pattern !== originalPattern ||
    elasticity !== originalElasticity ||
    origin !== originalOrigin ||
    washInstruction !== originalWashInstruction ||
    durability !== originalDurability ||
    breathability !== originalBreathability ||
    fabricThickness !== originalFabricThickness ||
    colorfastness !== originalColorfastness ||
    wrinkleResistance !== originalWrinkleResistance ||
    SPM !== originalSPM;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,
        fabricType,
        color,
        colorType,
        size,
        pattern,
        elasticity,
        origin,
        washInstruction,
        durability,
        breathability,
        fabricThickness,
        colorfastness,
        wrinkleResistance,
        SPM,
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
              <span className=" text-[#f472b6] text-[25px] font-semibold">
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
                  : "text-[#f472b6]"
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
      description == originalDescription ? "border-textsec" : "border-[#f472b6]"
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>

          <div className="flex flex-col gap-[5px] text-left">
            <p
              className={`ml-[10px] ${
                description == originalDescription
                  ? "text-textsec"
                  : "text-[#f472b6]"
              }`}
            >
              Ghi chú
            </p>
            <input
              type="text"
              placeholder="Hướng dẫn giặt..."
              value={washInstruction}
              onChange={(e) => setWashInstruction(e.target.value)}
              className={`w-[420px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                     washInstruction == originalWashInstruction
                       ? "text-textsec"
                       : "text-white"
                   }
    ${
      washInstruction == originalWashInstruction
        ? "border-textsec"
        : "border-[#f472b6]"
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>
          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Kích cỡ"
              placeholder="VD: 10m"
              recent={size}
              original={originalSize}
              value={size}
              onChange={setSize}
            />

            <InputField
              label="Họa tiết / hoa văn"
              placeholder="VD: Trơn, kẻ sọc,..."
              value={pattern}
              recent={pattern}
              original={originalPattern}
              onChange={setPattern}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Tốc độ máy khâu"
              placeholder="VD: 5000 SPM"
              value={SPM}
              recent={SPM}
              original={originalSPM}
              onChange={setSPM}
            />

            <InputField
              label="Xuất xứ"
              placeholder="VD: Việt Nam,..."
              recent={origin}
              original={originalOrigin}
              value={origin}
              onChange={setOrigin}
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
                ? "bg-[#f472b6] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#fa8dc6] transition-all duration-200"
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
        recent == original ? "text-textsec" : "text-[#f472b6]"
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
    ${recent == original ? "border-textsec" : "border-[#f472b6]"}
    `}
    />
  </div>
);

export default FashionEdit;
