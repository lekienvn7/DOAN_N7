import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownAZ,
  ChevronUp,
  ChevronDown,
  ArrowDown01,
  ClockArrowDown,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import MechanicalDetail from "./MechanicalDetail";
import MechanicalEdit from "./MechanicalEdit";

const MechanicalList = ({ mode, reload, searchData, sortMode }) => {
  const [mechanical, setMechanical] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = (searchData || "").toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchIot = async () => {
        try {
          const res = await axiosClient.get("/repository/material/mechanical");
          if (res.data.success) {
            setMechanical([...res.data.materials]);
            setFilterData([...res.data.materials]);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIot();
    }, 600);

    return () => clearTimeout(timer);
  }, [reload]);

  const heatList = [
    { type: "Thấp", name: "Thấp: < 150°C", num: 1 },
    { type: "Trung bình", name: "Trung bình: 150–350°C", num: 2 },
    { type: "Cao", name: "Cao: 350–600°C", num: 3 },
    { type: "Siêu cao", name: "Thấp: < 150°C", num: 4 },
  ];

  const heatColor = (item) => {
    if (item.heatResistance === "Thấp") return "text-[#f87171]";
    else if (item.heatResistance === "Trung bình") return "text-[#fb923c]";
    else if (item.heatResistance === "Cao") return "text-[#eab308]";
    else return "text-[#22c55e]";
  };

  const corrosionColor = (item) => {
    if (item.corrosionResistance === "Thấp") return "text-[#f87171]";
    else if (item.corrosionResistance === "Trung bình") return "text-[#fb923c]";
    else if (item.corrosionResistance === "Cao") return "text-[#eab308]";
    else return "text-[#22c55e]";
  };

  useEffect(() => {
    const filtered = mechanical.filter((item) =>
      keywords.every((k) => item.name?.toLowerCase().includes(k))
    );

    setFilterData(filtered);
  }, [searchData, mechanical]);

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
      <ChevronUp
        size={18}
        className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : (
      <ArrowDownAZ
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    );

  const iconSortQuantity =
    sortQuantity === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    );

  useEffect(() => {
    const filtered = mechanical.filter((item) =>
      keywords.every((k) => item.name?.toLowerCase().includes(k))
    );

    if (!sortMode) {
      setSortName(null);
      setSortQuantity(null);

      setFilterData(filtered);
      return;
    }

    if (!sortName && !sortQuantity) {
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
  }, [sortName, sortQuantity, sortMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div
          className="w-10 h-10 border-4 border-[#e6eef2]
[border-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] border-t-transparent rounded-full animate-spin"
        ></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table
        className="w-full text-[#e6eef2]
[text-shadow:0_0_1px_rgba(230,238,242,0.7),0_0_3px_rgba(230,238,242,0.5),0_0_5px_rgba(230,238,242,0.3)] border-collapse"
      >
        <thead className="sticky top-0 z-10 border-b border-gray-700 bg-[#111111]">
          <tr className="text-left p-[5px] text-[14px] font-semibold">
            <th className="text-center p-[5px] w-[3%]">STT</th>
            <th className="p-[5px] w-[14%]">
              <motion.div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
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
              </motion.div>
            </th>
            <th className="p-[5px] w-[7%]">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
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
            <th className="p-[5px] w-[5%]">Đơn vị</th>
            <th className="p-[5px] w-[8%]">Trọng lượng</th>
            <th className="p-[5px] w-[8%]">Hạn bảo trì</th>
            <th className="p-[5px] w-[8%] ">Ngày thêm</th>
            <th className="p-[5px] w-[10%]">Khả năng chịu nhiệt</th>
            <th className="p-[5px] w-[8%]">Chống ăn mòn</th>
            <th colSpan={2} className="text-center w-[5%]">
              {mode === "view" ? "Chi tiết" : "Chỉnh sửa"}
            </th>
          </tr>
        </thead>

        <tbody>
          {filterData.map((item, index) => {
            return (
              <tr className=" text-center text-[14px] odd:bg-[#111111] even:bg-[#0d0d0d] hover:bg-[#1a1a1a] text-[#e5e5e7] ">
                <td className=" p-[5px]">{index + 1}</td>
                <td className="text-left  p-[5px]">
                  {highlightText(item.name, searchData)}
                </td>
                <td className=" text-left p-[5px]">{item.quantity}</td>

                <td className=" text-left p-[5px]">{item.unit}</td>
                <td className=" text-left p-[5px]">
                  {item.weight ? `${item.weight} kg` : "—"}
                </td>
                <td className=" text-left p-[5px]">
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
                <td className=" text-left p-[5px]">
                  {formatDate(item.createdAt)}
                </td>
                <td className={`text-left p-[5px] ${heatColor(item)}`}>
                  {highlightText(
                    item.heatResistance
                      ? `${
                          heatList.find(
                            (prev) => prev.type === item.heatResistance
                          )?.name
                        }`
                      : "—",
                    searchData
                  )}
                </td>
                <td className={`text-left p-[5px] ${corrosionColor(item)}`}>
                  {item.corrosionResistance ? item.corrosionResistance : "—"}
                </td>
                <td className=" text-center p-[5px]">
                  {mode === "view" ? (
                    <MechanicalDetail item={item} />
                  ) : (
                    <MechanicalEdit item={item} reload={reload} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MechanicalList;
