import React from "react";
import { useState, useEffect } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const ElectricList = () => {
  const { user } = useAuth();
  const checkPermission = (callback) => {
    const hasAccess =
      user?.yourRepo?.includes("all") || user?.yourRepo?.includes("electric");

    if (!hasAccess) {
      toast.error("Không có quyền sử dụng chức năng!");
      return;
    }

    callback();
  };
  const [electrical, setElectrical] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchElectrical = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/repository/material/electric");
        if (res.data.success) {
          setElectrical(res.data.materials);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      }
    };
    fetchElectrical();
  }, []);

  return (
    <div className="w-full">
      <table className="w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#caa93e]/60 bg-bgmain">
          <tr className="text-center text-[14px] font-semibold">
            <th className="relative py-[5px] w-[3%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              STT
            </th>
            <th className="relative w-[15%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Tên thiết bị/vật tư
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Số lượng
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Đơn vị
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Hạn bảo trì
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Ngày thêm
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Điện áp
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Công suất định mức
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Cách điện?
            </th>
            <th colSpan={2} className=" w-[5%] ">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody>
          {electrical.map((item, index) => (
            <tr className="border-b-1 border-gray-500 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
              <td className="border-r-1 border-textsec p-[5px]">{index + 1}</td>
              <td className="border-r-1 border-textsec p-[5px]">{item.name}</td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.quantity}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">{item.unit}</td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.maintenanceCycle}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.createdAt}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.voltageRange}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.power}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.materialInsulation}
              </td>
              <td className="border-r-1 border-textsec text-center p-[5px]">
                <button
                  onClick={() => checkPermission()}
                  className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]"
                >
                  <PencilLine size={15} />
                </button>
              </td>
              <td className="text-center p-[5px]">
                <button
                  onClick={() => checkPermission()}
                  className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectricList;
