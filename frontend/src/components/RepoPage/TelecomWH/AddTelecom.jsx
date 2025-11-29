import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { DialogFooter, DialogClose } from "../../ui/dialog";
import ColorField from "@/lib/ColorInputField";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const AddTelecom = ({ onReload }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");

  const [signalType, setSignalType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [bandwidth, setBandwidth] = useState("");
  const [connectorType, setConnectorType] = useState("");
  const [cableType, setCableType] = useState("");
  const [transmissionRate, setTransmissionRate] = useState("");
  const [range, setRange] = useState("");
  const [impedance, setImpedance] = useState("");
  const [modulationType, setModulationType] = useState("");
  const [attenuation, setAttenuation] = useState("");
  const [polarization, setPolarization] = useState("");
  const [noiseFigure, setNoiseFigure] = useState("");

  const { user } = useAuth(); // lấy thông tin người dùng đăng nhập
  const createdBy = user?.userID || "unknown"; // fallback nếu chưa có
  const [loading, setLoading] = useState(false);

  // Kiểm tra hợp lệ
  const isValid =
    name.trim() !== "" &&
    materialID.trim() !== "" &&
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
        quantity,
        unit,
        description,
        maintenanceCycle,
        materialID,

        signalType,
        frequency,
        bandwidth,
        connectorType,
        cableType,
        transmissionRate,
        range,
        impedance,
        modulationType,
        attenuation,
        polarization,
        noiseFigure,

        type: "telecom", // cố định là “electric”
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
        setMaintenanceCycle("");
        setMaterialID("");

        setSignalType("");
        setFrequency("");
        setBandwidth("");
        setConnectorType("");
        setCableType("");
        setTransmissionRate("");
        setRange("");
        setImpedance("");
        setModulationType("");
        setAttenuation("");
        setPolarization("");
        setNoiseFigure("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/telecom`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho điện tử viễn thông!`
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
            <div className="text-[#a78bfa]">
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="text-[#a78bfa]">
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div className="text-[#a78bfa]">
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
            <div className="text-[#a78bfa]">
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
              label="Loại tín hiệu"
              placeholder="VD: Analog, Digital..."
              value={signalType}
              onChange={setSignalType}
            />

            <InputField
              label="Tần số"
              placeholder="VD: 2.4 GHz (WiFi), 900 MHz (GSM)..."
              value={frequency}
              onChange={setFrequency}
            />

            <InputField
              label="Băng thông"
              placeholder="VD: 20 MHz, 40 MHz..."
              value={bandwidth}
              onChange={setBandwidth}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Loại đầu nối"
              placeholder="VD: SMA, RJ45,..."
              value={connectorType}
              onChange={setConnectorType}
            />

            <InputField
              label="Loại cáp"
              placeholder="VD: Coaxial RG-6, UTP Cat6..."
              value={cableType}
              onChange={setCableType}
            />

            <InputField
              label="Tốc độ truyền tải"
              placeholder="VD: 100 Mbps, 1 Gbps,..."
              value={transmissionRate}
              onChange={setTransmissionRate}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Tầm hoạt động"
              placeholder="VD: 30m, 5km,..."
              value={range}
              onChange={setRange}
            />

            <InputField
              label="Trở kháng"
              placeholder="VD: 50Ω (RF), 75Ω (truyền hình),..."
              value={impedance}
              onChange={setImpedance}
            />

            <InputField
              label="Kiểu điều chế"
              placeholder="VD:QAM, OFDM,..."
              value={modulationType}
              onChange={setModulationType}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <InputField
            label="Suy hao"
            placeholder="VD: 6 dB/100m, 0.4 dB/km..."
            value={attenuation}
            onChange={setAttenuation}
          />

          <InputField
            label="Phân cực sóng"
            placeholder="VD: Vertical, Horizontal,..."
            value={polarization}
            onChange={setPolarization}
          />

          <InputField
            label="Hệ số nhiễu"
            placeholder="VD: 1.2 dB,..."
            value={noiseFigure}
            onChange={setNoiseFigure}
          />

          <div className="flex flex-row gap-[20px] items-center">
            <div className="text-[#a78bfa]">
              <InputField
                label="Hạn bảo trì"
                placeholder="VD: 6 tháng,..."
                value={maintenanceCycle}
                onChange={setMaintenanceCycle}
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="!flex-row !justify-between !items-center mt-5">
        <p className="w-fit text-[22px] font-vegan text-textsec drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <span
            className="text-[#a78bfa]/70 drop-shadow-[0_0_14px_rgba(167,139,250,1)]
"
          >
            U
          </span>
          neti{" "}
          <span
            className="text-[#a78bfa]/70 drop-shadow-[0_0_14px_rgba(167,139,250,1)]
"
          >
            T
          </span>
          elecom
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
                ? "bg-[#a78bfa] text-black hover:bg-[#916df4] cursor-pointer"
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

export default AddTelecom;
