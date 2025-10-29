import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FindModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center item-center z-50 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Click ngoài modal thì đóng
      >
        <motion.div
          className="bg-[#2c2c2e] p-[30px] rounded-[12px] shadow-1g w-[400px] h-[500px] text-white relative mt-[120px] flex flex-col gap-[25px]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-[30px] text-center font-qurova  mb-4">
            Tìm kiếm vật tư
          </h2>

          <div>
            <input type="text" className=""/>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FindModal;
