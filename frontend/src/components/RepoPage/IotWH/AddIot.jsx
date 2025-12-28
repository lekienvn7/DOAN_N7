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

const AddIot = ({ onReload }) => {
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
    sensorType: "",
    cpuClock: "",
    communicationProtocol: "",
    wirelessTech: "",
    powerSupply: "",
    ioPins: "",
    memory: "",
    operatingTemp: "",
    deviceInterface: "",
    moduleSize: "",
    powerConsumption: "",
    accuracy: "",
    responseTime: "",
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
        type: "iot",
        createdBy,
      });

      const newMaterialID = res.data?.data?.materialID;
      if (!newMaterialID) throw new Error("Không tạo được vật tư");

      await axiosClient.put("/repository/iot", {
        materials: [
          { material: newMaterialID, quantity: Number(basic.quantity) },
        ],
      });

      toast.success("Thêm vật tư nhúng & IoT thành công!");

      setBasic({
        name: "",
        materialID: "",
        quantity: "",
        unit: "",
        description: "",
        maintenanceCycle: "",
      });

      setSpec({
        sensorType: "",
        cpuClock: "",
        communicationProtocol: "",
        wirelessTech: "",
        powerSupply: "",
        ioPins: "",
        memory: "",
        operatingTemp: "",
        deviceInterface: "",
        moduleSize: "",
        powerConsumption: "",
        accuracy: "",
        responseTime: "",
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
              onChange={(v) =>
                handleBasicChange("maintenanceCycle", v)
              }
            />
          </Row>

          <Textarea
            label="Ghi chú"
            value={basic.description}
            onChange={(v) => handleBasicChange("description", v)}
          />
        </Section>

        {/* ===== IOT SPECS ===== */}
        <Section title="Thông số nhúng & IoT">
          <Row>
            <Input
              label="Loại cảm biến"
              value={spec.sensorType}
              onChange={(v) => handleSpecChange("sensorType", v)}
            />
            <Input
              label="Xung nhịp CPU"
              value={spec.cpuClock}
              onChange={(v) => handleSpecChange("cpuClock", v)}
            />
            <Input
              label="Giao thức truyền thông"
              value={spec.communicationProtocol}
              onChange={(v) =>
                handleSpecChange("communicationProtocol", v)
              }
            />
          </Row>

          <Row>
            <Input
              label="Công nghệ không dây"
              value={spec.wirelessTech}
              onChange={(v) => handleSpecChange("wirelessTech", v)}
            />
            <Input
              label="Nguồn cấp"
              value={spec.powerSupply}
              onChange={(v) => handleSpecChange("powerSupply", v)}
            />
            <Input
              label="Số chân I/O"
              value={spec.ioPins}
              onChange={(v) => handleSpecChange("ioPins", v)}
            />
          </Row>

          <Row>
            <Input
              label="Bộ nhớ"
              value={spec.memory}
              onChange={(v) => handleSpecChange("memory", v)}
            />
            <Input
              label="Chuẩn giao tiếp"
              value={spec.deviceInterface}
              onChange={(v) =>
                handleSpecChange("deviceInterface", v)
              }
            />
            <SelectBox
              label="Nhiệt độ hoạt động"
              value={spec.operatingTemp}
              onChange={(v) =>
                handleSpecChange("operatingTemp", v)
              }
              options={[
                { value: "Commercial", label: "Thương mại (0–70°C)" },
                { value: "Industrial", label: "Công nghiệp (-20–85°C)" },
                { value: "Extended", label: "Công nghiệp nặng (-40–85°C)" },
                { value: "Automotive", label: "Chuẩn ô tô (-40–125°C)" },
              ]}
            />
          </Row>

          <Row>
            <Input
              label="Kích thước module"
              value={spec.moduleSize}
              onChange={(v) => handleSpecChange("moduleSize", v)}
            />
            <Input
              label="Công suất tiêu thụ"
              value={spec.powerConsumption}
              onChange={(v) =>
                handleSpecChange("powerConsumption", v)
              }
            />
            <Input
              label="Độ chính xác"
              value={spec.accuracy}
              onChange={(v) => handleSpecChange("accuracy", v)}
            />
          </Row>

          <Row>
            <Input
              label="Thời gian phản hồi"
              value={spec.responseTime}
              onChange={(v) =>
                handleSpecChange("responseTime", v)
              }
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
    <label className="text-sm text-[var(--text-secondary)]">
      {label}
    </label>
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
    <label className="text-sm text-[var(--text-tertiary)]">
      {label}
    </label>
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
    <label className="text-sm text-[var(--text-tertiary)]">
      {label}
    </label>
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

export default AddIot;
