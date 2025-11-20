import React from "react";
import { useState, useEffect } from "react";
import { ReceiptText } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import ElectricDetail from "./ElectricDetail";
import ElectricEdit from "./ElectricEdit";
const ElectricList = ({ mode, reload }) => {
  const [open, setOpen] = useState(false);
  const [selectMaterial, setSelectMaterial] = useState(null);

  const { user } = useAuth();

  const checkPermission = () => {
    const hasAccess =
      user?.yourRepo?.includes("all") || user?.yourRepo?.includes("electric");

    if (!hasAccess) {
      toast.error("Không có quyền sử dụng chức năng!");
      return false;
    }

    return true;
  };

  const [electrical, setElectrical] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="electric w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#fdd700] bg-bgmain">
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
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Ngày thêm
            </th>
            <th className="relative w-[5%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Điện áp
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Công suất định mức
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Dòng điện định mức
            </th>
            <th colSpan={2} className="w-[5%]">
              {mode === "view" ? "Chi tiết" : "Chỉnh sửa"}
            </th>
          </tr>
        </thead>

        <tbody>
          {electrical.map((item, index) => (
            <tr className="border-b-1 border-gray-500 text-center text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
              <td className="border-r-1 border-textsec p-[5px]">{index + 1}</td>
              <td className="text-left border-r-1 border-textsec p-[5px]">
                {item.name}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.quantity}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">{item.unit}</td>
              <td className="border-r-1 border-textsec p-[5px]">
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
              <td className="border-r-1 border-textsec p-[5px]">
                {formatDate(item.createdAt)}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.voltageRange ? `${item.voltageRange}V` : "—"}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
                {item.power ? `${item.power}W` : "—"}
              </td>
              <td className="border-r-1 border-textsec p-[5px]">
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
