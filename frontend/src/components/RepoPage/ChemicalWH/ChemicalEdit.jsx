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

const ChemicalEdit = ({ item, onReload }) => {
  const [description, setDescription] = useState(item.description || "");
  const [chemicalFormula, setChemicalFormula] = useState(
    item.chemicalFormula || ""
  );
  const [concentration, setConcentration] = useState(item.concentration || "");
  const [boilingPoint, setBoilingPoint] = useState(item.boilingPoint || "");
  const [meltingPoint, setMeltingPoint] = useState(item.meltingPoint || "");
  const [molarMass, setMolarMass] = useState(item.molarMass || "");
  const [phLevel, setPhLevel] = useState(item.phLevel || "");
  const [safetyNote, setSafetyNote] = useState(item.safetyNote || "");

  const originalConcentration = item.concentration || "";
  const originalDescription = item.description || "";
  const originalChemicalFormula = item.chemicalFormula || "";
  const originalBoilingPoint = item.boilingPoint || "";
  const originalMeltingPoint = item.meltingPoint || "";
  const originalMolarMass = item.molarMass || "";
  const originalPhLevel = item.phLevel || "";
  const originalSafetyNote = item.safetyNote || "";

  const [loading, setLoading] = useState(false);

  // Đồng bộ lại state mỗi khi đổi vật tư
  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setChemicalFormula(item.chemicalFormula || "");
      setConcentration(item.concentration || "");
      setBoilingPoint(item.boilingPoint || "");
      setMeltingPoint(item.meltingPoint || "");
      setMolarMass(item.molarMass || "");
      setPhLevel(item.phLevel || "");
      setSafetyNote(item.safetyNote || "");
    }
  }, [item]);

  const isValid =
    description != originalDescription ||
    chemicalFormula != originalChemicalFormula ||
    concentration != originalConcentration ||
    boilingPoint != originalBoilingPoint ||
    meltingPoint != originalMeltingPoint ||
    molarMass != originalMolarMass ||
    phLevel != originalPhLevel ||
    safetyNote != originalSafetyNote;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);
      const body = {
        description,
        chemicalFormula,
        concentration,
        boilingPoint,
        meltingPoint,
        molarMass,
        safetyNote,
        phLevel,
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
        className="bg-[#1a1a1a] !max-w-none w-auto max-w-fit  h-auto max-h-fit rounded-[12px] border-none whitespace-nowrap text-white p-[25px] "
      >
        <DialogHeader>
          <DialogTitle>Chỉnh sửa vật tư</DialogTitle>
          <DialogDescription>
            <span className="text-[#fdd700]">{item.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[5px] text-left">
            <p
              className={`ml-[10px] ${
                description == originalDescription
                  ? "text-textsec"
                  : "text-[#fdd700]"
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
      description == originalDescription ? "border-textsec" : "border-[#ffd700]"
    }
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>

          <div className="flex flex-col gap-[5px] text-left">
            <p
              className={`ml-[10px] ${
                safetyNote == originalSafetyNote
                  ? "text-textsec"
                  : "text-[#fdd700]"
              }`}
            >
              Hướng dẫn an toàn
            </p>

            <input
              type="text"
              placeholder="Hướng dẫn an toàn..."
              value={safetyNote}
              onChange={(e) => setSafetyNote(e.target.value)}
              className={`w-[420px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                     safetyNote == originalSafetyNote
                       ? "text-textsec"
                       : "text-white"
                   }
    ${safetyNote == originalSafetyNote ? "border-textsec" : "border-[#ffd700]"}
                   placeholder:text-gray-400 transition-all duration-200`}
            />
          </div>

          <div className={`flex flex-row gap-[20px] `}>
            <InputField
              label="Công thức hóa học"
              placeholder="VD: Hcl"
              recent={chemicalFormula}
              original={originalChemicalFormula}
              value={chemicalFormula}
              onChange={setChemicalFormula}
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
                ? "bg-[#ffd700] text-black px-4 py-2 rounded-[12px] cursor-pointer hover:bg-[#faa900] transition-all duration-200"
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
        recent == original ? "text-textsec" : "text-[#ffd700]"
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
    ${recent == original ? "border-textsec" : "border-[#ffd700]"}
    `}
    />
  </div>
);

export default ChemicalEdit;
