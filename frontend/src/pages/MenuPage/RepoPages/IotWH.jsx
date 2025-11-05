import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import IotUtilities from "@/components/RepoPage/IotWH/IotUtilities";
import HeaderDetail from "@/components/RepoPage/IotWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/IotWH/RepoDetail";

const IotWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <IotUtilities />
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IotWH;
