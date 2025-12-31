import React, { useState } from "react";
import axiosClient from "@/api/axiosClient";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const AddElectric = ({ onReload }) => {
  const { user } = useAuth();
  const createdBy = user?.userID;

  /* ================= STATE ================= */
  const [basic, setBasic] = useState({
    name: "",
    materialID: "",
    quantity: "",
    unit: "",
    description: "",
    maintenanceCycle: "",
  });

  const [spec, setSpec] = useState({
    voltageRange: "",
    power: "",
    materialInsulation: "",
    current: "",
    frequency: "",
    resistance: "",
    phaseType: "",
    conductorMaterial: "",
    insulationMaterial: "",
    fireResistance: "",
    cableDiameter: "",
    waterproofLevel: "",
    operatingTemp: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const isValid =
    basic.name.trim() &&
    basic.materialID.trim() &&
    basic.unit.trim() &&
    !isNaN(basic.quantity) &&
    Number(basic.quantity) > 0 &&
    !isNaN(basic.maintenanceCycle);

  /* ================= HANDLERS ================= */
  const handleBasicChange = (key, value) =>
    setBasic((p) => ({ ...p, [key]: value }));

  const handleSpecChange = (key, value) =>
    setSpec((p) => ({ ...p, [key]: value }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(basic).forEach(([k, v]) => formData.append(k, v));
      Object.entries(spec).forEach(([k, v]) => formData.append(k, v));

      formData.append("type", "electric");
      formData.append("createdBy", createdBy);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axiosClient.post("/material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMaterialID = res.data?.data?.materialID;
      if (!newMaterialID) throw new Error("Không tạo được vật tư");

      await axiosClient.put("/repository/electric", {
        materials: [
          { material: newMaterialID, quantity: Number(basic.quantity) },
        ],
      });

      toast.success("Thêm vật tư điện thành công!");

      setBasic({
        name: "",
        materialID: "",
        quantity: "",
        unit: "",
        description: "",
        maintenanceCycle: "",
      });

      setSpec({
        voltageRange: "",
        power: "",
        materialInsulation: "",
        current: "",
        frequency: "",
        resistance: "",
        phaseType: "",
        conductorMaterial: "",
        insulationMaterial: "",
        fireResistance: "",
        cableDiameter: "",
        waterproofLevel: "",
        operatingTemp: "",
      });

      setImageFile(null);
      setImagePreview("");

      onReload?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi thêm vật tư!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="flex flex-col gap-[50px]">
      <p className="text-[35px] font-bold font-googleSans text-[var(--text-tertiary)]">
        <span className="gradient-text">Phiếu nhập</span> vật tư
      </p>

      <div className="flex flex-col gap-[40px]">
        <Section title="Thông tin cơ bản">
          <Row>
            <Input
              label="Tên vật tư"
              value={basic.name}
              onChange={(v) => handleBasicChange("name", v)}
            />
            <Input
              label="Mã vật tư"
              value={basic.materialID}
              onChange={(v) => handleBasicChange("materialID", v)}
            />
            <Input
              type="number"
              label="Số lượng"
              value={basic.quantity}
              onChange={(v) => handleBasicChange("quantity", v)}
            />
          </Row>

          <Row>
            <Input
              label="Đơn vị"
              value={basic.unit}
              onChange={(v) => handleBasicChange("unit", v)}
            />
            <Input
              type="number"
              label="Hạn bảo trì (tháng)"
              value={basic.maintenanceCycle}
              onChange={(v) => handleBasicChange("maintenanceCycle", v)}
            />
          </Row>

          <Textarea
            label="Ghi chú"
            value={basic.description}
            onChange={(v) => handleBasicChange("description", v)}
          />
        </Section>

        <Section title="Ảnh vật tư">
          <ImageDropzone
            onSelect={(file) => {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-4 w-[200px] h-[200px] object-contain rounded-[12px] border"
            />
          )}
        </Section>

        <Section title="Thông số kỹ thuật">
          <Row>
            <Input
              label="Điện áp"
              value={spec.voltageRange}
              onChange={(v) => handleSpecChange("voltageRange", v)}
            />
            <Input
              label="Công suất (W)"
              type="number"
              value={spec.power}
              onChange={(v) => handleSpecChange("power", v)}
            />
            <SelectBox
              label="Cách điện"
              value={spec.materialInsulation}
              onChange={(v) => handleSpecChange("materialInsulation", v)}
              options={[
                { value: "Cách điện", label: "Có" },
                { value: "Dẫn điện", label: "Không" },
              ]}
            />
          </Row>

          <Row>
            <Input
              label="Dòng định mức (A)"
              type="number"
              value={spec.current}
              onChange={(v) => handleSpecChange("current", v)}
            />
            <Input
              label="Tần số (Hz)"
              type="number"
              value={spec.frequency}
              onChange={(v) => handleSpecChange("frequency", v)}
            />
            <SelectBox
              label="Chịu lửa"
              value={spec.fireResistance}
              onChange={(v) => handleSpecChange("fireResistance", v)}
              options={["Không", "Thấp", "Trung bình", "Cao"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Row>

          <Row>
            <Input
              label="Vật liệu lõi"
              value={spec.conductorMaterial}
              onChange={(v) => handleSpecChange("conductorMaterial", v)}
            />
            <Input
              label="Lớp bọc"
              value={spec.insulationMaterial}
              onChange={(v) => handleSpecChange("insulationMaterial", v)}
            />
            <SelectBox
              label="Loại pha"
              value={spec.phaseType}
              onChange={(v) => handleSpecChange("phaseType", v)}
              options={["Một pha", "Hai pha", "Ba pha"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Row>

          <Row>
            <Input
              label="Điện trở (Ω)"
              type="number"
              value={spec.resistance}
              onChange={(v) => handleSpecChange("resistance", v)}
            />
            <Input
              label="Đường kính cáp"
              value={spec.cableDiameter}
              onChange={(v) => handleSpecChange("cableDiameter", v)}
            />
            <SelectBox
              label="Chuẩn IP"
              value={spec.waterproofLevel}
              onChange={(v) => handleSpecChange("waterproofLevel", v)}
              options={["IP20", "IP44", "IP65", "IP67"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Row>
        </Section>

        <div className="flex justify-end pt-6 border-t border-[var(--border-light)]">
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`px-6 py-3 rounded-[14px] font-semibold transition ${
              isValid
                ? "bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-hover)]"
                : "bg-[var(--bg-hover)] text-[var(--text-quaternary)] cursor-not-allowed"
            }`}
          >
            {loading ? "Đang thêm..." : "Nhập vật tư"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-6">
    <h3 className="text-[20px] font-bold text-[var(--text-primary)]">
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div className="grid grid-cols-3 gap-6">{children}</div>
);

const Input = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-[5px]">
    <label className="text-sm text-[var(--text-secondary)]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-[400px] px-[10px] py-[5px]
        bg-[var(--bg-subtle)]
        text-[var(--text-primary)]
        border border-[var(--border-light)]
        rounded-[12px]
        focus:outline-none
        focus:ring-2 focus:ring-[var(--accent-blue)]
        placeholder:text-[var(--text-quaternary)]
        transition-all duration-200
      "
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-[var(--text-tertiary)]">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        px-3 py-2 rounded-[12px]
        bg-[var(--bg-subtle)]
        border border-[var(--border-light)]
        text-[var(--text-primary)]
        focus:ring-2 focus:ring-[var(--accent-blue)]
        outline-none min-h-[40px]
      "
    />
  </div>
);

const SelectBox = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-[var(--text-tertiary)]">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[400px] bg-[var(--bg-subtle)] border border-[var(--border-light)] rounded-[12px] text-[var(--text-primary)]">
        <SelectValue placeholder="-- Chọn --" />
      </SelectTrigger>
      <SelectContent className="bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-light)]">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const ImageDropzone = ({ onSelect }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onSelect(file);
  };

  const handlePick = (e) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="
        border-2 border-dashed border-[var(--border-light)]
        rounded-[16px] p-6 text-center cursor-pointer
        hover:border-[var(--accent-blue)]
        transition
      "
    >
      <input
        type="file"
        accept="image/*"
        onChange={handlePick}
        hidden
        id="imageInput"
      />
      <label htmlFor="imageInput" className="cursor-pointer">
        <p className="text-sm text-[var(--text-secondary)]">
          Kéo & thả ảnh vào đây hoặc{" "}
          <span className="text-[var(--accent-blue)] font-medium">
            click để chọn
          </span>
        </p>
      </label>
    </div>
  );
};

export default AddElectric;
