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

const AddTechnology = ({ onReload }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");

  const [deviceType, setDeviceType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [speed, setSpeed] = useState("");
  const [brand, setBrand] = useState("");
  const [connectorType, setConnectorType] = useState("");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [protocol, setProtocol] = useState("");
  const [networkInterface, setNetworkInterface] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");
  const [durabilityRating, setDurabilityRating] = useState("");
  const [formFactor, setFormFactor] = useState("");
  const [dataTransferRate, setDataTransferRate] = useState("");

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

        deviceType,
        capacity,
        speed,
        brand,
        connectorType,
        powerConsumption,
        protocol,
        networkInterface,
        operatingSystem,
        durabilityRating,
        formFactor,
        dataTransferRate,

        type: "technology", // cố định là “electric”
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

        setDeviceType("");
        setCapacity("");
        setSpeed("");
        setBrand("");
        setConnectorType("");
        setPowerConsumption("");
        setProtocol("");
        setNetworkInterface("");
        setOperatingSystem("");
        setDurabilityRating("");
        setFormFactor("");
        setDataTransferRate("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/technology`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho công nghệ thông tin!`
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
            <div className="text-[#60a5fa]">
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="text-[#60a5fa]">
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div className="text-[#60a5fa]">
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
            <div className="text-[#60a5fa]">
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
              label="Loại thiết bị"
              placeholder="VD: RAM, Card mạng..."
              value={deviceType}
              onChange={setDeviceType}
            />

            <InputField
              label="Dung lượng"
              placeholder="VD: 512GB SSD, 8GB RAM..."
              value={capacity}
              onChange={setCapacity}
            />

            <InputField
              label="Tốc độ"
              placeholder="VD: 3200MHz , 540MB/s..."
              value={speed}
              onChange={setSpeed}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Thương hiệu"
              placeholder="VD: Dell, Asus,..."
              value={brand}
              onChange={setBrand}
            />

            <InputField
              label="Chuẩn kết nối"
              placeholder="VD: NVMe, USB-C,..."
              value={connectorType}
              onChange={setConnectorType}
            />

            <InputField
              label="Mức tiêu thụ điện"
              placeholder="VD: 15W, 65W,..."
              value={powerConsumption}
              onChange={setPowerConsumption}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Giao thức hỗ trợ"
              placeholder="VD: TCP/IP, HTTP,..."
              value={protocol}
              onChange={setProtocol}
            />

            <InputField
              label="Giao diện mạng"
              placeholder="VD: Ethernet 1GbE, Wi-Fi 6,..."
              value={networkInterface}
              onChange={setNetworkInterface}
            />

            <InputField
              label="Hệ điều hành hỗ trợ"
              placeholder="VD: Window, Linux,..."
              value={operatingSystem}
              onChange={setOperatingSystem}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <InputField
            label="Chuẩn kích thước"
            placeholder="VD: 2.5-inch SSD, M.2 2280,..."
            value={formFactor}
            onChange={setFormFactor}
          />

          <InputField
            label="Độ bền"
            placeholder="VD: MTBF 1.5 triệu giờ, Class A,..."
            value={durabilityRating}
            onChange={setDurabilityRating}
          />

          <InputField
            label="Tốc độ truyền dữ liệu"
            placeholder="VD: PCIe 4.0 x4 ~ 7.5GB/s,..."
            value={dataTransferRate}
            onChange={setDataTransferRate}
          />

          <div className="flex flex-row gap-[20px] items-center">
            <div className="text-[#60a5fa]">
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
          <span className="text-[#60a5fa]/70 drop-shadow-[0_0_14px_rgba(96,165,250,1)]
">
            U
          </span>
          neti{" "}
          <span className="text-[#60a5fa]/70 drop-shadow-[0_0_14px_rgba(96,165,250,1)]
">
            T
          </span>
          echnology
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
                ? "bg-[#60a5fa] text-black hover:bg-[#3184f3] cursor-pointer"
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

export default AddTechnology;
