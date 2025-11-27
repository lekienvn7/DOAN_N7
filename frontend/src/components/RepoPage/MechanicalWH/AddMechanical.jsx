import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { DialogFooter, DialogClose } from "../../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { interpolate } from "framer-motion";

const AddMechanical = ({ onReload }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");

  const [metalType, setMetalType] = useState("");
  const [hardness, setHardness] = useState("");
  const [tensileStrength, setTensileStrength] = useState("");
  const [weight, setWeight] = useState("");
  const [coating, setCoating] = useState("");
  const [thickness, setThickness] = useState("");
  const [size, setSize] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [heatResistance, setHeatResistance] = useState("");
  const [corrosionResistance, setCorrosionResistance] = useState("");
  const [surfaceFinish, setSurfaceFinish] = useState("");
  const [magneticProperty, setMagneticProperty] = useState("");
  const [impactResistance, setImpactResistance] = useState("");
  const [ductility, setDuctility] = useState("");

  const { user } = useAuth(); // lấy thông tin người dùng đăng nhập
  const createdBy = user?.userID || "unknown"; // fallback nếu chưa có
  const [loading, setLoading] = useState(false);

  // Kiểm tra hợp lệ
  const isValid =
    name.trim() !== "" &&
    materialID.trim() !== "" &&
    quantity !== "" &&
    maintenanceCycle !== "" &&
    !isNaN(maintenanceCycle) &&
    Number(maintenanceCycle) >= 0 &&
    !isNaN(quantity) &&
    Number(quantity) >= 0 &&
    unit.trim() !== "";

  // Focus vào ô tên vật tư khi dialog vừa mở
  useEffect(() => {
    const firstInput = document.querySelector('input[name="materialName"]');
    if (firstInput) firstInput.focus();
  }, []);

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Vui lòng nhập đầy đủ và hợp lệ các thông tin bắt buộc!");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/material", {
        name: name,
        quantity,
        unit,
        description,
        materialID,
        maintenanceCycle,

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

        type: "mechanical", // cố định là “electric”
        createdBy, // lấy id người nhập từ context
        status: "Trong kho", // mặc định “Trong kho”
      });

      if (res.data.success) {
        toast.success("Thêm vật tư thành công!");
        // Reset form
        setName("");
        setQuantity("");
        setUnit("");
        setDescription("");
        setMaterialID("");
        setMaintenanceCycle("");

        setMetalType("");
        setHardness("");
        setTensileStrength("");
        setWeight("");
        setCoating("");
        setThickness("");
        setSize("");
        setTolerance("");
        setLoadCapacity("");
        setHeatResistance("");
        setCorrosionResistance("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/mechanical`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho cơ khí!`
              );
              setTimeout(() => onReload(), 500);
            } else {
              toast.error("Không thể thêm vào kho: " + repoRes.data.message);
            }
          } catch (err) {
            console.error("Lỗi thêm vào kho:", err);
            toast.error("Không thể kết nối máy chủ khi thêm vào kho!");
          } finally {
            setLoading(false);
          }
        }, 1000);
      } else {
        toast.error("Thêm vật tư thất bại!");
      }
    } catch (error) {
      console.error("Lỗi thêm vật tư:", error);
      toast.error(error.response?.data?.message || "Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-[20px]">
        <div className="flex flex-col gap-[20px] justify-center text-textpri">
          <div className="flex flex-row gap-[20px] items-center">
            <div
              className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
            >
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div
              className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
            >
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div
              className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
            >
              <InputField
                label="Số lượng"
                placeholder="Số lượng"
                type="number"
                value={quantity}
                onChange={setQuantity}
              />
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <div
              className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
            >
              <InputField
                label="Đơn vị"
                placeholder="VD: cái, mét..."
                value={unit}
                onChange={setUnit}
              />
            </div>

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Ghi chú:</p>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú thêm"
                className="w-[420px] py-[5px] px-[10px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder:text-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Loại kim loại"
              placeholder="VD: Thép carbon, Nhôm..."
              value={metalType}
              onChange={setMetalType}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Độ cứng</p>
              <Select
                value={hardness}
                onValueChange={(value) => setHardness(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Mềm"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mềm: 20–30 HRC
                  </SelectItem>
                  <SelectItem
                    value="Vừa"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Vừa: 30–45 HRC
                  </SelectItem>
                  <SelectItem
                    value="Cứng"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Cứng: 45–55 HRC
                  </SelectItem>
                  <SelectItem
                    value="Rất cứng"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Rất cứng: 55–65 HRC
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Độ bền kéo</p>
              <Select
                value={tensileStrength}
                onValueChange={(value) => setTensileStrength(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Thấp"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    {`Thấp: < 300 MPa`}
                  </SelectItem>
                  <SelectItem
                    value="Trung bình"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Trung bình: 300–600 MPa
                  </SelectItem>
                  <SelectItem
                    value="Cao"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Cao: 600–1000 MPa
                  </SelectItem>
                  <SelectItem
                    value="Siêu cao"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    {`Siêu cao: > 1000 MPa`}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Trọng lượng"
              placeholder="VD: 1.2 kg,..."
              value={weight}
              onChange={setWeight}
            />

            <InputField
              label="Lớp phủ"
              placeholder="VD: Mạ kẽm,..."
              value={coating}
              onChange={setCoating}
            />

            <InputField
              label="Độ dày"
              placeholder="VD: 0.8 mm, 1.5 mm,..."
              value={thickness}
              onChange={setThickness}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Khả năng chống ăn mòn</p>
              <Select
                value={corrosionResistance}
                onValueChange={(value) => setCorrosionResistance(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Thấp"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Thấp
                  </SelectItem>
                  <SelectItem
                    value="Trung bình"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Trung bình
                  </SelectItem>
                  <SelectItem
                    value="Cao"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Cao
                  </SelectItem>
                  <SelectItem
                    value="Siêu cao"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Rất cao
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputField
              label="Dung sai"
              placeholder="VD: ±0.1 mm, ±0.5 mm,..."
              value={tolerance}
              onChange={setTolerance}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Độ nhẵn bề mặt</p>
              <Select
                value={surfaceFinish}
                onValueChange={(value) => setSurfaceFinish(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Thô"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Thô (6.3–12.5 μm)
                  </SelectItem>
                  <SelectItem
                    value="Trung bình"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Trung bình (1.6–3.2 μm)
                  </SelectItem>
                  <SelectItem
                    value="Cao"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mịn (0.4–0.8 μm)
                  </SelectItem>
                  <SelectItem
                    value="Siêu cao"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    {`Siêu mịn (< 0.2 μm)`}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[21px]">
          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Khả năng chịu nhiệt</p>
            <Select
              value={heatResistance}
              onValueChange={(value) => setHeatResistance(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="Thấp"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  {`Thấp: < 150°C`}
                </SelectItem>
                <SelectItem
                  value="Trung bình"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Trung bình: 150–350°C
                </SelectItem>
                <SelectItem
                  value="Cao"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Cao: 350–600°C
                </SelectItem>
                <SelectItem
                  value="Siêu cao"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  {`Rất cao: > 600°C`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
          >
            <InputField
              label="Hạn bảo trì"
              placeholder="VD: 6 tháng"
              value={maintenanceCycle}
              onChange={setMaintenanceCycle}
            />
          </div>
          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Tính từ</p>
            <Select
              value={magneticProperty}
              onValueChange={(value) => setMagneticProperty(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="None"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Không từ tính
                </SelectItem>
                <SelectItem
                  value="Low"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Từ tính yếu
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Từ tính trung bình
                </SelectItem>
                <SelectItem
                  value="High"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Từ tính mạnh
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Khả năng chịu va đập</p>
            <Select
              value={impactResistance}
              onValueChange={(value) => setImpactResistance(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="low"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Thấp
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Trung bình
                </SelectItem>
                <SelectItem
                  value="high"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Cao
                </SelectItem>
                <SelectItem
                  value="Ultra"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Rất cao
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Độ dẻo</p>
            <Select
              value={ductility}
              onValueChange={(value) => setDuctility(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="very low"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Rất thấp (giòn)
                </SelectItem>
                <SelectItem
                  value="low"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Thấp
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Trung bình
                </SelectItem>
                <SelectItem
                  value="high"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Cao
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter className="!flex-row !justify-between !items-center mt-5">
        <p className="w-fit text-[22px] font-vegan text-textsec drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <span
            className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
          >
            U
          </span>
          neti{" "}
          <span
            className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)]"
          >
            M
          </span>
          echanical{" "}
        </p>

        <div className="flex flex-row gap-3">
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-[12px] hover:bg-gray-600 transition">
              Hủy
            </button>
          </DialogClose>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 rounded-[12px] transition font-semibold ${
              isValid
                ? "bg-[#5eead4] text-black hover:bg-[#87f3e1] cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Đang thêm..." : "Nhập vật tư"}
          </button>
        </div>
      </DialogFooter>
    </div>
  );
};

// Component con cho input (tái sử dụng)
const InputField = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  width = "200px",
}) => (
  <div className="flex flex-col gap-[5px] items-left">
    <p className="ml-[10px]">{label}:</p>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-[${width}] px-[10px] py-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200`}
    />
  </div>
);

export default AddMechanical;
