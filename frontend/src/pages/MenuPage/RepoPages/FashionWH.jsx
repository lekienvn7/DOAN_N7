import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import FashionUtilities from "@/components/RepoPage/FashionWH/FashionUtilities";
import HeaderDetail from "@/components/RepoPage/FashionWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/FashionWH/RepoDetail";

const FashionWH = () => {
  return (
    <AnimatePresence>
      <motion.div className="flex flex-row">
        <FashionUtilities />
        <div className="flex flex-col">
          <HeaderDetail />
          <RepoDetail />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FashionWH;
