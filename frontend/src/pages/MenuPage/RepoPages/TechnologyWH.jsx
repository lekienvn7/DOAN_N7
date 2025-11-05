import React from "react";
import { AnimatePresence,motion } from "framer-motion";
import TechnologyUtilities from "@/components/RepoPage/TechnologyWH/TechnologyUtilities";
import HeaderDetail from "@/components/RepoPage/TechnologyWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/TechnologyWH/RepoDetail";

const TechnologyWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <TechnologyUtilities/>
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TechnologyWH;
