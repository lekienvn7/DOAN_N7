import React from "react";
import { useState, useEffect } from "react";
import { ReceiptText } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import ElectricDetail from "./ElectricDetail";
import ElectricEdit from "./ElectricEdit";

const ElectricList = ({ mode, reload, searchData }) => {
  const [open, setOpen] = useState(false);
  const [selectMaterial, setSelectMaterial] = useState(null);

  const { user } = useAuth();

  const [electrical, setElectrical] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = searchData.toLowerCase().trim().split(/\s+/);

  useEffect(() => {
    const fetchElectrical = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/repository/material/electric");
        if (res.data.success) {
          setElectrical([...res.data.materials]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchElectrical();
  }, [reload]);

  const filterData = electrical.filter((item) => {
    return keywords.every((k) => item.name.toLowerCase().includes(k));
  });

  const highlightText = (text, searchData) => {
    if (!searchData.trim()) return text;

    // Tách nhiều từ khóa: dây điện cadivi → ["dây","điện","cadivi"]
    const keywords = searchData.toLowerCase().trim().split(/\s+/);

    // Tạo regex highlight nhiều từ cùng lúc (không phân biệt hoa thường)
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");

    // Tách text, mỗi match sẽ nằm trong array
    return text.split(regex).map((part, index) => {
      if (keywords.includes(part.toLowerCase())) {
        return (
          <span key={index} className="text-highlightcl font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getNextMaintenanceDate = (startDate, months) => {
    if (!startDate || !months) return null;

    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const getDaysLeft = (targetDate) => {
    if (!targetDate) return null;

    const today = new Date();
    const diff = targetDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="electric w-full text-[#fdd700] border-collapse">
        <thead className="sticky top-0 z-10 border-b border-gray-700 bg-[#1e1b11]">
          <tr className="text-center text-[14px] font-semibold">
            <th className="py-[5px] w-[3%]">STT</th>
            <th className=" w-[15%]">Tên thiết bị/vật tư</th>
            <th className="w-[5%]">Số lượng</th>
            <th className="w-[5%]">Đơn vị</th>
            <th className="w-[8%]">Hạn bảo trì</th>
            <th className="w-[5%]">Ngày thêm</th>
            <th className="w-[5%] ">Điện áp</th>
            <th className="w-[10%]">Công suất định mức</th>
            <th className="w-[10%]">Dòng điện định mức</th>
            <th colSpan={2} className="w-[5%]">
              {mode === "view" ? "Chi tiết" : "Chỉnh sửa"}
            </th>
          </tr>
        </thead>

        <tbody>
          {filterData.map((item, index) => (
            <tr className=" text-center text-[14px] odd:bg-[#111111] even:bg-[#0d0d0d] hover:bg-[#1a1a1a] text-[#e5e5e7] ">
              <td className=" p-[5px]">{index + 1}</td>
              <td className="text-left  p-[5px]">
                {highlightText(item.name, searchData)}
              </td>
              <td className=" p-[5px]">{item.quantity}</td>
              <td className=" p-[5px]">{item.unit}</td>
              <td className=" p-[5px]">
                {item.maintenanceCycle
                  ? (() => {
                      const nextDate = getNextMaintenanceDate(
                        item.createdAt,
                        item.maintenanceCycle
                      );
                      const daysLeft = getDaysLeft(nextDate);

                      return (
                        <span
                          className={`${
                            daysLeft <= 7 ? "text-red-500" : "text-textpri"
                          } `}
                        >
                          {daysLeft <= 7
                            ? `Còn ${daysLeft} ngày`
                            : formatDate(nextDate)}
                        </span>
                      );
                    })()
                  : "—"}
              </td>
              <td className=" p-[5px]">{formatDate(item.createdAt)}</td>
              <td className=" p-[5px]">
                {item.voltageRange ? `${item.voltageRange}V` : "—"}
              </td>
              <td className=" p-[5px]">
                {item.power ? `${item.power}W` : "—"}
              </td>
              <td className=" p-[5px]">
                {item.current ? `${item.current}A` : "—"}
              </td>
              <td className=" text-center p-[5px]">
                {mode === "view" ? (
                  <ElectricDetail item={item} />
                ) : (
                  <ElectricEdit item={item} reload={reload} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectricList;
