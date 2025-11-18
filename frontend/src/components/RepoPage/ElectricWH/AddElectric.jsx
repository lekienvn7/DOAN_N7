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

const AddElectric = () => {
  const [name, setName] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");

  const [voltageRange, setVoltageRange] = useState("");
  const [power, setPower] = useState("");
  const [materialInsulation, setMaterialInsulation] = useState("");
  const [current, setCurrent] = useState("");
  const [frequency, setFrequency] = useState("");
  const [resistance, setResistance] = useState("");
  const [phaseType, setPhaseType] = useState("");
  const [conductorMaterial, setConductorMaterial] = useState("");
  const [insulationMaterial, setInsulationMaterial] = useState("");
  const [fireResistance, setFireResistance] = useState("");
  const [cableDiameter, setCableDiameter] = useState("");
  const [waterproofLevel, setWaterproofLevel] = useState("");
  const [operatingTemp, setOperatingTemp] = useState("");
  const [materialID, setMaterialID] = useState("");

  const { user } = useAuth(); // lấy thông tin người dùng đăng nhập
  const createdBy = user?.userID || "unknown"; // fallback nếu chưa có
  const [loading, setLoading] = useState(false);

  // Kiểm tra hợp lệ
  const isValid =
    name.trim() !== "" &&
    maintenanceCycle !== "" &&
    !isNaN(maintenanceCycle) &&
    Number(maintenanceCycle) >= 0 &&
    quantity !== "" &&
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
        maintenanceCycle,
        quantity,
        unit,
        description,
        materialID,

        voltageRange,
        power,
        materialInsulation,
        current,
        frequency,
        resistance,
        phaseType,
        conductorMaterial,
        insulationMaterial,
        fireResistance,
        cableDiameter,
        waterproofLevel,
        operatingTemp,

        type: "electric", // cố định là “electric”
        createdBy, // lấy id người nhập từ context
        status: "Trong kho", // mặc định “Trong kho”
      });

      if (res.data.success) {
        toast.success("Thêm vật tư thành công!");
        // Reset form
        setName("");
        setMaintenanceCycle("");
        setQuantity("");
        setUnit("");
        setDescription("");
        setMaterialID("");

        setVoltageRange("");
        setPower("");
        setMaterialInsulation("");
        setCurrent("");
        setFrequency("");
        setResistance("");
        setPhaseType("");
        setConductorMaterial("");
        setInsulationMaterial("");
        setFireResistance("");
        setCableDiameter("");
        setWaterproofLevel("");
        setOperatingTemp("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/electric`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(`Vật tư ${materialID} đã được thêm vào kho điện!`);
              setTimeout(() => window.location.reload(), 500);
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
      <div className="flex flex-row gap-[10px]">
        <div className="flex flex-col gap-[20px] justify-center text-textpri">
          <div className="flex flex-row gap-[10px] items-center">
            <div className="text-[#fdd700]">
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="text-[#fdd700]">
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div className="text-[#fdd700]">
              <InputField
                label="Số lượng"
                placeholder="Số lượng"
                type="number"
                value={quantity}
                onChange={setQuantity}
              />
            </div>
          </div>

          <div className="flex flex-row gap-[10px] items-center">
            <div className="text-[#fdd700]">
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
                className="w-[410px] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder:text-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-row gap-[10px] items-center">
            <InputField
              label="Điện áp (V)"
              placeholder="VD: 220V"
              type="text"
              value={voltageRange}
              onChange={setVoltageRange}
            />
            <InputField
              label="Công suất (W)"
              placeholder="VD: 60W"
              type="number"
              value={power}
              onChange={setPower}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Cách điện?</p>
              <Select
                value={materialInsulation}
                onValueChange={(value) => setMaterialInsulation(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Cách điện"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Có
                  </SelectItem>
                  <SelectItem
                    value="Dẫn điện"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Không
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-[10px] items-center">
            <InputField
              label="Dòng điện định mức"
              placeholder="VD: 16A"
              type="number"
              value={current}
              onChange={setCurrent}
            />
            <InputField
              label="Tần số (Hz)"
              placeholder="VD: 60Hz"
              type="number"
              value={frequency}
              onChange={setFrequency}
            />

            <InputField
              label="Điện trở (Ω)"
              placeholder="VD: 200Ω"
              type="number"
              value={resistance}
              onChange={setResistance}
            />
          </div>

          <div className="flex flex-row gap-[10px] items-center">
            <InputField
              label="Vật liệu lõi"
              placeholder="VD: lõi đồng, nhôm,..."
              type="text"
              value={conductorMaterial}
              onChange={setConductorMaterial}
            />
            <InputField
              label="Lớp bọc ngoài"
              placeholder="VD: PVC, XLPE,..."
              type="text"
              value={insulationMaterial}
              onChange={setInsulationMaterial}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Loại pha điện</p>
              <Select
                value={phaseType}
                onValueChange={(value) => setPhaseType(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Một pha"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Một pha (1P)
                  </SelectItem>
                  <SelectItem
                    value="Hai pha"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Hai pha (2P)
                  </SelectItem>
                  <SelectItem
                    value="Ba pha"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Ba pha (3P)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Khả năng chịu lửa</p>
            <Select
              value={fireResistance}
              onValueChange={(value) => setFireResistance(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="Không có"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Không có
                </SelectItem>
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
                  value="Chống lửa hoàn toàn"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Chống lửa hoàn toàn
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <InputField
            label="Đường kính dây cáp"
            placeholder="VD: 2.5mm²"
            type="text"
            value={cableDiameter}
            onChange={setCableDiameter}
          />

          <div className="text-[#fdd700]">
            <InputField
              label="Hạn bảo trì"
              placeholder="VD: 6 tháng"
              type="number"
              value={maintenanceCycle}
              onChange={setMaintenanceCycle}
            />
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Mức độ bảo vệ</p>
            <Select
              value={waterproofLevel}
              onValueChange={(value) => setWaterproofLevel(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="IP20"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  IP20: không chống nước
                </SelectItem>
                <SelectItem
                  value="IP44"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  IP44: chống mưa nhẹ
                </SelectItem>
                <SelectItem
                  value="IP65"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  IP65: chống bụi hoàn toàn và chống nước mức phun mạnh
                </SelectItem>
                <SelectItem
                  value="IP67"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  IP67: có thể ngâm nước tạm thời
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Nhiệt độ hoạt động</p>
            <Select
              value={operatingTemp}
              onValueChange={(value) => setOperatingTemp(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="0°C -> 40°C"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Dải phổ thông: 0°C đến 40°C
                </SelectItem>
                <SelectItem
                  value="-20°C -> 60°C"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Dải tiêu chuẩn CN nhẹ: -20°C đến 60°C
                </SelectItem>
                <SelectItem
                  value="-30°C -> 70°C"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Dải tiêu chuẩn CN: -30°C đến 70°C
                </SelectItem>
                <SelectItem
                  value="-40°C -> 85°C"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Dải outdoor (ngoài trời): -40°C đến 85°C
                </SelectItem>
                <SelectItem
                  value="-40°C -> 125°C"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Dải chuyên dụng chịu nhiệt cao: -40°C đến 125°C
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-5 flex justify-end gap-3">
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
              ? "bg-[#FFD700] text-black hover:bg-[#f8e16c] cursor-pointer"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Đang thêm..." : "Nhập vật tư"}
        </button>
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
      className={`w-[${width}] p-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200`}
    />
  </div>
);

export default AddElectric;
