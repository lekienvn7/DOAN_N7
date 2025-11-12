import React, { useState } from "react";
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
  const [materialName, setMaterialName] = useState("");
  const [maintenanceCycle, setMaintenanceCycle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [voltageRange, setVoltageRange] = useState("");
  const [power, setPower] = useState("");
  const [materialInsulation, setMaterialInsulation] = useState("");

  const { user } = useAuth(); // lấy thông tin người dùng đăng nhập
  const createdBy = user?.userID || "unknown"; // fallback nếu chưa có
  const [loading, setLoading] = useState(false);

  // Kiểm tra hợp lệ
  const isValid =
    materialName.trim() !== "" &&
    maintenanceCycle !== "" &&
    !isNaN(maintenanceCycle) &&
    Number(maintenanceCycle) >= 0 &&
    quantity !== "" &&
    !isNaN(quantity) &&
    Number(quantity) >= 0 &&
    unit.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Vui lòng nhập đầy đủ và hợp lệ các thông tin bắt buộc!");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/material", {
        name: materialName,
        maintenanceCycle,
        quantity,
        unit,
        description,
        voltageRange,
        power,
        materialInsulation,
        type: "electric", // cố định là “electric”
        createdBy, // lấy id người nhập từ context
        statusMaterial: "Trong kho", // mặc định “Trong kho”
      });

      if (res.data.success) {
        toast.success("Thêm vật tư thành công!");
        // Reset form
        setMaterialName("");
        setMaintenanceCycle("");
        setQuantity("");
        setUnit("");
        setDescription("");
        setVoltageRange("");
        setPower("");
        setMaterialInsulation("");

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
              setTimeout(() => window.location.reload(), 1000);
            } else {
              toast.error("Không thể thêm vào kho: " + repoRes.data.message);
            }
          } catch (err) {
            console.error("Lỗi thêm vào kho:", err);
            toast.error("Không thể kết nối máy chủ khi thêm vào kho!");
          } finally {
            setLoading(false);
          }
        }, 2000);
      } else {
        toast.error(res.data.message || "Thêm vật tư thất bại!");
      }
    } catch (error) {
      console.error("Lỗi thêm vật tư:", error);
      toast.error("Lỗi kết nối hoặc máy chủ không phản hồi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-[20px] justify-center text-textpri">
        <div className="flex flex-row gap-[10px] items-center">
          <InputField
            label="Tên vật tư"
            placeholder="Tên vật tư"
            value={materialName}
            onChange={setMaterialName}
          />
          <InputField
            label="Hạn bảo trì"
            placeholder="Số tháng"
            type="number"
            value={maintenanceCycle}
            onChange={setMaintenanceCycle}
          />
          <InputField
            label="Số lượng"
            placeholder="Số lượng"
            type="number"
            value={quantity}
            onChange={setQuantity}
          />
        </div>

        <div className="flex flex-row gap-[10px] items-center">
          <InputField
            label="Đơn vị"
            placeholder="VD: cái, mét..."
            value={unit}
            onChange={setUnit}
          />
          <InputField
            label="Mô tả (tuỳ chọn)"
            placeholder="Ghi chú thêm"
            value={description}
            onChange={setDescription}
            width="310px"
          />
        </div>

        <div className="flex flex-row gap-[10px] items-center">
          <InputField
            label="Điện áp (V)"
            placeholder="VD: 220"
            type="number"
            value={voltageRange}
            onChange={setVoltageRange}
          />
          <InputField
            label="Công suất (W)"
            placeholder="VD: 60"
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
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[150px] rounded-[12px] cursor-pointer">
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
  width = "150px",
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
