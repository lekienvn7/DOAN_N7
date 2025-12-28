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

const AddMechanical = ({ onReload }) => {
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
    metalType: "",
    hardness: "",
    tensileStrength: "",
    weight: "",
    coating: "",
    thickness: "",
    size: "",
    tolerance: "",
    loadCapacity: "",
    heatResistance: "",
    corrosionResistance: "",
    surfaceFinish: "",
    magneticProperty: "",
    impactResistance: "",
    ductility: "",
  });

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

      const res = await axiosClient.post("/material", {
        ...basic,
        ...spec,
        type: "mechanical",
        createdBy,
      });

      const newMaterialID = res.data?.data?.materialID;
      if (!newMaterialID) throw new Error("Không tạo được vật tư");

      await axiosClient.put("/repository/mechanical", {
        materials: [
          { material: newMaterialID, quantity: Number(basic.quantity) },
        ],
      });

      toast.success("Thêm vật tư cơ khí thành công!");

      setBasic({
        name: "",
        materialID: "",
        quantity: "",
        unit: "",
        description: "",
        maintenanceCycle: "",
      });

      setSpec({
        metalType: "",
        hardness: "",
        tensileStrength: "",
        weight: "",
        coating: "",
        thickness: "",
        size: "",
        tolerance: "",
        loadCapacity: "",
        heatResistance: "",
        corrosionResistance: "",
        surfaceFinish: "",
        magneticProperty: "",
        impactResistance: "",
        ductility: "",
      });

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
        {/* ===== BASIC INFO ===== */}
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

        {/* ===== MECHANICAL SPECS ===== */}
        <Section title="Thông số cơ khí">
          <Row>
            <Input
              label="Loại kim loại"
              value={spec.metalType}
              onChange={(v) => handleSpecChange("metalType", v)}
            />
            <SelectBox
              label="Độ cứng"
              value={spec.hardness}
              onChange={(v) => handleSpecChange("hardness", v)}
              options={["Mềm", "Vừa", "Cứng", "Rất cứng"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectBox
              label="Độ bền kéo"
              value={spec.tensileStrength}
              onChange={(v) => handleSpecChange("tensileStrength", v)}
              options={["Thấp", "Trung bình", "Cao", "Siêu cao"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Row>

          <Row>
            <Input
              label="Trọng lượng"
              value={spec.weight}
              onChange={(v) => handleSpecChange("weight", v)}
            />
            <Input
              label="Lớp phủ"
              value={spec.coating}
              onChange={(v) => handleSpecChange("coating", v)}
            />
            <Input
              label="Độ dày"
              value={spec.thickness}
              onChange={(v) => handleSpecChange("thickness", v)}
            />
          </Row>

          <Row>
            <Input
              label="Kích thước"
              value={spec.size}
              onChange={(v) => handleSpecChange("size", v)}
            />
            <Input
              label="Dung sai"
              value={spec.tolerance}
              onChange={(v) => handleSpecChange("tolerance", v)}
            />
            <Input
              label="Tải trọng"
              value={spec.loadCapacity}
              onChange={(v) => handleSpecChange("loadCapacity", v)}
            />
          </Row>

          <Row>
            <SelectBox
              label="Chịu nhiệt"
              value={spec.heatResistance}
              onChange={(v) => handleSpecChange("heatResistance", v)}
              options={["Thấp", "Trung bình", "Cao", "Siêu cao"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectBox
              label="Chống ăn mòn"
              value={spec.corrosionResistance}
              onChange={(v) => handleSpecChange("corrosionResistance", v)}
              options={["Thấp", "Trung bình", "Cao", "Rất cao"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectBox
              label="Độ nhẵn bề mặt"
              value={spec.surfaceFinish}
              onChange={(v) => handleSpecChange("surfaceFinish", v)}
              options={["Thô", "Trung bình", "Mịn", "Siêu mịn"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Row>

          <Row>
            <SelectBox
              label="Từ tính"
              value={spec.magneticProperty}
              onChange={(v) => handleSpecChange("magneticProperty", v)}
              options={["Không", "Yếu", "Trung bình", "Mạnh"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectBox
              label="Chịu va đập"
              value={spec.impactResistance}
              onChange={(v) => handleSpecChange("impactResistance", v)}
              options={["Thấp", "Trung bình", "Cao", "Rất cao"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectBox
              label="Độ dẻo"
              value={spec.ductility}
              onChange={(v) => handleSpecChange("ductility", v)}
              options={["Rất thấp", "Thấp", "Trung bình", "Cao"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Row>
        </Section>

        {/* ===== ACTION ===== */}
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

/* ================= SUB COMPONENTS (GIỮ NGUYÊN) ================= */

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

export default AddMechanical;
