import React from "react";
import { useState } from "react";
import RepoDetail from "@/components/RepoPage/ElectricWH/RepoDetail";
import ElectricUtilities from "@/components/RepoPage/ElectricWH/ElectricUtilities";
import HeaderDetail from "@/components/RepoPage/ElectricWH/HeaderDetail";
import { motion, AnimatePresence } from "framer-motion";

const ElectricWH = () => {
  const [mode, setMode] = useState("view");

  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <ElectricUtilities />
        <div className="flex flex-col">
          <HeaderDetail mode={mode} setMode={setMode} />
          <RepoDetail mode={mode} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ElectricWH;
