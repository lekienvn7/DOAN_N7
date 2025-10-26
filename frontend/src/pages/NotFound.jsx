import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import notFound from "../assets/images/404NotFound.png";
import vegeta from "../assets/images/vegeta.jpg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="not-found"
        initial={{ x: -200, opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ x: 200, opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.8, // Tốc độ mượt
          ease: [0.25, 0.8, 0.25, 1], // Đường cong chuyển động
        }}
        className="flex items-center justify-center mt-[80px]"
      >
        <div className="flex flex-row gap-[20px] items-center justify-center">
          <div className="flex flex-col mt-[50px] gap-[20px] items-center justify-center">
            <img
              src={notFound}
              alt="404 Not Found"
              className="w-[70%] brightness-0 invert"
            />
            <button
              onClick={() => navigate("/") || (window.location.href = "/")}
              className="flex items-center justify-center cursor-pointer text-white text-2xl w-[250px]
               bg-none p-[10px] border-[5px] border-[#5E5E60] rounded-[24px]
               hover:bg-[#5E5E60] hover:scale-[1.03]
               transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Quay về
            </button>
          </div>
          <img
            src={vegeta}
            alt="Vegeta"
            className="w-[30%] brightness-0 invert"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotFound;
