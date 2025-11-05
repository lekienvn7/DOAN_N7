import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import TelecomUtilities from "@/components/RepoPage/TelecomWH/TelecomUtilities";
import HeaderDetail from "@/components/RepoPage/TelecomWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/TelecomWH/RepoDetail";

const TelecomWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <TelecomUtilities />
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TelecomWH;
