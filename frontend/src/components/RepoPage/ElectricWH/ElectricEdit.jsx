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
  const [imageFile, setImageFile] = useState(null);
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

  const originalDescription = item.description || "";
  const originalVoltageRange = item.voltageRange || "";
  const originalPower = item.power || "";
  const originalMaterialInsulation = item.materialInsulation || "";
  const originalCurrent = item.current || "";
  const originalFrequency = item.frequency || "";
  const originalResistance = item.resistance || "";
  const originalPhaseType = item.phaseType || "";
  const originalConductorMaterial = item.conductorMaterial || "";
  const originalInsulationMaterial = item.insulationMaterial || "";
  const originalFireResistance = item.fireResistance || "";
  const originalCableDiameter = item.cableDiameter || "";
  const originalWaterproofLevel = item.waterproofLevel || "";
  const originalOperatingTemp = item.operatingTemp || "";

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

  const isValid =
    description != originalDescription ||
    power != originalPower ||
    voltageRange != originalVoltageRange ||
    current != originalCurrent ||
    frequency != originalFrequency ||
    resistance != originalResistance ||
    conductorMaterial != originalConductorMaterial ||
    insulationMaterial != originalInsulationMaterial ||
    cableDiameter != originalCableDiameter ||
    !!imageFile;

  const handleChange = async () => {
    if (!isValid) {
      return toast.error("Thiếu thông tin vật tư!");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("description", description);
      formData.append("voltageRange", voltageRange);
      formData.append("power", power);
      formData.append("materialInsulation", materialInsulation);
      formData.append("current", current);
      formData.append("frequency", frequency);
      formData.append("resistance", resistance);
      formData.append("phaseType", phaseType);
      formData.append("conductorMaterial", conductorMaterial);
      formData.append("insulationMaterial", insulationMaterial);
      formData.append("fireResistance", fireResistance);
      formData.append("cableDiameter", cableDiameter);
      formData.append("waterproofLevel", waterproofLevel);
      formData.append("operatingTemp", operatingTemp);

      if (imageFile) {
        formData.append("image", imageFile); // 👈 QUAN TRỌNG
      }

      const res = await axiosClient.put(
        `/material/${item.materialID}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success(`Đã cập nhật vật tư ${item.materialID}!`);
        setTimeout(() => onReload(), 500);
      }
    } catch (error) {
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
              <span className=" text-[#fdd700] text-[25px] font-semibold">
                {item.name}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-[15px]">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) setImageFile(file);
            }}
            className="
    w-[420px]
    border-2 border-dashed border-[var(--border-light)]
    rounded-[12px]
    p-4 text-center
    cursor-pointer
    hover:border-[var(--accent-blue)]
    transition
  "
          >
            <input
              type="file"
              accept="image/*"
              hidden
              id="editImageInput"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
            />

            <label htmlFor="editImageInput" className="cursor-pointer">
              <p className="text-sm text-[var(--text-tertiary)]">
                Kéo & thả ảnh hoặc{" "}
                <span className="text-[var(--accent-blue)] font-medium">
                  click để chọn
                </span>
              </p>

              {imageFile && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Đã chọn ảnh: {imageFile.name}
                </p>
              )}
            </label>
          </div>
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
        description == originalDescription
          ? "border-textsec"
          : "border-[#ffd700]"
      }
                     placeholder:text-gray-400 transition-all duration-200`}
              />
            </div>
            <div className={`flex flex-row gap-[20px] `}>
              <InputField
                label="Công suất định mức"
                placeholder="VD: 10W"
                recent={power}
                original={originalPower}
                value={power}
                onChange={setPower}
              />

              <InputField
                label="Điện áp"
                placeholder="VD: 20A"
                value={voltageRange}
                recent={voltageRange}
                original={originalVoltageRange}
                onChange={setVoltageRange}
              />
            </div>

            <div className={`flex flex-row gap-[20px] `}>
              <InputField
                label="Dòng điện định mức"
                placeholder="VD: 10W"
                value={current}
                recent={current}
                original={originalCurrent}
                onChange={setCurrent}
              />

              <InputField
                label="Tần số"
                placeholder="VD: 60Hz"
                value={frequency}
                recent={frequency}
                original={originalFrequency}
                onChange={setFrequency}
              />
            </div>

            <div className={`flex flex-row gap-[20px] `}>
              <InputField
                label="Điện trở"
                placeholder="VD: 200Ω"
                value={resistance}
                recent={resistance}
                original={originalResistance}
                onChange={setResistance}
              />

              <InputField
                label="Vật liệu lõi"
                placeholder="VD: lõi đồng, nhôm,..."
                value={conductorMaterial}
                recent={conductorMaterial}
                original={originalConductorMaterial}
                onChange={setConductorMaterial}
              />
            </div>

            <div className={`flex flex-row gap-[20px] `}>
              <InputField
                label="Lớp bọc ngoài"
                placeholder="VD: PVC, XLPE,..."
                value={insulationMaterial}
                recent={insulationMaterial}
                original={originalInsulationMaterial}
                onChange={setInsulationMaterial}
              />

              <InputField
                label="Đường kính dây cáp"
                placeholder="VD: 2.5mm²"
                value={cableDiameter}
                recent={cableDiameter}
                original={originalCableDiameter}
                onChange={setCableDiameter}
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

export default ElectricEdit;
