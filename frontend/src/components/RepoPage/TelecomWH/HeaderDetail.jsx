import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Tooltip } from "react-tooltip";
import { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Search,
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  ToolCase,
  SlidersVertical,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import axiosClient from "@/api/axiosClient.js";

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

  const checkPermission = (callback) => {
    const hasAccess =
      user?.yourRepo?.includes("all") || user?.yourRepo?.includes("telecom");

    if (!hasAccess) {
      toast.error("Không có quyền sử dụng chức năng!");
      return;
    }

    callback();
  };

  return (
    <AnimatePresence>
      <div className=" flex flex-col p-[20px] w-[1300px] h-[150px] bg-bgmain border-t-1 border-gray-700">
        <div className="flex flex-col gap-[5px]">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-[5px]">
              <motion.p
                initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
                animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
                exit={{ x: -20, opacity: 0 }} // Khi rời trang (nếu có)
                transition={{
                  duration: 0.5,
                }}
                className="text-left text-[16px] text-[#FFD700] font-satoshi "
              >
                Kho điện tử viễn thông
              </motion.p>

              <p className="text-[30px] text-textpri font-bold">
                Danh sách vật tư
              </p>
            </div>

            <Link
              to={"/material"}
              className="h-[40px] p-[15px] bg-highlightcl rounded-[12px] items-center font-bold flex flex-row gap-[10px] cursor-pointer hover:bg-[#2563eb]"
            >
              <ToolCase /> Bảo trì
            </Link>
          </div>

          <div className="flex flex-row mt-[20px] justify-between">
            <div class="flex text-textsec whitespace-nowrap text-sm cursor-pointer">
              <button
                onClick={() => checkPermission()}
                class="pr-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#FFD700] transition-colors duration-300"
              >
                Thêm vật tư <Plus size={20} className="text-textpri" />
              </button>

              <div class="border-r h-4 mx-2"></div>
              <button
                onClick={() => checkPermission()}
                class="pl-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#FFD700] transition-colors duration-300"
              >
                Xuất vật tư <Minus size={20} className="text-textpri" />
              </button>
            </div>
            <div className="flex flex-row">
              <button className="searchTool">
                <Search
                  className="text-textpri cursor-pointer hover:text-[#FFD700] mr-[15px] transition-colors duration-300"
                  size={18}
                />
              </button>
              <Tooltip anchorSelect=".searchTool" place="top">
                Tìm kiếm
              </Tooltip>
              <div class="border-r h-5 mx-2 text-textsec"></div>
              <div className="flex flex-row gap-[10px] p-[0px_15px]">
                <button className="sortTool">
                  <SlidersVertical
                    className="text-textpri cursor-pointer hover:text-[#FFD700] transition-colors duration-300"
                    size={18}
                  />
                </button>
                <Tooltip anchorSelect=".sortTool" place="top">
                  Sắp xếp
                </Tooltip>
                <button
                  onClick={() => checkPermission()}
                  className="exportTool"
                >
                  <Download
                    className="text-textpri cursor-pointer hover:text-[#FFD700] transition-colors duration-300"
                    size={18}
                  />
                </button>
                <Tooltip anchorSelect=".exportTool" place="top">
                  Xuất Excel
                </Tooltip>
                <button className="refreshTool">
                  <RefreshCcw
                    className="text-textpri cursor-pointer hover:text-[#FFD700] transition-colors duration-300"
                    size={18}
                  />
                </button>
                <Tooltip anchorSelect=".refreshTool" place="top">
                  Làm mới
                </Tooltip>
              </div>
              <div class="border-r h-5 mx-2 text-textsec "></div>
              <button
                onClick={() => checkPermission()}
                className="text-[14px] ml-[5px] flex flex-row gap-[10px] hover:text-[#FFD700] transition-colors duration-300 cursor-pointer ml-[15px]"
              >
                Báo cáo
                <TrendingUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default HeaderDetail;
