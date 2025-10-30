import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ElectricUtilities = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ y: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ y: 10, opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.3, // Tốc độ mượt // Đường cong chuyển động
        }}
        className=" flex flex-col p-[25px] w-[300px] h-[500px] bg-bgmain"
      >
        <h2 className="text-center text-[18px] font-satoshi font-bold">
          Tiện ích
        </h2>
      </motion.div>
    </AnimatePresence>
  );
};

export default ElectricUtilities;
