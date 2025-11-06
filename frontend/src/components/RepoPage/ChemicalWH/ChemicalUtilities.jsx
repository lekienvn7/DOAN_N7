import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChemicalUtilities = () => {
  return (
    <AnimatePresence>
      <div className=" flex flex-col p-[15px] w-[240px] h-[calc(100vh-160px)] bg-bgmain border-t-1 border-r-1  border-gray-700">
        <motion.div
          initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
          animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
          exit={{ x: -20, opacity: 0 }} // Khi rời trang (nếu có)
          transition={{
            duration: 0.5, // Tốc độ mượt // Đường cong chuyển động
          }}
        >
          <h2 className="text-center text-[18px] font-satoshi font-bold">
            Tổng quan
          </h2>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChemicalUtilities;
