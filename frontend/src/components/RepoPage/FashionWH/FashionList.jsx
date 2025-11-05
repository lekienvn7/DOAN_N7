import React from "react";
import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { PencilLine, Trash2 } from "lucide-react";

const FashionList = () => {
  const [fashion, setFashion] = useState([]);
  useEffect(() => {
    const fetchFashion = async () => {
      try {
        const res = await axiosClient.get("/repository/material/fashion");
        if (res.data.success) {
          setFashion(res.data.materials);
        }
      } catch (error) {
        console.error("Lỗi kết nối dữ liệu!", error);
      }
    };
    fetchFashion();
  }, []);

  return (
    <div className="w-full">
      <table className="w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#caa93e]/60 bg-bgmain">
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
            <th className="relative w-[12%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Chất liệu
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Màu
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Xuất xứ
            </th>
            <th colSpan={2} className=" w-[5%] ">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody>
          {fashion.map((item, index) => (
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
                {item.material}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.color}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.origin}
              </td>
              <td className="border-r-1 border-textsec text-center p-[5px]">
                <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                  <PencilLine size={15} />
                </button>
              </td>
              <td className="text-center p-[5px]">
                <button className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]">
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

export default FashionList;
