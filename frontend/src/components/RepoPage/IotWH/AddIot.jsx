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

const AddIot = ({ onReload }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");

  const [sensorType, setSensorType] = useState("");
  const [cpuClock, setCpuClock] = useState("");
  const [communicationProtocol, setCommunicationProtocol] = useState("");
  const [wirelessTech, setWirelessTech] = useState("");
  const [powerSupply, setPowerSupply] = useState("");
  const [ioPins, setIoPins] = useState("");
  const [memory, setMemory] = useState("");
  const [operatingTemp, setOperatingTemp] = useState("");
  const [deviceInterface, setDeviceInterface] = useState("");
  const [moduleSize, setModuleSize] = useState("");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [responseTime, setResponseTime] = useState("");

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

        sensorType,
        cpuClock,
        communicationProtocol,
        wirelessTech,
        powerSupply,
        ioPins,
        memory,
        operatingTemp,
        deviceInterface,
        moduleSize,
        powerConsumption,
        accuracy,
        responseTime,

        type: "iot", // cố định là “electric”
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

        setSensorType("");
        setCpuClock("");
        setCommunicationProtocol("");
        setWirelessTech("");
        setPowerSupply("");
        setIoPins("");
        setMemory("");
        setOperatingTemp("");
        setDeviceInterface("");
        setModuleSize("");
        setPowerConsumption("");
        setAccuracy("");
        setResponseTime("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/iot`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho nhúng và iot!`
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
            <div className="text-[#5eead4]">
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="text-[#5eead4]">
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div className="text-[#5eead4]">
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
            <div className="text-[#5eead4]">
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
              label="Loại cảm biến"
              placeholder="VD: Nhiệt độ, độ ẩm..."
              value={sensorType}
              onChange={setSensorType}
            />

            <InputField
              label="Xung nhịp CPU"
              placeholder="VD: 80 MHZ, 160 MHZ..."
              value={cpuClock}
              onChange={setCpuClock}
            />

            <InputField
              label="Giao thức giao tiếp"
              placeholder="VD: UART, SPI..."
              value={communicationProtocol}
              onChange={setCommunicationProtocol}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Công nghệ không dây"
              placeholder="VD: WiFi 2.4GHz, Bluetooth 5.0,..."
              value={wirelessTech}
              onChange={setWirelessTech}
            />

            <InputField
              label="Nguồn cấp"
              placeholder="VD: 14 GPIO, 2 ADC,..."
              value={powerSupply}
              onChange={setPowerSupply}
            />

            <InputField
              label="Số chân I/O"
              placeholder="VD: 14 GPIO, 6 PWM,..."
              value={ioPins}
              onChange={setIoPins}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Bộ nhớ"
              placeholder="VD: 4MB Flash + 512KB RAM,..."
              value={memory}
              onChange={setMemory}
            />

            <InputField
              label="Chuẩn giao tiếp ngoại vi"
              placeholder="VD: Type-C, Micro-USB,..."
              value={deviceInterface}
              onChange={setDeviceInterface}
            />

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
                    value="Commercial Grade"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức Thương Mại (0°C → 70°C)
                  </SelectItem>
                  <SelectItem
                    value="Industrial Grade"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức Công Nghiệp (-20°C → 85°C)
                  </SelectItem>
                  <SelectItem
                    value="Extended Industrial"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức Công Nghiệp Nặng (-40°C → 85°C)
                  </SelectItem>
                  <SelectItem
                    value="Military Grade"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức Quân Sự (-40°C → 85°C)
                  </SelectItem>
                  <SelectItem
                    value="Automotive Grade"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Tiêu chuẩn ngành ô tô (-40°C → 125°C)
                  </SelectItem>
                  <SelectItem
                    value="others"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức cảm biến đặc thù
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <InputField
            label="Kích thước"
            placeholder="VD: 52mm x 28mm x 7mm"
            value={moduleSize}
            onChange={setModuleSize}
          />

          <InputField
            label="Công suất tiêu thụ"
            placeholder="VD: 80mA hoạt động"
            value={powerConsumption}
            onChange={setPowerConsumption}
          />

          <InputField
            label="Độ nhạy"
            placeholder="VD: ±3% RH"
            value={accuracy}
            onChange={setAccuracy}
          />

          <InputField
            label="Thời gian phản hồi"
            placeholder="VD: 5ms"
            value={responseTime}
            onChange={setResponseTime}
          />

          <div className="text-[#5eead4]">
            <InputField
              label="Hạn bảo trì"
              placeholder="VD: 6 tháng"
              value={maintenanceCycle}
              onChange={setMaintenanceCycle}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="!flex-row !justify-between !items-center mt-5">
        <p className="w-fit text-[22px] font-vegan text-textsec drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <span className="text-[#5eead4]/70 drop-shadow-[0_0_14px_rgba(94,234,212,1)]">
            U
          </span>
          neti{" "}
          <span className="text-[#5eead4]/70 drop-shadow-[0_0_14px_rgba(94,234,212,1)]">
            E
          </span>
          mbedded{" "}
          <span className="text-[#5eead4]/70 drop-shadow-[0_0_14px_rgba(94,234,212,1)]">
            S
          </span>
          ystems
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

export default AddIot;
