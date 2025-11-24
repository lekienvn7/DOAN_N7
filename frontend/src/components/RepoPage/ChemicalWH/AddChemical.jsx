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

const AddChemical = ({ onReload }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [materialID, setMaterialID] = useState("");

  const [chemicalFormula, setChemicalFormula] = useState("");
  const [concentration, setConcentration] = useState("");
  const [hazardLevel, setHazardLevel] = useState("");
  const [storageTemperature, setStorageTemperature] = useState("");
  const [boilingPoint, setBoilingPoint] = useState("");
  const [meltingPoint, setMeltingPoint] = useState("");
  const [molarMass, setMolarMass] = useState("");
  const [phLevel, setPhLevel] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [flammability, setFlammability] = useState("");
  const [toxicity, setToxicity] = useState("");
  const [safetyNote, setSafetyNote] = useState("");
  const [casNumber, setCasNumber] = useState("");

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

        chemicalFormula,
        concentration,
        hazardLevel,
        storageTemperature,
        boilingPoint,
        meltingPoint,
        molarMass,
        phLevel,
        expiryDate,
        flammability,
        toxicity,
        safetyNote,
        casNumber,

        type: "chemical", // cố định là “electric”
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

        setChemicalFormula("");
        setConcentration("");
        setHazardLevel("");
        setStorageTemperature("");
        setBoilingPoint("");
        setMeltingPoint("");
        setMolarMass("");
        setPhLevel("");
        setExpiryDate("");
        setFlammability("");
        setToxicity("");
        setSafetyNote("");
        setCasNumber("");

        const materialID = res.data.data.materialID; // lấy ID vừa tạo

        // Sau 3 giây tự thêm vào kho điện
        setTimeout(async () => {
          try {
            setLoading(true);
            const repoRes = await axiosClient.put(`/repository/chemical`, {
              materials: [{ material: materialID, quantity: Number(quantity) }],
            });

            if (repoRes.data.success) {
              toast.success(
                `Vật tư ${materialID} đã được thêm vào kho hóa chất!`
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

          <div className="flex flex-row gap-[20px] items-center">
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
                className="w-[420px] py-[5px] px-[10px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder:text-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Công thức hóa học"
              placeholder="VD: HCL, H2SO4..."
              value={chemicalFormula}
              onChange={setChemicalFormula}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Hướng dẫn an toàn:</p>
              <input
                value={safetyNote}
                onChange={(e) => setSafetyNote(e.target.value)}
                placeholder="Hướng dẫn sử dụng an toàn..."
                className="w-[420px] py-[5px] px-[10px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       placeholder:text-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Nồng độ"
              placeholder="Nồng độ %"
              value={concentration}
              onChange={setConcentration}
            />

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Nhiệt độ bảo quản</p>
              <Select
                value={storageTemperature}
                onValueChange={(value) => setStorageTemperature(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="Room Temperature"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nhiệt độ phòng (15°C – 25°C)
                  </SelectItem>
                  <SelectItem
                    value="Cool"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Mát (8°C – 15°C)
                  </SelectItem>
                  <SelectItem
                    value="Refrigerated"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Lạnh (2°C – 8°C)
                  </SelectItem>
                  <SelectItem
                    value="Frozen"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Đông lạnh (–10°C đến –20°C)
                  </SelectItem>
                  <SelectItem
                    value="Deep Freezing"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Siêu lạnh (–70°C đến –80°C)
                  </SelectItem>
                  <SelectItem
                    value="Cryogenic"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nitơ lỏng (≈ –196°C)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-[5px] items-left">
              <p className="ml-[10px]">Mức độ nguy hiểm</p>
              <Select
                value={hazardLevel}
                onValueChange={(value) => setHazardLevel(value)}
              >
                <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                  <SelectValue placeholder="-- Chọn --" />
                </SelectTrigger>

                <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                  <SelectItem
                    value="low"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Không nguy hiểm (Low Hazard)
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nguy hiểm trung bình (Moderate Hazard)
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Nguy hiểm cao (High Hazard)
                  </SelectItem>
                  <SelectItem
                    value="extreme"
                    className="cursor-pointer hover:bg-highlightcl"
                  >
                    Cực kỳ nguy hiểm (Extreme Hazard)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-[20px] items-center">
            <InputField
              label="Điểm sôi"
              placeholder="VD: 50°C"
              value={boilingPoint}
              onChange={setBoilingPoint}
            />

            <InputField
              label="Điểm nóng chảy / đông"
              placeholder="VD: 200°C"
              value={meltingPoint}
              onChange={setMeltingPoint}
            />

            <InputField
              label="Khối lượng mol"
              placeholder="VD: 2 g/mol"
              value={molarMass}
              onChange={setMolarMass}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <InputField
            label="Độ pH"
            placeholder="Độ pH"
            value={phLevel}
            onChange={setPhLevel}
          />

          <InputField
            label="Hạn sử dụng"
            placeholder="VD: 4 tháng"
            value={expiryDate}
            onChange={setExpiryDate}
          />

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Tính dễ cháy</p>
            <Select
              value={flammability}
              onValueChange={(value) => setFlammability(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="Extremely Flammable"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 1 — Cực kỳ dễ cháy
                </SelectItem>
                <SelectItem
                  value="Highly Flammable"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 2 — Rất dễ cháy
                </SelectItem>
                <SelectItem
                  value="Flammable"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 3 — Dễ cháy
                </SelectItem>
                <SelectItem
                  value="Combustible"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 4 — Ít dễ cháy
                </SelectItem>
                <SelectItem
                  value="Không dễ cháy"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Không dễ cháy
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-[5px] items-left">
            <p className="ml-[10px]">Độc tính</p>
            <Select
              value={toxicity}
              onValueChange={(value) => setToxicity(value)}
            >
              <SelectTrigger className="bg-[#2c2c2e] border border-[#5E5E60] text-white w-[200px] rounded-[12px] cursor-pointer">
                <SelectValue placeholder="-- Chọn --" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] text-white border border-gray-700 rounded-[12px]">
                <SelectItem
                  value="Fatal Toxicity"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 1 — Cực độc
                </SelectItem>
                <SelectItem
                  value="Severe Toxicity"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 2 — Rất độc
                </SelectItem>
                <SelectItem
                  value="Toxic"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 3 — Độc
                </SelectItem>
                <SelectItem
                  value="Harmful"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Mức 4 — Độc nhẹ / cảnh báo
                </SelectItem>
                <SelectItem
                  value="Ít độc / gần như không độc"
                  className="cursor-pointer hover:bg-highlightcl"
                >
                  Ít độc / gần như không độc
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <InputField
            label="Số CAS"
            placeholder="Định danh hoá chất QT"
            value={casNumber}
            onChange={setCasNumber}
          />
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
      className={`w-[${width}] px-[10px] py-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200`}
    />
  </div>
);

export default AddChemical;
