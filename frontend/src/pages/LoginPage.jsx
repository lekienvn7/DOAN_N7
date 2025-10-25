import React from "react";
import Header from "@/components/Header/Header";
import LoginBox from "@/components/LoginPage/LoginBox";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./Layout";

const LoginPage = () => {
  return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ x: -200, opacity: 0 }} // Bắt đầu lệch trái + mờ
            animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
            exit={{ x: 200, opacity: 0 }} // Khi rời trang (nếu có)
            transition={{
              duration: 0.8, // Tốc độ mượt
              ease: [0.25, 0.8, 0.25, 1], // Đường cong chuyển động
            }}
            className=""
          >
            <LoginBox />
          </motion.div>
        </AnimatePresence>
      </div>
  );
};

export default LoginPage;
