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
          type: "tween",
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex flex-row gap-[30px] p-[40px_30px] items-center"
      >
        <UserList /> <CreateUser />
      </motion.div>
    </AnimatePresence>
  );
};

export default RolePage;
