import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { TrendingUp } from "lucide-react";

const RepoDetail = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ x: -20, opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.3, // Tốc độ mượt // Đường cong chuyển động
        }}
        className=" w-[1300px] h-[425px] p-[15px] bg-bgmain border-t-1 border-gray-700"
      ></motion.div>
    </AnimatePresence>
  );
};

export default RepoDetail;
