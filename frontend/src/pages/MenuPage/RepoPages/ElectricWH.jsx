import React from "react";
import RepoDetail from "@/components/RepoPage/ElectricWH/RepoDetail";
import ElectricUtilities from "@/components/RepoPage/ElectricWH/ElectricUtilities";
import { motion, AnimatePresence } from "framer-motion";

const ElectricWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row gap-[35px]">
        <ElectricUtilities />
        <RepoDetail />
      </motion.div>
    </AnimatePresence>
  );
};

export default ElectricWH;
