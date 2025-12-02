import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MechanicalList from "./MechanicalList";

const RepoDetail = ({ mode, reload, searchData, sortMode, onReload }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.5,
        }}
        className=" w-[calc(100vw-240px)] max-h-[calc(100vh-270px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60 p-[0px] bg-bgmain border-t-1 border-gray-700"
      >
        <MechanicalList
          key={reload}
          mode={mode}
          reload={reload}
          searchData={searchData}
          sortMode={sortMode}
          onReload={onReload}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default RepoDetail;
