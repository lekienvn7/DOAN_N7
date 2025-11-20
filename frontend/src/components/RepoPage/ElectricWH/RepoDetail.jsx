import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ElectricList from "./ElectricList";

const RepoDetail = ({ mode, reload, searchData }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.5,
        }}
        className=" w-[1300px] max-h-[465px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60 p-[0px] bg-bgmain border-t-1 border-gray-700"
      >
        <ElectricList
          key={reload}
          mode={mode}
          reload={reload}
          searchData={searchData}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default RepoDetail;
