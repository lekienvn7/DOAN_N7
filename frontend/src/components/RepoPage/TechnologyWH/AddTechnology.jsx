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

const AddTechnology = ({ onReload }) => {
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
    deviceType: "",
    capacity: "",
    speed: "",
    brand: "",
    connectorType: "",
    powerConsumption: "",
    protocol: "",
    networkInterface: "",
    operatingSystem: "",
    durabilityRating: "",
    formFactor: "",
    dataTransferRate: "",
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
        type: "technology",
        createdBy,
      });

      const newMaterialID = res.data?.data?.materialID;
      if (!newMaterialID) throw new Error("Không tạo được vật tư");

      await axiosClient.put("/repository/technology", {
        materials: [
          { material: newMaterialID, quantity: Number(basic.quantity) },
        ],
      });

      toast.success("Thêm vật tư công nghệ thông tin thành công!");

      setBasic({
        name: "",
        materialID: "",
        quantity: "",
        unit: "",
        description: "",
        maintenanceCycle: "",
      });

      setSpec({
        deviceType: "",
        capacity: "",
        speed: "",
        brand: "",
        connectorType: "",
        powerConsumption: "",
        protocol: "",
        networkInterface: "",
        operatingSystem: "",
        durabilityRating: "",
        formFactor: "",
        dataTransferRate: "",
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

        {/* ===== TECHNOLOGY SPECS ===== */}
        <Section title="Thông số công nghệ">
          <Row>
            <Input
              label="Loại thiết bị"
              value={spec.deviceType}
              onChange={(v) => handleSpecChange("deviceType", v)}
            />
            <Input
              label="Dung lượng"
              value={spec.capacity}
              onChange={(v) => handleSpecChange("capacity", v)}
            />
            <Input
              label="Tốc độ"
              value={spec.speed}
              onChange={(v) => handleSpecChange("speed", v)}
            />
          </Row>

          <Row>
            <Input
              label="Thương hiệu"
              value={spec.brand}
              onChange={(v) => handleSpecChange("brand", v)}
            />
            <Input
              label="Chuẩn kết nối"
              value={spec.connectorType}
              onChange={(v) => handleSpecChange("connectorType", v)}
            />
            <Input
              label="Mức tiêu thụ điện"
              value={spec.powerConsumption}
              onChange={(v) => handleSpecChange("powerConsumption", v)}
            />
          </Row>

          <Row>
            <Input
              label="Giao thức"
              value={spec.protocol}
              onChange={(v) => handleSpecChange("protocol", v)}
            />
            <Input
              label="Giao diện mạng"
              value={spec.networkInterface}
              onChange={(v) => handleSpecChange("networkInterface", v)}
            />
            <Input
              label="Hệ điều hành"
              value={spec.operatingSystem}
              onChange={(v) => handleSpecChange("operatingSystem", v)}
            />
          </Row>

          <Row>
            <Input
              label="Độ bền"
              value={spec.durabilityRating}
              onChange={(v) => handleSpecChange("durabilityRating", v)}
            />
            <Input
              label="Chuẩn kích thước"
              value={spec.formFactor}
              onChange={(v) => handleSpecChange("formFactor", v)}
            />
            <Input
              label="Tốc độ truyền dữ liệu"
              value={spec.dataTransferRate}
              onChange={(v) => handleSpecChange("dataTransferRate", v)}
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

export default AddTechnology;
