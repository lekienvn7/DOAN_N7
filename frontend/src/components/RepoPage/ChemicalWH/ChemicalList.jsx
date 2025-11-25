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
import ChemicalDetail from "./ChemicalDetail";
import ChemicalEdit from "./ChemicalEdit";

const ChemicalList = ({ mode, reload, searchData, sortMode }) => {
  const [chemical, setChemical] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywords = (searchData || "").toLowerCase().trim().split(/\s+/);
  const [sortName, setSortName] = useState(null);
  const [sortQuantity, setSortQuantity] = useState(null);
  const [sortExpiryDate, setSortExpiryDate] = useState(null);
  const [sortHazard, setSortHazard] = useState(null);
  const [sortFlame, setSortFlame] = useState(null);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const fetchChemical = async () => {
        try {
          const res = await axiosClient.get("/repository/material/chemical");
          if (res.data.success) {
            setChemical([...res.data.materials]);
            setFilterData([...res.data.materials]);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu", error);
        } finally {
          setLoading(false);
        }
      };
      fetchChemical();
    }, 600);

    return () => clearTimeout(timer);
  }, [reload]);

  useEffect(() => {
    const filtered = chemical.filter((item) =>
      keywords.every((k) => item.name.toLowerCase().includes(k))
    );

    setFilterData(filtered);
  }, [searchData, chemical]);

  const hazardLevelList = [
    { type: "low", name: "Không nguy hiểm", num: 0 },
    { type: "medium", name: "Trung bình", num: 1 },
    { type: "high", name: "Cao", num: 2 },
    { type: "extreme", name: "Cực kỳ nguy hiểm", num: 3 },
  ];

  const flameList = [
    { type: "Extremely Flammable", name: "Cực kỳ dễ cháy", num: 0 },
    { type: "Highly Flammable", name: "Rất dễ cháy", num: 1 },
    { type: "Flammable", name: "Dễ cháy", num: 2 },
    { type: "Combustible", name: "Ít dễ cháy", num: 3 },
    { type: "Không dễ cháy", name: "Không dễ cháy", num: 4 },
  ];

  const toxicList = [
    { type: "Fatal Toxicity", name: "Cực độc" },
    { type: "Severe Toxicity", name: "Rất độc" },
    { type: "Toxic", name: "Độc" },
    { type: "Harmful", name: "Độc nhẹ" },
    { type: "Ít độc / gần như không độc", name: "Ít / Không độc" },
  ];

  const highlightText = (text, searchData) => {
    const safeText = typeof text === "string" ? text : "";
    const safeSearch = typeof searchData === "string" ? searchData.trim() : "";

    if (!safeSearch) return safeText;

    const keywords = safeSearch.toLowerCase().split(/\s+/);
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");

    return safeText.split(regex).map((part, index) => {
      const isMatch = keywords.includes(part.toLowerCase());
      return isMatch ? (
        <span key={index} className="text-highlightcl font-semibold">
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  const getNextExpiryDate = (startDate, months) => {
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
    setSortHazard(null);
    setSortExpiryDate(null);
    setSortFlame(null);

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
    setSortHazard(null);
    setSortExpiryDate(null);
    setSortFlame(null);

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

  const toggleSortExpiryDate = () => {
    setSortName(null);
    setSortQuantity(null);
    setSortHazard(null);
    setSortFlame(null);

    setSortExpiryDate((prev) => {
      if (!prev) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const toggleSortHazard = () => {
    setSortName(null);
    setSortQuantity(null);
    setSortExpiryDate(null);
    setSortFlame(null);

    setSortHazard((prev) => {
      if (!prev) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const toggleSortFlame = () => {
    setSortName(null);
    setSortQuantity(null);
    setSortExpiryDate(null);
    setSortHazard(null);

    setSortFlame((prev) => {
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

  const labelTooltipExpiryDate =
    sortExpiryDate === "asc"
      ? "Giảm dần"
      : sortExpiryDate === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const labelTooltipHazard =
    sortHazard === "asc"
      ? "Giảm dần"
      : sortHazard === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const labelTooltipFlame =
    sortFlame === "asc"
      ? "Giảm dần"
      : sortFlame === "desc"
      ? "Danh sách gốc"
      : "Tăng dần";

  const iconSortName =
    sortName === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortName}
      />
    ) : sortName === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
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
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : sortQuantity === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortQuantity}
      />
    );

  const iconSortExpiryDate =
    sortExpiryDate === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortExpiryDate}
      />
    ) : sortExpiryDate === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortExpiryDate}
      />
    ) : (
      <ClockArrowDown
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortExpiryDate}
      />
    );

  const iconSortHazard =
    sortHazard === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortHazard}
      />
    ) : sortHazard === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortHazard}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortHazard}
      />
    );

  const iconSortFlame =
    sortFlame === "asc" ? (
      <ChevronUp
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortFlame}
      />
    ) : sortFlame === "desc" ? (
      <ChevronDown
        size={18}
        className="text-[#c7a7ff] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortFlame}
      />
    ) : (
      <ArrowDown01
        size={18}
        className="text-[#a1a1a6] hover:text-[#ffffffcc] no-outline cursor-pointer"
        onClick={toggleSortFlame}
      />
    );

  useEffect(() => {
    const filtered = chemical.filter((item) =>
      keywords.every((k) => item.name.toLowerCase().includes(k))
    );

    if (!sortMode) {
      setSortName(null);
      setSortQuantity(null);
      setSortExpiryDate(null);
      setSortHazard(null);
      setSortFlame(null);

      setFilterData(filtered);
      return;
    }

    if (
      !sortName &&
      !sortQuantity &&
      !sortExpiryDate &&
      !sortHazard &&
      !sortFlame
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
    if (sortExpiryDate) {
      sorted.sort((a, b) => {
        if (a.expiryDate == null) return 1;
        if (b.expiryDate == null) return -1;

        if (sortExpiryDate === "asc")
          return (a.expiryDate ?? Infinity) - (b.expiryDate ?? Infinity);
        if (sortExpiryDate === "desc")
          return (b.expiryDate ?? Infinity) - (a.expiryDate ?? Infinity);
      });
    }
    if (sortHazard) {
      sorted.sort((a, b) => {
        const hazardNum = (chemical) => {
          return (
            hazardLevelList.find((prev) => prev.type === chemical.hazardLevel)
              ?.num ?? null
          );
        };

        const aNum = hazardNum(a);
        const bNum = hazardNum(b);

        if (aNum === null && bNum !== null) return 1;
        if (aNum !== null && bNum === null) return -1;
        if (aNum === null && bNum === null) return 0;

        if (sortHazard === "asc") return aNum - bNum;
        if (sortHazard === "desc") return bNum - aNum;
      });
    }

    if (sortFlame) {
      sorted.sort((a, b) => {
        const flameNum = (chemical) => {
          return (
            flameList.find((prev) => prev.type === chemical.flammability)
              ?.num ?? null
          );
        };

        const aNum = flameNum(a);
        const bNum = flameNum(b);

        if (aNum === null && bNum !== null) return 1;
        if (aNum !== null && bNum === null) return -1;
        if (aNum === null && bNum === null) return 0;

        if (sortFlame === "asc") return aNum - bNum;
        if (sortFlame === "desc") return bNum - aNum;
      });
    }

    setFilterData(sorted);
  }, [sortName, sortQuantity, sortExpiryDate, sortHazard, sortFlame, sortMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-[#c7a7ff] border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="electric w-full text-[#c7a7ff] border-collapse">
        <thead className="sticky top-0 z-10 border-b border-gray-700 bg-[#0b0a0e]">
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
            <th className="p-[5px] w-[6%]">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>HSD</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipExpiryDate}
                  >
                    {iconSortExpiryDate}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th className="p-[5px] w-[5%]">Ngày thêm</th>
            <th className="p-[5px] w-[8%] ">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Mức độ nguy hiểm</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipHazard}
                  >
                    {iconSortHazard}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th className="p-[5px] w-[7%]">
              <div
                className={`${
                  sortMode ? "flex flex-row justify-between items-center" : ""
                }`}
              >
                <p>Tính dễ cháy</p>{" "}
                {sortMode ? (
                  <div
                    data-tooltip-id="SortTip"
                    data-tooltip-content={labelTooltipFlame}
                  >
                    {iconSortFlame}
                  </div>
                ) : (
                  ""
                )}
                <Tooltip id="SortTip"></Tooltip>
              </div>
            </th>
            <th className="p-[5px] w-[6%]">Độc tính</th>
            <th colSpan={2} className="text-center w-[3%]">
              {mode === "view" ? "Chi tiết" : "Chỉnh sửa"}
            </th>
          </tr>
        </thead>

        <tbody>
          {filterData.map((item, index) => {
            let hazardColor = "";

            if (item.hazardLevel === "low") hazardColor = "text-[#4ade80]";
            else if (item.hazardLevel === "medium")
              hazardColor = "text-[#facc15]";
            else if (item.hazardLevel === "high")
              hazardColor = "text-[#f97316]";
            else hazardColor = "text-[#ef4444]";

            let flameColor = "";

            if (item.flammability === "Extremely Flammable")
              flameColor = "text-[#ef4444]";
            else if (item.flammability === "Highly Flammable")
              flameColor = "text-[#f97316]";
            else if (item.flammability === "Flammable")
              flameColor = "text-[#fb923c]";
            else if (item.flammability === "Combustible")
              flameColor = "text-[#eab308]";
            else flameColor = "text-[#22c55e]";

            let toxicColor = "";

            if (item.toxicity === "Fatal Toxicity")
              toxicColor = "text-[#ef4444]";
            else if (item.toxicity === "Severe Toxicity")
              toxicColor = "text-[#f97316]";
            else if (item.toxicity === "Toxic") toxicColor = "text-[#facc15]";
            else if (item.toxicity === "Harmful") toxicColor = "text-[#a3e635]";
            else toxicColor = "text-[#22c55e]";

            return (
              <tr className=" text-center text-[14px] odd:bg-[#111111] even:bg-[#0d0d0d] hover:bg-[#1a1a1a] text-[#e5e5e7] ">
                <td className=" p-[5px]">{index + 1}</td>
                <td className="text-left  p-[5px]">
                  {highlightText(item.name, searchData)}
                </td>
                <td className=" text-left p-[5px]">{item.quantity}</td>
                <td className=" text-left p-[5px]">{item.unit}</td>
                <td className=" text-left p-[5px]">
                  {item.expiryDate
                    ? (() => {
                        const nextDate = getNextExpiryDate(
                          item.createdAt,
                          item.expiryDate
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
                <td className={`text-left ${hazardColor} p-[5px]`}>
                  {item.hazardLevel
                    ? hazardLevelList.find(
                        (chemical) => chemical.type === item.hazardLevel
                      )?.name
                    : "—"}
                </td>
                <td className={`text-left ${flameColor} p-[5px]`}>
                  {item.flammability
                    ? flameList.find(
                        (chemical) => chemical.type === item.flammability
                      )?.name
                    : "—"}
                </td>
                <td className={`text-left ${toxicColor} p-[5px]`}>
                  {item.toxicity
                    ? toxicList.find(
                        (chemical) => chemical.type === item.toxicity
                      )?.name
                    : "—"}
                </td>
                <td className=" text-center p-[5px]">
                  {mode === "view" ? (
                    <ChemicalDetail item={item} />
                  ) : (
                    <ChemicalEdit item={item} reload={reload} />
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

export default ChemicalList;
