import React from "react";
import { Outlet } from "react-router-dom";
import RepoMenu from "@/components/RepoPage/RepoMenu";
import { motion } from "framer-motion";

const Warehouse = () => {
  return (
    <div className="text-white">
      {/* Thanh menu cố định */}
      <motion.div className="sticky h-[100px] top-0 w-screen p-[20px] flex flex-row items-center justify-center bg-[#121212]  z-50">
        <RepoMenu />
      </motion.div>

      {/* Vùng hiển thị trang con */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Warehouse;
