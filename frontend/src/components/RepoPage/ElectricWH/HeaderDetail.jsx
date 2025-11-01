import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import ElectricList from "./ElectricList";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { Search } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { ToolCase } from "lucide-react";

const HeaderDetail = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ x: -20, opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.3, // Tốc độ mượt // Đường cong chuyển động
        }}
        className=" flex flex-col p-[20px] w-[1300px] h-[150px] bg-bgmain border-t-1 border-gray-800"
      >
        <div className="flex flex-col gap-[5px]">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-[5px]">
              <p className="text-left text-[16px] text-textpri font-satoshi font-bold">
                Kho điện
              </p>

              <p className="text-[30px] text-highlightcl font-bold">
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
              <button class="pr-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#00bcd4]">
                Thêm vật tư <Plus size={20} className="text-textpri" />
              </button>

              <div class="border-r h-4 mx-2"></div>
              <button class="pl-3 cursor-pointer flex flex-row gap-[10px] hover:text-[#00bcd4] ">
                Xuất vật tư <Minus size={20} className="text-textpri" />
              </button>
            </div>
            <div className="flex flex-row">
              <Search
                className="text-textpri cursor-pointer hover:text-[#00bcd4] mr-[15px]"
                size={18}
              />
              <div class="border-r h-5 mx-2 text-textsec"></div>
              <div className="flex flex-row gap-[5px]">
                <ArrowUp
                  className="text-textpri cursor-pointer hover:text-[#00bcd4]"
                  size={18}
                />
                <ArrowDown
                  className="text-textpri cursor-pointer hover:text-[#00bcd4]"
                  size={18}
                />
                <RotateCcw
                  className="text-textpri cursor-pointer hover:text-[#00bcd4]"
                  size={18}
                />
              </div>
              <div class="border-r h-5 mx-2 text-textsec "></div>
              <button className="text-[14px] ml-[5px] flex flex-row gap-[10px] hover:text-[#00bcd4] cursor-pointer">
                Báo cáo
                <TrendingUp size={18} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <ElectricList />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HeaderDetail;
