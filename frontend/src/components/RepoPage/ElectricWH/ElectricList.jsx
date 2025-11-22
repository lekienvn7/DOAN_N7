import React from "react";
import { useState, useEffect } from "react";
import {
  ArrowDownUp,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDown01,
  ArrowUp01,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import ElectricDetail from "./ElectricDetail";
import ElectricEdit from "./ElectricEdit";

const ElectricList = ({ mode, reload, searchData, sortMode }) => {
  const [electrical, setElectrical] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = searchData.toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchElectrical = async () => {
        try {
          const res = await axiosClient.get("/repository/material/electric");
          if (res.data.success) {
            setElectrical([...res.data.materials]);
            setFilterData([...res.data.materials]);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        } finally {
          setLoading(false);
        }
      };
      fetchElectrical();
    }, 400);

    return () => clearTimeout(timer);
  }, [reload]);

  useEffect(() => {
    const filtered = electrical.filter((item) =>
      keywords.every((k) => item.name.toLowerCase().includes(k))
    );

    setFilterData(filtered);
  }, [searchData, electrical]);

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

  const toggleSortName = () => {
    setSortQuantity(null);
    setSortName((prev) => {
      if (prev === null) {
        return "asc";
      }
      if (prev === "asc") {
        return "desc";
      }
      return null;
    });
  };

  const toggleSortQuantity = () => {
    setSortName(null);
    setSortQuantity((prev) => {
      if (prev === null) {
        return "asc";
      }
      if (prev === "asc") {
        return "desc";
      }
      return null;
    });
  };

  const labelTooltipName =
    sortName === "asc"
      ? "z → a"
      : sortName === "desc"
      ? "Danh sách gốc"
      : "a → z";

  const labelTooltipQuantity =
    sortQuantity === "asc"
      ? "Giảm dần"
      : sortQuantity === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const iconSortName =
    sortName === "asc" ? (
      <ArrowDownAZ
        size={18}
        className="text-textpri hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ArrowUpAZ
        size={18}
        className="text-textpri hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : (
      <ArrowDownUp
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    );

  const iconSortQuantity =
    sortQuantity === "asc" ? (
      <ArrowDown01
        size={18}
        className="text-textpri hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ArrowUp01
        size={18}
        className="text-textpri hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : (
      <ArrowDownUp
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    );

  useEffect(() => {
    if (sortName === null && sortQuantity === null) {
      // reset về danh sách theo search
      const filtered = electrical.filter((item) =>
        keywords.every((k) => item.name.toLowerCase().includes(k))
      );
      setFilterData(filtered);
      return;
    }

    const sorted = [...filterData];
    if (sortName) {
      sorted.sort((a, b) => {
        if (sortName === "asc") return a.name.localeCompare(b.name, "vi");
        if (sortName === "desc") return b.name.localeCompare(a.name, "vi");
      });
    }
    if (sortQuantity) {
      sorted.sort((a, b) => {
        if (sortQuantity === "asc") return a.quantity - b.quantity;
        if (sortQuantity === "desc") return b.quantity - a.quantity;
      });
    }

    setFilterData(sorted);
  }, [sortName, sortQuantity]);

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
            <th className=" w-[15%]">
              <div
                className={`${
                  sortMode
                    ? "flex flex-row justify-center gap-[20px] items-center"
                    : ""
                }`}
              >
                <p>Tên thiết bị/vật tư</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipName}
                  >
                    {iconSortName}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th className="w-[5%]">
              <div
                className={`${
                  sortMode
                    ? "flex flex-row justify-center gap-[5px] items-center"
                    : ""
                }`}
              >
                <p>Số lượng</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipQuantity}
                  >
                    {iconSortQuantity}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
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
