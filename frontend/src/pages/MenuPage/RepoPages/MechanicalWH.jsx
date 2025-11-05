import React from "react";
import MechanicalUtilities from "@/components/RepoPage/MechanicalWH/MechanicalUtilities";
import HeaderDetail from "@/components/RepoPage/MechanicalWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/MechanicalWH/RepoDetail";
import { motion, AnimatePresence } from "framer-motion";

const MechanicalWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <MechanicalUtilities />
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MechanicalWH;
