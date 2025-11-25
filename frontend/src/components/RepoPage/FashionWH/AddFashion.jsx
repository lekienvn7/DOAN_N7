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

const AddFashion = ({ onReload }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");

  const [fabricType, setFabricType] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [pattern, setPattern] = useState("");
  const [elasticity, setElasticity] = useState("");
  const [origin, setOrigin] = useState("");
  const [washInstruction, setWashInstruction] = useState("");
  const [durability, setDurability] = useState("");

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
        materialID,

        fabricType,
        color,
        size,
        pattern,
        elasticity,
        origin,
        washInstruction,
        durability,

        type: "fashion", // cố định là “electric”
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

        setFabricType("");
        setColor("");
        setSize("");
        setPattern("");
        setElasticity("");
        setOrigin("");
        setWashInstruction("");
        setDurability("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/fashion`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho thời trang!`
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
            <div className="text-[#f472b6]">
              <InputField
                label="Tên vật tư"
                placeholder="Tên vật tư"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="text-[#f472b6]">
              <InputField
                label="Mã vật tư"
                placeholder="VD: VT001"
                type="text"
                value={materialID}
                onChange={setMaterialID}
              />
            </div>
            <div className="text-[#f472b6]">
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
            <div className="text-[#f472b6]">
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
              label="Loại vải"
              placeholder="VD: Cotton 100%, Polyester..."
              value={fabricType}
              onChange={setFabricType}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Hướng dẫn giặt:</p>
              <input
                value={washInstruction}
                onChange={(e) => setWashInstruction(e.target.value)}
                placeholder="Hướng dẫn giặt"
                className="w-[420px] py-[5px] px-[10px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder:text-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Kích cỡ"
              placeholder="VD: M, XL,..."
              value={size}
              onChange={setSize}
            />

            <InputField
              label="Họa tiết / hoa văn"
              placeholder="VD: trơn, kẻ sọc,..."
              value={pattern}
              onChange={setPattern}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Độ co giãn</p>
              <Select
                value={elasticity}
                onValueChange={(value) => setElasticity(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="No"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Không co giãn
                  </SelectItem>
                  <SelectItem
                    value="low"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Co giãn nhẹ
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Co giãn 2 chiều
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Co giãn 4 chiều (spandex)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Xuất xứ"
              placeholder="VD: Việt Nam, Pháp,..."
              value={origin}
              onChange={setOrigin}
            />

            <InputField
              label="Màu sắc"
              placeholder="VD: Xanh navy, hồng,..."
              value={color}
              onChange={setColor}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Độ bền</p>
              <Select
                value={durability}
                onValueChange={(value) => setDurability(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="high"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Bền cao (dùng lâu, ít xù lông)
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Trung bình
                  </SelectItem>
                  <SelectItem
                    value="low"
                    className="cursor-pointer hover:bg-[#f472b6]"
                  >
                    Dễ hỏng (vải mềm, mỏng)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="!flex-row !justify-between !items-center mt-5">
        <p className="w-fit text-[22px] font-vegan text-textsec drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <span className="text-[#f472b6]/70 drop-shadow-[0_0_14px_rgba(244,114,182,1)]">
            U
          </span>
          neti{" "}
          <span className="text-[#f472b6]/70 drop-shadow-[0_0_14px_rgba(244,114,182,1)]">
            F
          </span>
          ashion
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
                ? "bg-[#f472b6] text-black hover:bg-[#fa8dc6] cursor-pointer"
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

export default AddFashion;
