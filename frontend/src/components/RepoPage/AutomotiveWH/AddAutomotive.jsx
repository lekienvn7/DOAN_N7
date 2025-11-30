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

const AddAutomotive = ({ onReload }) => {
  const [name, setName] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");

  const [partType, setPartType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [lifespan, setLifespan] = useState("");
  const [material, setMaterial] = useState("");
  const [heatResistance, setHeatResistance] = useState("");
  const [fluidSpec, setFluidSpec] = useState("");

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
        maintenanceCycle,
        quantity,
        unit,
        description,
        materialID,

        partType,
        vehicleModel,
        manufacturer,
        compatibility,
        lifespan,
        material,
        heatResistance,
        fluidSpec,

        type: "automotive", // cố định là “electric”
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

        setPartType("");
        setVehicleModel("");
        setManufacturer("");
        setCompatibility("");
        setLifespan("");
        setMaterial("");
        setHeatResistance("");
        setFluidSpec("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/automotive`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho công nghệ ô tô!`
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
            <div className="text-[#fb923c]">
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="text-[#fb923c]">
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div className="text-[#fb923c]">
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
            <div className="text-[#fb923c]">
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
            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Loại linh kiện</p>
              <Select
                value={partType}
                onValueChange={(value) => setPartType(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Engine Components"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhóm động cơ
                  </SelectItem>
                  <SelectItem
                    value="Electronic & Electrical"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhóm điện
                  </SelectItem>
                  <SelectItem
                    value="HVAC"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhóm điều hòa
                  </SelectItem>
                  <SelectItem
                    value="Fluids"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhóm chất lỏng
                  </SelectItem>
                  <SelectItem
                    value="Body & Exterior"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhóm thân vỏ
                  </SelectItem>
                  <SelectItem
                    value="Fasteners"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhóm ốc vít
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InputField
              label="Tuổi thọ linh kiện"
              placeholder="VD: 6 tháng"
              value={lifespan}
              onChange={setLifespan}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Mức chịu nhiệt</p>
              <Select
                value={heatResistance}
                onValueChange={(value) => setHeatResistance(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Low"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức thấp (0°C → 70°C)
                  </SelectItem>
                  <SelectItem
                    value="Medium"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức trung bình (-20°C → 120°C)
                  </SelectItem>
                  <SelectItem
                    value="High"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức cao (-40°C → 180°C)
                  </SelectItem>
                  <SelectItem
                    value="Extreme"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức rất cao (-50°C → 300°C)
                  </SelectItem>
                  <SelectItem
                    value="Ultra"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mức siêu cao (500°C → 800°C)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Dòng xe"
              placeholder="VD: sedan, SUV,..."
              value={vehicleModel}
              onChange={setVehicleModel}
            />
            <InputField
              label="Nhà sản xuất"
              placeholder="VD: Honda, Ford,..."
              value={manufacturer}
              onChange={setManufacturer}
            />

            <InputField
              label="Độ tương thích"
              placeholder="VD: VinFast VF9, KIA K3,..."
              value={compatibility}
              onChange={setCompatibility}
            />
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Tiêu chuẩn chất lỏng"
              placeholder="VD: SAE 0W-20,..."
              value={fluidSpec}
              onChange={setFluidSpec}
            />
            <InputField
              label="Chất liệu"
              placeholder="VD: nhựa, thép,..."
              value={material}
              onChange={setMaterial}
            />

            <InputField
              label="Hạn bảo trì"
              placeholder="VD: 6 tháng"
              type="number"
              value={maintenanceCycle}
              onChange={setMaintenanceCycle}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="!flex-row !justify-between !items-center mt-5">
        <p className="w-fit text-[22px] font-vegan text-textsec drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <span className="text-[#fb923c]/70 drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]">
            U
          </span>
          neti{" "}
          <span className="text-[#fb923c]/70 drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]">
            A
          </span>
          utomotive
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
                ? "bg-[#fb923c] text-black hover:bg-[#fca86b] cursor-pointer"
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

export default AddAutomotive;
