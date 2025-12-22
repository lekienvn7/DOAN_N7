import React from "react";
import { Outlet } from "react-router-dom";
import RepoMenu from "@/components/RepoPage/RepoMenu";
import { motion } from "framer-motion";

const Warehouse = () => {
  return (
    <div className="text-[var(--text-primary)] bg-[var(--bg-page)]">
      {/* ===== REPO MENU BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          sticky
          z-50
          top-[0px]
          h-[60px]
          w-screen
          flex
          flex-row
          items-center
          justify-center
          bg-[var(--bg-panel)]
          backdrop-blur-[14px]
        "
      >
        <RepoMenu />
      </motion.div>

      {/* ===== PAGE CONTENT ===== */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Warehouse;
