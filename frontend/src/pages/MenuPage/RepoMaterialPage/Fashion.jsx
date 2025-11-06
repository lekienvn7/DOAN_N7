import React from "react";
import { Outlet } from "react-router";
import MaterialHeader from "@/components/MaterialPage/MaterialHeader";
import { AnimatePresence, motion } from "framer-motion";

const Fashion = () => {
  return (
    <div className="flex flex-col">
      <AnimatePresence>
        <div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.8, 0.25, 1],
          }}
        >
          <MaterialHeader />
        </div>
      </AnimatePresence>
      <hr className="m-[0px_35px] text-gray-400" />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Fashion;
