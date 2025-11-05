import React from "react";
import AutomotiveUtilities from "@/components/RepoPage/AutomotiveWH/AutomotiveUtilities";
import { motion, AnimatePresence } from "framer-motion";
import HeaderDetail from "@/components/RepoPage/AutomotiveWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/AutomotiveWH/RepoDetail";

const AutoWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <AutomotiveUtilities />
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoWH;
