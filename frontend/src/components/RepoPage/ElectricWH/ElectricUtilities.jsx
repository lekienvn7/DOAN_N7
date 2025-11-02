import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ElectricUtilities = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ x: -20, opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.3, // Tốc độ mượt // Đường cong chuyển động
        }}
        className=" flex flex-col p-[15px] w-[240px] h-[calc(100vh-160px)] bg-bgmain border-t-1 border-r-1  border-gray-700"
      >
        <h2 className="text-center text-[18px] font-satoshi font-bold">
          Tổng quan
        </h2>
      </motion.div>
    </AnimatePresence>
  );
};

export default ElectricUtilities;
