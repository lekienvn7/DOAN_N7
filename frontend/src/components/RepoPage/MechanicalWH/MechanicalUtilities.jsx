import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MechanicalUtilities = () => {
  return (
    <AnimatePresence>
      <div className=" flex flex-col p-[15px] w-[240px] h-[calc(100vh-160px)] bg-bgmain border-t-1 border-r-1  border-gray-700">
        <div>
          <h2 className="text-center text-[18px] font-satoshi font-bold">
            Tổng quan
          </h2>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default MechanicalUtilities;
