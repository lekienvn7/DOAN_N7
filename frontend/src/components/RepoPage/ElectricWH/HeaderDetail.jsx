import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import AddElectric from "./AddElectric";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog";
import axiosClient from "@/api/axiosClient";

const HeaderDetail = () => {
  const [open, setOpen] = useState(false);
  const [repository, setRepository] = useState("");
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

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await axiosClient.get("/repository/electric");
        if (res.data.success) {
          setRepository(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi kết nối dữ liệu kho điện!", error);
        toast.error("Lỗi khi kết nối dữ liệu kho điện!");
      }
    };

    fetchRepository();
  }, []);

  const formatDate = (dataString) => {
    const date = new Date(dataString);

    const day = date.getDate().toString().padStart(2, 0);
    const month = (date.getMonth() + 1).toString().padStart(2, 0);
    const year = date.getFullYear().toString().slice(-2); // Lấy 2 số cuối của năm

    return `${day}/${month}/${year}`;
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
                Kho điện
              </motion.p>

              <p className="text-[30px] text-textpri font-bold">
                Danh sách vật tư
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="h-[40px] p-[15px] bg-highlightcl rounded-[12px] items-center font-bold flex flex-row gap-[10px] cursor-pointer hover:bg-[#2563eb]">
                  <ToolCase /> Chi tiết
                </button>
              </DialogTrigger>

              <DialogContent className="bg-[#1a1a1a] rounded-[12px] border-none text-white ">
                <DialogHeader>
                  <DialogTitle>
                    Thông tin chi tiết{" "}
                    <span className="text-[#fdd700]">kho điện</span>
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
          </div>

          <div className="flex flex-row mt-[20px] justify-between">
            <div class="flex text-textsec whitespace-nowrap text-sm cursor-pointer">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn Radix mở tự động
                      if (checkPermission()) {
                        setOpen(true); // Chỉ mở nếu có quyền
                      }
                    }}
                    className="pr-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#FFD700] transition-colors duration-300"
                  >
                    Thêm vật tư <Plus size={20} className="text-textpri" />
                  </button>
                </DialogTrigger>

                <DialogContent className="bg-[#1a1a1a] rounded-[12px] border-none text-white">
                  <DialogHeader>
                    <DialogTitle>
                      Phiếu nhập vật tư{" "}
                      <span className="text-[#fdd700]">kho Điện</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Nhập vật tư vào kho
                    </DialogDescription>
                  </DialogHeader>
                  <AddElectric />
                </DialogContent>
              </Dialog>
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
