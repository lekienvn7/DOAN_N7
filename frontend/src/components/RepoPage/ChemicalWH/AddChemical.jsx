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

const AddChemical = ({ onReload }) => {
  const { user } = useAuth();
  const createdBy = user?.userID;

  /* ================= STATE ================= */
  const [basic, setBasic] = useState({
    name: "",
    materialID: "",
    quantity: "",
    unit: "",
    description: "",
    expiryDate: "",
  });

  const [spec, setSpec] = useState({
    chemicalFormula: "",
    concentration: "",
    hazardLevel: "",
    storageTemperature: "",
    boilingPoint: "",
    meltingPoint: "",
    molarMass: "",
    phLevel: "",
    flammability: "",
    toxicity: "",
    safetyNote: "",
    casNumber: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const isValid =
    basic.name.trim() &&
    basic.materialID.trim() &&
    basic.unit.trim() &&
    !isNaN(basic.quantity) &&
    Number(basic.quantity) > 0;

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

      /* 1️⃣ TẠO VẬT TƯ */
      const res = await axiosClient.post("/material", {
        ...basic,
        ...spec,
        type: "chemical",
        createdBy,
      });

      const newMaterialID = res.data?.data?.materialID;
      if (!newMaterialID) throw new Error("Không tạo được vật tư");

      /* 2️⃣ THÊM VÀO KHO HÓA CHẤT */
      await axiosClient.put("/repository/chemical", {
        materials: [
          { material: newMaterialID, quantity: Number(basic.quantity) },
        ],
      });

      toast.success("Thêm hóa chất thành công!");

      /* 3️⃣ RESET FORM */
      setBasic({
        name: "",
        materialID: "",
        quantity: "",
        unit: "",
        description: "",
        expiryDate: "",
      });

      setSpec({
        chemicalFormula: "",
        concentration: "",
        hazardLevel: "",
        storageTemperature: "",
        boilingPoint: "",
        meltingPoint: "",
        molarMass: "",
        phLevel: "",
        flammability: "",
        toxicity: "",
        safetyNote: "",
        casNumber: "",
      });

      onReload?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi thêm hóa chất!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="flex flex-col gap-[40px] text-white">
      {/* ===== BASIC INFO ===== */}
      <Section title="Thông tin cơ bản">
        <Row>
          <Input
            label="Tên hóa chất"
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
            label="Hạn sử dụng"
            value={basic.expiryDate}
            onChange={(v) => handleBasicChange("expiryDate", v)}
          />
        </Row>

        <Textarea
          label="Ghi chú"
          value={basic.description}
          onChange={(v) => handleBasicChange("description", v)}
        />
      </Section>

      {/* ===== CHEMICAL SPECS ===== */}
      <Section title="Thông tin hóa chất">
        <Row>
          <Input
            label="Công thức hóa học"
            value={spec.chemicalFormula}
            onChange={(v) => handleSpecChange("chemicalFormula", v)}
          />
          <Input
            label="Nồng độ"
            value={spec.concentration}
            onChange={(v) => handleSpecChange("concentration", v)}
          />
          <SelectBox
            label="Mức độ nguy hiểm"
            value={spec.hazardLevel}
            onChange={(v) => handleSpecChange("hazardLevel", v)}
            options={[
              { value: "low", label: "Thấp" },
              { value: "medium", label: "Trung bình" },
              { value: "high", label: "Cao" },
              { value: "extreme", label: "Cực cao" },
            ]}
          />
        </Row>

        <Row>
          <Input
            label="Nhiệt độ bảo quản"
            value={spec.storageTemperature}
            onChange={(v) => handleSpecChange("storageTemperature", v)}
          />
          <Input
            label="Điểm sôi"
            value={spec.boilingPoint}
            onChange={(v) => handleSpecChange("boilingPoint", v)}
          />
          <Input
            label="Điểm nóng chảy"
            value={spec.meltingPoint}
            onChange={(v) => handleSpecChange("meltingPoint", v)}
          />
        </Row>

        <Row>
          <Input
            label="Khối lượng mol"
            value={spec.molarMass}
            onChange={(v) => handleSpecChange("molarMass", v)}
          />
          <Input
            label="Độ pH"
            value={spec.phLevel}
            onChange={(v) => handleSpecChange("phLevel", v)}
          />
          <SelectBox
            label="Tính dễ cháy"
            value={spec.flammability}
            onChange={(v) => handleSpecChange("flammability", v)}
            options={[
              { value: "Không", label: "Không dễ cháy" },
              { value: "Thấp", label: "Thấp" },
              { value: "Trung bình", label: "Trung bình" },
              { value: "Cao", label: "Cao" },
            ]}
          />
        </Row>

        <Row>
          <SelectBox
            label="Độc tính"
            value={spec.toxicity}
            onChange={(v) => handleSpecChange("toxicity", v)}
            options={[
              { value: "Nhẹ", label: "Nhẹ" },
              { value: "Trung bình", label: "Trung bình" },
              { value: "Độc", label: "Độc" },
              { value: "Cực độc", label: "Cực độc" },
            ]}
          />
          <Input
            label="Số CAS"
            value={spec.casNumber}
            onChange={(v) => handleSpecChange("casNumber", v)}
          />
          <Input
            label="Hướng dẫn an toàn"
            value={spec.safetyNote}
            onChange={(v) => handleSpecChange("safetyNote", v)}
          />
        </Row>
      </Section>

      {/* ===== ACTION ===== */}
      <div className="flex justify-end pt-6 border-t border-[#2a2a2a]">
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={`px-6 py-3 rounded-[14px] font-semibold transition ${
            isValid
              ? "bg-[#c7a7ff] text-black hover:bg-[#e8d6ff]"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Đang thêm..." : "Nhập hóa chất"}
        </button>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-6">
    <h3 className="text-[20px] font-semibold text-[#c7a7ff]">{title}</h3>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div className="grid grid-cols-3 gap-6">{children}</div>
);

const Input = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-[5px]">
    <label className="text-sm text-gray-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-[400px] px-[10px] py-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                 focus:outline-none focus:ring-2 focus:ring-[#c7a7ff]
                 placeholder:text-gray-400 transition-all duration-200"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-300">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-[12px] bg-[#2c2c2e] border border-[#3f3f46]
                 focus:ring-2 focus:ring-[#c7a7ff] outline-none min-h-[40px]"
    />
  </div>
);

const SelectBox = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-300">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[400px] bg-[#2c2c2e] border border-[#3f3f46] rounded-[12px]">
        <SelectValue placeholder="-- Chọn --" />
      </SelectTrigger>
      <SelectContent className="bg-[#1a1a1a] text-white">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default AddChemical;
