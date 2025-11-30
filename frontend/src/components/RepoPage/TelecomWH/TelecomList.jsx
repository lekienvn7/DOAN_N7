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
import TelecomDetail from "./TelecomDetail";
import TelecomEdit from "./TelecomEdit";

const TelecomList = ({ mode, reload, searchData, sortMode }) => {
  const [telecom, setTelecom] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = (searchData || "").toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortMaintenance, setSortMaintenance] = useState("");
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchTelecom = async () => {
        try {
          const res = await axiosClient.get("/repository/material/telecom");
          if (res.data.success) {
            setTelecom([...res.data.materials]);
            setFilterData([...res.data.materials]);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTelecom();
    }, 600);

    return () => clearTimeout(timer);
  }, [reload]);

  useEffect(() => {
    const filtered = telecom.filter((item) =>
      keywords.every((k) => item.name?.toLowerCase().includes(k))
    );

    setFilterData(filtered);
  }, [searchData, telecom]);

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
    setSortMaintenance(null);

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
    setSortMaintenance(null);

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

  const toggleSortMaintenance = () => {
    setSortName(null);
    setSortQuantity(null);

    setSortMaintenance((prev) => {
      if (!prev) return "asc";
      if (prev === "asc") return "desc";
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

  const labelTooltipMaintenance =
    sortMaintenance === "asc"
      ? "Giảm dần"
      : sortMaintenance === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const iconSortName =
    sortName === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#ff3434]
hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#ff3434]
hover:text-[#ffffffcc] no-outline cursor-pointer"
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
        className="text-[#ff3434]
hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#ff3434]
hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    );

  const iconSortMaintenance =
    sortMaintenance === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#ff3434]
hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortMaintenance}
      />
    ) : sortMaintenance === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#ff3434]
hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortMaintenance}
      />
    ) : (
      <ClockArrowDown
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortMaintenance}
      />
    );

  useEffect(() => {
    const filtered = telecom.filter((item) =>
      keywords.every((k) => item.name?.toLowerCase().includes(k))
    );

    if (!sortMode) {
      setSortName(null);
      setSortQuantity(null);
      setSortMaintenance(null);

      setFilterData(filtered);
      return;
    }

    if (!sortName && !sortQuantity && !sortMaintenance) {
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
    if (sortMaintenance) {
      sorted.sort((a, b) => {
        if (a.maintenanceCycle == null) return 1;
        if (b.maintenanceCycle == null) return -1;

        if (sortMaintenance === "asc")
          return (
            (a.maintenanceCycle ?? Infinity) - (b.maintenanceCycle ?? Infinity)
          );
        if (sortMaintenance === "desc")
          return (
            (b.maintenanceCycle ?? Infinity) - (a.maintenanceCycle ?? Infinity)
          );
      });
    }

    setFilterData(sorted);
  }, [sortName, sortQuantity, sortMaintenance, sortMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div
          className="w-10 h-10 border-4 border-[#ff3434]
 border-t-transparent rounded-full animate-spin"
        ></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-[#ff3434] border-collapse">
        <thead className="sticky top-0 z-10 border-b border-gray-700 bg-[#150404]">
          <tr className="text-left p-[5px] text-[14px] font-semibold">
            <th className="text-center p-[5px] w-[3%]">STT</th>
            <th className="p-[5px] w-[16%]">
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
            <th className="p-[5px] w-[8%]">
              {" "}
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Hạn bảo trì</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipMaintenance}
                  >
                    {iconSortMaintenance}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th className="p-[5px] w-[8%]">Ngày thêm </th>
            <th className="p-[5px] w-[8%] ">Tần số</th>
            <th className="p-[5px] w-[8%]">Loại tín hiệu</th>
            <th className="p-[5px] w-[8%]">Băng thông</th>
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
                <td className={`text-left p-[5px]`}>
                  {item.frequency ? `${item.frequency} GHz` : "—"}
                </td>
                <td className={`text-left p-[5px] `}>
                  {highlightText(
                    item.signalType ? item.signalType : "—",
                    searchData
                  )}
                </td>
                <td className={`text-left p-[5px] `}>
                  {item.bandwidth ? `${item.bandwidth} MHz` : "—"}
                </td>
                <td className=" text-center p-[5px]">
                  {mode === "view" ? (
                    <TelecomDetail item={item} />
                  ) : (
                    <TelecomEdit item={item} reload={reload} />
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

export default TelecomList;
