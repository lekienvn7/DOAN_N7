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
import ElectricDetail from "./ElectricDetail";
import ElectricEdit from "./ElectricEdit";

const ElectricList = ({ mode, reload, searchData, sortMode, onReload }) => {
  const [electrical, setElectrical] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = searchData.toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortMaintenance, setSortMaintenance] = useState(null);
  const [sortPower, setSortPower] = useState(null);
  const [sortCurrent, setSortCurrent] = useState(null);
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
    }, 600);

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

  const toggleSortMaintenance = () => {
    setSortName(null);
    setSortQuantity(null);

    setSortMaintenance((prev) => {
      if (!prev) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const toggleSortPower = () => {
    setSortName(null);
    setSortQuantity(null);
    setSortMaintenance(null);

    setSortPower((prev) => {
      if (!prev) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const toggleSortCurrent = () => {
    setSortName(null);
    setSortQuantity(null);
    setSortMaintenance(null);
    setSortPower(null);

    setSortCurrent((prev) => {
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

  const labelTooltipPower =
    sortPower === "asc"
      ? "Giảm dần"
      : sortPower === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const labelTooltipCurrent =
    sortCurrent === "asc"
      ? "Giảm dần"
      : sortCurrent === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const iconSortName =
    sortName === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
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
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
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
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortMaintenance}
      />
    ) : sortMaintenance === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortMaintenance}
      />
    ) : (
      <ClockArrowDown
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortMaintenance}
      />
    );

  const iconSortPower =
    sortPower === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortPower}
      />
    ) : sortPower === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortPower}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortPower}
      />
    );

  const iconSortCurrent =
    sortCurrent === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortCurrent}
      />
    ) : sortCurrent === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#fdd700] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortCurrent}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortCurrent}
      />
    );

  useEffect(() => {
    const filtered = electrical.filter((item) =>
      keywords.every((k) => item.name.toLowerCase().includes(k))
    );

    if (!sortMode) {
      setSortName(null);
      setSortQuantity(null);
      setSortMaintenance(null);
      setSortPower(null);
      setSortCurrent(null);

      setFilterData(filtered);
      return;
    }

    if (
      !sortName &&
      !sortQuantity &&
      !sortMaintenance &&
      !sortPower &&
      !sortCurrent
    ) {
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
    if (sortPower) {
      sorted.sort((a, b) => {
        if (a.power == null) return 1;
        if (b.power == null) return -1;

        if (sortPower === "asc")
          return (a.power ?? Infinity) - (b.power ?? Infinity);
        if (sortPower === "desc")
          return (b.power ?? Infinity) - (a.power ?? Infinity);
      });
    }
    if (sortCurrent) {
      sorted.sort((a, b) => {
        if (a.current == null) return 1;
        if (b.current == null) return -1;

        if (sortCurrent === "asc")
          return (a.current ?? Infinity) - (b.current ?? Infinity);
        if (sortCurrent === "desc")
          return (b.current ?? Infinity) - (a.current ?? Infinity);
      });
    }

    setFilterData(sorted);
  }, [
    sortName,
    sortQuantity,
    sortMaintenance,
    sortPower,
    sortCurrent,
    sortMode,
  ]);

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
          <tr className="text-left p-[5px] text-[14px] font-semibold">
            <th className="text-center p-[5px] w-[3%]">STT</th>
            <th className="p-[5px] w-[18%]">
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
            <th className="p-[5px] w-[3%]">Đơn vị</th>
            <th className="p-[5px] w-[6%]">
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
            <th className="p-[5px] w-[5%]">Ngày thêm</th>
            <th className="p-[5px] w-[8%] ">Điện áp</th>
            <th className="p-[5px] w-[6%]">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Công suất</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipPower}
                  >
                    {iconSortPower}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th className="p-[5px] w-[8%]">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Dòng điện đ.mức</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipCurrent}
                  >
                    {iconSortCurrent}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th colSpan={2} className="text-center w-[5%]">
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
              <td className=" text-left p-[5px]">
                {item.voltageRange ? `${item.voltageRange} V` : "—"}
              </td>
              <td className=" text-left p-[5px]">
                {item.power ? `${item.power}W` : "—"}
              </td>
              <td className=" text-left p-[5px]">
                {item.current ? `${item.current}A` : "—"}
              </td>
              <td className=" text-center p-[5px]">
                {mode === "view" ? (
                  <ElectricDetail item={item} />
                ) : (
                  <ElectricEdit item={item} onReload={onReload} />
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
