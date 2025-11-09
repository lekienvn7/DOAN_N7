import React from "react";
import { useState, useEffect } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const MechanicalList = () => {
  const [mechanical, setMechanical] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const checkPermission = (callback) => {
    const hasAccess =
      user?.yourRepo?.includes("all") || user?.yourRepo?.includes("mechanical");

    if (!hasAccess) {
      toast.error("Không có quyền sử dụng chức năng!");
      return;
    }

    callback();
  };

  useEffect(() => {
    const fetchMechanical = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/repository/material/mechanical");

        if (res.data.success) {
          setMechanical(res.data.materials);
        }
      } catch (error) {
        console.error("Lỗi kết nối dữ liệu!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMechanical();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#fdd700]/60 bg-bgmain">
          <tr className="text-center text-[14px] font-semibold">
            <th className="relative py-[5px] w-[3%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              STT
            </th>
            <th className="relative w-[12%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
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
            <th className="relative w-[15%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Ngày thêm
            </th>
            <th className="relative w-[15%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Loại vật liệu
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Cân nặng
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Phủ chống rỉ
            </th>
            <th colSpan={2} className=" w-[5%] ">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody>
          {mechanical.map((item, index) => (
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
                {item.metalType}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.weight}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.coating}
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

export default MechanicalList;
