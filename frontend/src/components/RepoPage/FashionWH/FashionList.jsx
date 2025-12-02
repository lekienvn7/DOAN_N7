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
import FashionDetail from "./FashionDetail";
import FashionEdit from "./FashionEdit";

const FashionList = ({ mode, reload, searchData, sortMode, onReload }) => {
  const [fashion, setFashion] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = (searchData || "").toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortDurable, setSortDurable] = useState(null);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchFashion = async () => {
        try {
          const res = await axiosClient.get("/repository/material/fashion");
          if (res.data.success) {
            setFashion([...res.data.materials]);
            setFilterData([...res.data.materials]);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFashion();
    }, 600);

    return () => clearTimeout(timer);
  }, [reload]);

  const durableList = [
    { type: "high", name: "Bền cao", num: 3 },
    { type: "medium", name: "Trung bình", num: 2 },
    { type: "low", name: "Dễ hỏng ", num: 1 },
  ];

  useEffect(() => {
    const filtered = fashion.filter((item) =>
      keywords.every(
        (k) =>
          item.name?.toLowerCase().includes(k) ||
          item.color?.toLowerCase().includes(k) ||
          item.fabricType?.toLowerCase().includes(k) ||
          item.origin?.toLowerCase().includes(k)
      )
    );

    setFilterData(filtered);
  }, [searchData, fashion]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  const toggleSortName = () => {
    setSortQuantity(null);
    setSortDurable(null);

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
    setSortDurable(null);

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

  const toggleSortDurable = () => {
    setSortName(null);
    setSortQuantity(null);

    setSortDurable((prev) => {
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

  const labelTooltipDurable =
    sortDurable === "asc"
      ? "Giảm dần"
      : sortDurable === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const iconSortName =
    sortName === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#f472b6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#f472b6] hover:text-[#ffffffcc] no-outline cursor-pointer"
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
        className="text-[#f472b6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#f472b6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    );

  const iconSortDurable =
    sortDurable === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#f472b6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortDurable}
      />
    ) : sortDurable === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#f472b6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortDurable}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortDurable}
      />
    );

  useEffect(() => {
    const filtered = fashion.filter((item) =>
      keywords.every(
        (k) =>
          item.name?.toLowerCase().includes(k) ||
          item.color?.toLowerCase().includes(k) ||
          item.fabricType?.toLowerCase().includes(k) ||
          item.origin?.toLowerCase().includes(k)
      )
    );

    if (!sortMode) {
      setSortName(null);
      setSortQuantity(null);
      setSortDurable(null);

      setFilterData(filtered);
      return;
    }

    if (!sortName && !sortQuantity && !sortDurable) {
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

    if (sortDurable) {
      sorted.sort((a, b) => {
        const durableNum = (prev) => {
          return (
            durableList.find((item) => item.type === prev.durability)?.num ??
            null
          );
        };

        const aNum = durableNum(a);
        const bNum = durableNum(b);

        if (aNum === null && bNum !== null) return 1;
        if (aNum !== null && bNum === null) return -1;
        if (aNum === null && bNum === null) return 0;

        if (sortDurable === "asc") return aNum - bNum;
        if (sortDurable === "desc") return bNum - aNum;
      });
    }

    setFilterData(sorted);
  }, [sortName, sortQuantity, sortDurable, sortMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-[#f472b6] border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-[#f472b6] border-collapse">
        <thead className="sticky top-0 z-10 border-b border-gray-700 bg-[#1a0f08]">
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
            <th className="p-[5px] w-[3%]">Đơn vị</th>
            <th className="p-[5px] w-[10%]">Loại vải</th>
            <th className="p-[5px] w-[5%]">Ngày thêm</th>
            <th className="p-[5px] w-[8%] ">Xuất xứ</th>
            <th className="p-[5px] w-[6%]">Màu sắc</th>
            <th className="p-[5px] w-[6%]">
              {" "}
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Độ bền</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipDurable}
                  >
                    {iconSortDurable}
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
            let durableColor = "";

            if (item.durability === "low") durableColor = "text-[#ef4444]";
            else if (item.durability === "medium") {
              durableColor = "text-[#f59e0b]";
            } else {
              durableColor = "text-[#22c55e]";
            }

            return (
              <tr className=" text-center text-[14px] odd:bg-[#111111] even:bg-[#0d0d0d] hover:bg-[#1a1a1a] text-[#e5e5e7] ">
                <td className=" p-[5px]">{index + 1}</td>
                <td className="text-left  p-[5px]">
                  {highlightText(item.name, searchData)}
                </td>
                <td className=" text-left p-[5px]">{item.quantity}</td>
                <td className=" text-left p-[5px]">{item.unit}</td>
                <td className=" text-left p-[5px]">
                  {highlightText(
                    item.fabricType ? `${item.fabricType}` : "—",
                    searchData
                  )}
                </td>
                <td className=" text-left p-[5px]">
                  {formatDate(item.createdAt)}
                </td>
                <td className=" text-left p-[5px]">
                  {highlightText(
                    item.origin ? `${item.origin}` : "—",
                    searchData
                  )}
                </td>
                <td
                  className={`text-left p-[5px]`}
                  style={{ color: item.colorType }}
                >
                  {highlightText(
                    item.color ? `${item.color}` : "—",
                    searchData
                  )}
                </td>
                <td className={` text-left p-[5px] ${durableColor}`}>
                  {item.durability
                    ? `${
                        durableList.find(
                          (prev) => prev.type === item.durability
                        )?.name
                      }`
                    : "—"}
                </td>
                <td className=" text-center p-[5px]">
                  {mode === "view" ? (
                    <FashionDetail item={item} />
                  ) : (
                    <FashionEdit item={item} onReload={onReload} />
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

export default FashionList;
