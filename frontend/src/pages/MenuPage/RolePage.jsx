import React from "react";
import UserList from "@/components/RolePage/UserListHeader";
import CreateUser from "@/components/RolePage/CreateUser";
import { AnimatePresence, motion } from "framer-motion";

const RolePage = () => {

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -20, opacity: 0 }} // Bắt đầu lệch trái + mờ
        animate={{ x: 0, opacity: 1 }} // Di chuyển về giữa + hiện rõ
        exit={{ x: 20, opacity: 0 }} // Khi rời trang (nếu có)
        transition={{
          duration: 0.8, // Tốc độ mượt
          ease: [0.25, 0.8, 0.25, 1], // Đường cong chuyển động
        }}
        className="flex flex-row gap-[25px] p-[40px_20px] items-center"
      >
        <UserList /> <CreateUser />
      </motion.div>
    </AnimatePresence>
  );
};

export default RolePage;
