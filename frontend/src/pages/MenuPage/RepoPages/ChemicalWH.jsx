import React from "react";
import RepoDetail from "@/components/RepoPage/ChemicalWH/RepoDetail";
import ChemicalUtilities from "@/components/RepoPage/ChemicalWH/ChemicalUtilities";
import HeaderDetail from "@/components/RepoPage/ChemicalWH/HeaderDetail";
import { motion, AnimatePresence } from "framer-motion";

const ChemicalWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <ChemicalUtilities />
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChemicalWH;
