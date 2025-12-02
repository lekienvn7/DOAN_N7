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
import IotDetail from "./IotDetail";
import IotEdit from "./IotEdit";

const IotList = ({ mode, reload, searchData, sortMode, onReload }) => {
  const [iot, setIot] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = (searchData || "").toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortTemp, setSortTemp] = useState(null);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchIot = async () => {
        try {
          const res = await axiosClient.get("/repository/material/iot");
          if (res.data.success) {
            setIot([...res.data.materials]);
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

  const tempList = [
    { type: "Commercial Grade", name: "0°C → 70°C", num: 1 },
    { type: "Industrial Grade", name: "-20°C → 85°C", num: 2 },
    { type: "Extended Industrial", name: "-40°C → 85°C", num: 3 },
    { type: "Military Grade", name: "-40°C → 85°C", num: 4 },
    { type: "Automotive Grade", name: "-40°C → 125°C", num: 5 },
    { type: "others", name: "Khác", num: 6 },
  ];

  useEffect(() => {
    const filtered = iot.filter((item) =>
      keywords.every(
        (k) =>
          item.name?.toLowerCase().includes(k) ||
          item.sensorType?.toLowerCase().includes(k)
      )
    );

    setFilterData(filtered);
  }, [searchData, iot]);

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
    setSortTemp(null);

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
    setSortTemp(null);

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

  const toggleSortTemp = () => {
    setSortName(null);
    setSortQuantity(null);

    setSortTemp((prev) => {
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

  const labelTooltipTemp =
    sortTemp === "asc"
      ? "Giảm dần"
      : sortTemp === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const iconSortName =
    sortName === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#5eead4] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#5eead4] hover:text-[#ffffffcc] no-outline cursor-pointer"
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
        className="text-[#5eead4] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#5eead4] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    );

  const iconSortTemp =
    sortTemp === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#5eead4] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortTemp}
      />
    ) : sortTemp === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#5eead4] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortTemp}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortTemp}
      />
    );

  useEffect(() => {
    const filtered = iot.filter((item) =>
      keywords.every(
        (k) =>
          item.name?.toLowerCase().includes(k) ||
          item.sensorType?.toLowerCase().includes(k)
      )
    );

    if (!sortMode) {
      setSortName(null);
      setSortQuantity(null);
      setSortTemp(null);

      setFilterData(filtered);
      return;
    }

    if (!sortName && !sortQuantity && !sortTemp) {
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

    if (sortTemp) {
      sorted.sort((a, b) => {
        const tempNum = (item) => {
          return (
            tempList.find((prev) => prev.type === item.operatingTemp)?.num ??
            null
          );
        };

        const aNum = tempNum(a);
        const bNum = tempNum(b);

        if (aNum === null && bNum !== null) return 1;
        if (aNum !== null && bNum === null) return -1;
        if (aNum === null && bNum === null) return 0;

        if (sortTemp === "asc") return aNum - bNum;
        if (sortTemp === "desc") return bNum - aNum;
      });
    }

    setFilterData(sorted);
  }, [sortName, sortQuantity, sortTemp, sortMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-[#5eead4] border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-[#5eead4] border-collapse">
        <thead className="sticky top-0 z-10 border-b border-gray-700 bg-[#081f1c]">
          <tr className="text-left p-[5px] text-[14px] font-semibold">
            <th className="text-center p-[5px] w-[2%]">STT</th>
            <th className="p-[5px] w-[20%]">
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
            <th className="p-[5px] w-[5%]">
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
            <th className="p-[5px] w-[8%]">Giao thức kết nối</th>
            <th className="p-[5px] w-[5%]">Hạn bảo trì</th>
            <th className="p-[5px] w-[5%] ">Ngày thêm</th>
            <th className="p-[5px] w-[10%]">Loại cảm biến</th>
            <th className="p-[5px] w-[10%]">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Nhiệt độ hoạt động</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipTemp}
                  >
                    {iconSortTemp}
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
          {filterData.map((item, index) => {
            let tempColor = "";

            if (item.operatingTemp === "Commercial Grade")
              tempColor = "text-[#22c55e]";
            else if (item.operatingTemp === "Industrial Grade")
              tempColor = "text-[#4ade80]";
            else if (item.operatingTemp === "Extended Industrial")
              tempColor = "text-[#eab308]";
            else if (item.operatingTemp === "Military Grade")
              tempColor = "text-[#fb923c]";
            else if (item.operatingTemp === "Automotive Grade")
              tempColor = "text-[#f97316]";
            else tempColor = "text-[#ef4444]";

            return (
              <tr className=" text-center text-[14px] odd:bg-[#111111] even:bg-[#0d0d0d] hover:bg-[#1a1a1a] text-[#e5e5e7] ">
                <td className=" p-[5px]">{index + 1}</td>
                <td className="text-left  p-[5px]">
                  {highlightText(item.name, searchData)}
                </td>
                <td className=" text-left p-[5px]">{item.quantity}</td>

                <td className=" text-left p-[5px]">{item.unit}</td>
                <td className=" text-left p-[5px]">
                  {item.communicationProtocol
                    ? `${item.communicationProtocol}`
                    : "—"}
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
                <td className=" text-left p-[5px]">
                  {highlightText(
                    item.sensorType ? `${item.sensorType}` : "—",
                    searchData
                  )}
                </td>
                <td className={`text-left ${tempColor} p-[5px]`}>
                  {item.operatingTemp
                    ? `${
                        tempList.find(
                          (prev) => prev.type === item.operatingTemp
                        )?.name
                      }`
                    : "—"}
                </td>
                <td className=" text-center p-[5px]">
                  {mode === "view" ? (
                    <IotDetail item={item} />
                  ) : (
                    <IotEdit item={item} onReload={onReload} />
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

export default IotList;
