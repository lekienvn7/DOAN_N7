import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainDetail from "./TelecomList";

const RepoDetail = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{
          duration: 0.3,
        }}
        className=" w-[1300px] max-h-[425px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60 p-[0px] bg-bgmain border-t-1 border-gray-700"
      >
        <MainDetail />
      </motion.div>
    </AnimatePresence>
  );
};

export default RepoDetail;
