import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import AddFashion from "./AddFashion";
import {
  Plus,
  Minus,
  Search,
  RefreshCcw,
  TrendingUpDown,
  ChevronsRight,
  TrendingUp,
  ToolCase,
  ArrowDownUp,
  Download,
  History,
  X,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog.jsx";
import axiosClient from "@/api/axiosClient";

const HeaderDetail = ({
  mode,
  setMode,
  onReload,
  searchData,
  setSearchData,
  sortMode,
  setSortMode,
}) => {
  const [open, setOpen] = useState(false);
  const [repository, setRepository] = useState("");
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef(null);
  const historyRef = useRef(null);

  const checkPermission = () => {
    const hasAccess =
      user?.yourRepo?.includes("all") || user?.yourRepo?.includes("fashion");

    if (!hasAccess) {
      toast.error("Không có quyền sử dụng chức năng!");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await axiosClient.get("/repository/fashion");
        if (res.data.success) {
          setRepository(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi kết nối dữ liệu kho thời trang!", error);
        toast.error("Lỗi khi kết nối dữ liệu kho thời trang!");
      }
    };

    fetchRepository();
  }, []);

  useEffect(() => {
    const historyKey = "fashion_search_history";

    const saved = JSON.parse(localStorage.getItem(historyKey)) || [];
    setHistory(saved);
  }, []);

  const saveHistory = (value) => {
    if (!value.trim()) return;

    const updated = [value, ...history.filter((h) => h !== value)].slice(0, 10);
    const historyKey = "fashion_search_history";

    setHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  };

  const deleteHistoryItem = (item) => {
    const updated = history.filter((h) => h !== item);
    setHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
  };

  const formatDate = (dataString) => {
    const date = new Date(dataString);

    const day = date.getDate().toString().padStart(2, 0);
    const month = (date.getMonth() + 1).toString().padStart(2, 0);
    const year = date.getFullYear().toString().slice(-2); // Lấy 2 số cuối của năm

    return `${day}/${month}/${year}`;
  };

  const handleExport = async () => {
    try {
      const res = await axiosClient.get("/export/fashion/export-excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "kho-thoiTrang.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Đã xuất file Excel!");
    } catch (err) {
      toast.error("Lỗi khi xuất Excel!");
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        historyRef.current &&
        !historyRef.current.contains(e.target)
      ) {
        setShowHistory(false);
        setShowSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className=" flex flex-col p-[20px] w-[1300px] h-[150px] bg-bgmain border-t-1 border-gray-700">
      <div className="flex flex-col gap-[5px]">
        <AnimatePresence>
          <motion.div
            initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
            animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
            exit={{ x: -20, opacity: 0 }} // Khi rời trang (nếu có)
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 12,
            }}
            className="flex flex-row justify-between"
          >
            <div className="flex flex-col gap-[5px]">
              <p className="text-left text-[16px] text-[#f472b6] font-satoshi ">
                Kho thời trang
              </p>

              <p className="text-[30px] text-textpri font-bold">
                Danh sách vật tư
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="h-[40px] p-[15px] bg-highlightcl rounded-[12px] items-center font-bold flex flex-row gap-[10px] cursor-pointer hover:bg-[#2563eb]">
                  <ToolCase /> Thông tin
                </button>
              </DialogTrigger>

              <DialogContent className="bg-[#1a1a1a] rounded-[12px] border-none text-white ">
                <DialogHeader>
                  <DialogTitle>
                    Thông tin chi tiết{" "}
                    <span className="text-[#f472b6]">kho thời trang</span>
                  </DialogTitle>
                </DialogHeader>
                <ul className="mt-[20px] flex flex-col gap-[5px]">
                  <li>
                    <span className="text-[#60A5FA] font-semibold">
                      Vị trí:
                    </span>{" "}
                    {repository.location}
                  </li>
                  <li>
                    <span className="text-[#60A5FA] font-semibold">
                      {" "}
                      Quản lý phụ trách:
                    </span>{" "}
                    {repository?.manager?.fullName || "Chưa có quản lý"}
                    {" - "}
                    {repository?.manager?.email || "—"}
                  </li>
                  <li>
                    <span className="text-[#60A5FA] font-semibold">
                      Tạo vào:
                    </span>{" "}
                    {formatDate(repository.createdAt)}
                  </li>
                </ul>
              </DialogContent>
            </Dialog>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-row mt-[20px] justify-between">
          <div className="flex text-textsec whitespace-nowrap text-sm cursor-pointer">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn Radix mở tự động
                    if (checkPermission()) {
                      setOpen(true); // Chỉ mở nếu có quyền
                    }
                  }}
                  className="pr-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#f472b6] transition-colors duration-300"
                >
                  Thêm vật tư <Plus size={20} className="text-textpri" />
                </button>
              </DialogTrigger>

              <DialogContent className="bg-[#1a1a1a] !max-w-none rounded-[12px] p-[25px] w-fit border-none text-white">
                <DialogHeader>
                  <DialogTitle>
                    Phiếu nhập vật tư{" "}
                    <span className="text-[#f472b6]">kho Thời trang</span>
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Nhập vật tư vào kho - Những mục được{" "}
                    <span className="text-[#f472b6]">tô màu</span> không thể để
                    trống!
                  </DialogDescription>
                </DialogHeader>
                <AddFashion onReload={onReload} />
              </DialogContent>
            </Dialog>

            <div className="border-r h-4 mx-2"></div>
            <button
              onClick={() => checkPermission()}
              className="pl-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#f472b6] transition-colors duration-300"
            >
              Xuất vật tư <Minus size={20} className="text-textpri" />
            </button>
          </div>
          <div className="flex flex-row relative">
            <div className=" flex flex-row">
              <button
                onClick={() => {
                  setShowSearch(!showSearch),
                    setShowHistory(false),
                    setSearchData("");
                }}
                className=""
              >
                {showSearch ? (
                  <ChevronsRight
                    className={`searchClose cursor-pointer hover:text-[#fa8dc6] mr-[15px] transition-colors duration-300 text-[#f472b6] no-outline`}
                    size={18}
                  />
                ) : (
                  <Search
                    className={`searchTool cursor-pointer hover:text-[#f472b6] mr-[15px] transition-colors duration-300 text-[#A1A1A6] no-outline`}
                    size={18}
                  />
                )}
              </button>

              <div className="flex flex-row items-center">
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={
                    showSearch
                      ? {
                          width: ["0px", "180px", "150px"],
                          opacity: [0, 1, 1],
                        }
                      : {
                          width: ["150px", "180px", "0px"],
                          opacity: [1, 1, 0],
                        }
                  }
                  transition={{
                    duration: 0.1,
                    ease: "easeOut",
                  }}
                  ref={searchRef}
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveHistory(searchData);
                      setShowHistory(false);
                    }
                  }}
                  onFocus={() => setShowHistory(true)}
                  className={`px-[10px] placeholder:text-textsec -mr-[15px] text-textpri text-[14px]  outline-none ${
                    showSearch
                      ? "ml-[5px]  pointer-events-auto"
                      : "ml-[0px] pointer-events-none"
                  } transition-all duration-300`}
                />
                <X
                  size={16}
                  onClick={() => {
                    setSearchData("");
                    setShowHistory(false);
                  }}
                  className={`cursor-pointer text-[#a1a1a6] -ml-[15px] hover:text-red-400 transition-opacity duration-200 ${
                    searchData?.length === 0
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  }`}
                />
              </div>
            </div>

            {showHistory && history.length > 0 && (
              <motion.div
                ref={historyRef}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute top-[30px] left-[35px] w-[270px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#c7a7ff]/50 hover:scrollbar-thumb-[#e8d6ff]/60  bg-[#111111] border border-gray-400 border-t-[#f472b6]  rounded-lg shadow-xl z-20"
              >
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchData(item);
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-3 py-2 text-textsec hover:bg-[#222] cursor-pointer"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <History size={15} /> {item}{" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // không bị click vào select
                          deleteHistoryItem(item);
                        }}
                        className="text-textsec hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            <Tooltip anchorSelect=".searchTool" place="top">
              Tìm kiếm
            </Tooltip>

            <Tooltip anchorSelect=".searchClose" place="top">
              Đóng tìm kiếm
            </Tooltip>

            <div className="border-r h-5 mx-2 text-textsec"></div>
            <div className="flex flex-row gap-[10px] p-[0px_15px]">
              <button
                onClick={() => {
                  setSortMode((prev) => !prev);
                }}
                className="sortTool"
              >
                <ArrowDownUp
                  className={`${
                    sortMode ? "text-[#f472b6] " : "text-[#A1A1A6] "
                  } cursor-pointer hover:text-[#fa8dc6] transition-colors duration-300`}
                  size={18}
                />
              </button>
              <Tooltip anchorSelect=".sortTool" place="top">
                {sortMode ? "Tắt sắp xếp" : "Sắp xếp"}
              </Tooltip>
              <button
                onClick={() => {
                  if (checkPermission()) handleExport();
                }}
                className="exportTool"
              >
                <Download
                  className="text-[#A1A1A6] cursor-pointer hover:text-[#f472b6] transition-colors duration-300"
                  size={18}
                />
              </button>
              <Tooltip anchorSelect=".exportTool" place="top">
                Xuất Excel
              </Tooltip>
              <button
                onClick={() => {
                  setTimeout(() => {
                    toast.success("Làm mới dữ liệu thành công!");
                  }, 600);
                  onReload();
                }}
                className="refreshTool"
              >
                <RefreshCcw
                  className="text-[#A1A1A6] cursor-pointer hover:text-[#f472b6] transition-colors duration-300"
                  size={18}
                />
              </button>
              <Tooltip anchorSelect=".refreshTool" place="top">
                Làm mới
              </Tooltip>
            </div>
            <div className="border-r h-5 mx-2 text-textsec "></div>
            <button
              onClick={(e) => {
                e.preventDefault(); // Ngăn Radix mở tự động
                if (checkPermission()) {
                  setMode((prev) => (prev === "view" ? "edit" : "view"));
                }
              }}
              className="text-[14px] ml-[5px] flex flex-row gap-[10px] hover:text-[#f472b6] transition-colors duration-300 cursor-pointer ml-[15px]"
            >
              {mode === "view" ? `Chỉnh sửa` : `Chi tiết`}
              {mode === "view" ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingUpDown size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDetail;
