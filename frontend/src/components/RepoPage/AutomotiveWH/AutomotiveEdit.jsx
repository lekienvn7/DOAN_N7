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

const AutomotiveEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [partType, setPartType] = useState(item.partType || "");
  const [vehicleModel, setVehicleModel] = useState(item.vehicleModel || "");
  const [manufacturer, setManufacturer] = useState(item.manufacturer || "");
  const [compatibility, setCompatibility] = useState(item.compatibility || "");
  const [lifespan, setLifespan] = useState(item.lifespan || "");
  const [material, setMaterial] = useState(item.material || "");
  const [heatResistance, setHeatResistance] = useState(
    item.heatResistance || ""
  );
  const [fluidSpec, setFluidSpec] = useState(item.fluidSpec || "");

  const originalDescription = item.description || "";
  const originalPartType = item.partType || "";
  const originalVehicleModel = item.vehicleModel || "";
  const originalManufacturer = item.manufacturer || "";
  const originalCompatibility = item.compatibility || "";
  const originalLifespan = item.lifespan || "";
  const originalMaterial = item.material || "";
  const originalHeatResistance = item.heatResistance || "";
  const originalFluidSpec = item.fluidSpec || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setPartType(originalPartType);
      setVehicleModel(originalVehicleModel);
      setManufacturer(originalManufacturer);
      setCompatibility(originalCompatibility);
      setLifespan(originalLifespan);
      setMaterial(originalMaterial);
      setHeatResistance(originalHeatResistance);
      setFluidSpec(originalFluidSpec);
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    partType !== originalPartType ||
    vehicleModel !== originalVehicleModel ||
    manufacturer !== originalManufacturer ||
    compatibility !== originalCompatibility ||
    lifespan !== originalLifespan ||
    material !== originalMaterial ||
    heatResistance !== originalHeatResistance ||
    fluidSpec !== originalFluidSpec;

  const disabled = item.partType !== "Fluids";

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,
        partType,
        vehicleModel,
        manufacturer,
        compatibility,
        lifespan,
        material,
        heatResistance,
        fluidSpec,
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
              <span className="text-[#fb923c] text-[25px] font-semibold">
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
                  : "text-[#fb923c]"
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
      description == originalDescription ? "border-textsec" : "border-[#fb923c]"
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>

          <div className="flex flex-col gap-[5px] text-left">
            <p
              className={`ml-[10px] ${
                compatibility == originalCompatibility
                  ? "text-textsec"
                  : "text-[#fb923c]"
              }`}
            >
              Dòng xe tương thích
            </p>

            <input
              type="text"
              placeholder="Dòng xe tương thích..."
              value={compatibility}
              onChange={(e) => setCompatibility(e.target.value)}
              className={`w-[420px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                     compatibility == originalCompatibility
                       ? "text-textsec"
                       : "text-white"
                   }
    ${
      compatibility == originalCompatibility
        ? "border-textsec"
        : "border-[#fb923c]"
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Dòng xe"
              placeholder="VD: Sedan, SUV,..."
              recent={vehicleModel}
              original={originalVehicleModel}
              value={vehicleModel}
              onChange={setVehicleModel}
            />

            <InputField
              label="Hãng sản xuất"
              placeholder="VD: Honda, Toyota,..."
              recent={manufacturer}
              original={originalManufacturer}
              value={manufacturer}
              onChange={setManufacturer}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Chất liệu"
              placeholder="VD: 250°C"
              recent={material}
              original={originalMaterial}
              value={material}
              onChange={setMaterial}
            />

            <div className="flex flex-col gap-[5px]">
              <p>Tiêu chuẩn chất lỏng</p>
              <input
                value={fluidSpec}
                placeholder="VD: SAW-01,..."
                onChange={(e) => setFluidSpec(e.target.value)}
                disabled={disabled}
                className={` ${
                  disabled
                    ? "w-[200px] px-[10px] py-[5px] bg-[#2c2c2e] border-[2px] border-[#5E5E60] rounded-[12px]  placeholder:text-gray-400 opacity-40 cursor-not-allowed"
                    : "w-[200px] px-[10px] py-[5px] bg-[#2c2c2e] border-[2px] border-[#5E5E60] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all duration-200 opacity-100"
                } ${
                  fluidSpec == originalFluidSpec
                    ? "text-textsec border-textsec"
                    : "text-textpri border-[#fb923c]"
                }`}
              />
            </div>
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
                ? "bg-[#fb923c] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#fca86b] transition-all duration-200"
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
        recent == original ? "text-textsec" : "text-[#fb923c]"
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
    ${recent == original ? "border-textsec" : "border-[#fb923c]"}
    `}
    />
  </div>
);

export default AutomotiveEdit;
