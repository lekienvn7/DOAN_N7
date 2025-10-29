import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/authContext";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import UtilityPanel from "./UtilityPanel";

const UtilityBox = () => {
  const { repoID } = useParams();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(null); // Hiện form "add": thêm vật tư; "delete": xóa vật tư; "null": ẩn hết
  const { formData, setFormData } = useState(); // Lưu dữ liệu đã nhập trong modal
  const { user } = useAuth(); // Lấy thông tin người đang đăng nhập

  const togglePanel = () => setOpen(!open); // Bật/tắt "open"
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // khi nhập vào 1 ô: lấy name làm key, lấy value làm giá trị, cập nhật formData
  };

  const handleSubmit = async (type) => {
    try {
      if (type === "add") {
        await axiosClient.put(`/repository/${repoID}`, formData);
        toast.success("Thêm vật tư thành công!");
      } else if (type === "delete") {
        await axiosClient.delete(`/repository/${repoID}`, formData);
        toast.success("Xóa vật tư thành công");
      }
      setShowModal(null);
    } catch (error) {
      console.log("Lỗi hệ thống", error);
      toast.error("Lỗi hệ thống thêm xóa!");
    }
  };

  return (
    <div>
      <motion.button
        onClick={togglePanel}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="absolute top-[150px] left-[-10px] bg-[#2c2c2e] flex items-center  h-[70px] w-[50px] p-[10px] pl-[15px] shadow-[0_15px_25px_rgba(0,0,0,0),_0_10px_15px_rgba(0,0,0,0.4)] rounded-[12px] cursor-pointer z-40"
      >
        <ChevronRight
          strokeWidth={2}
          className={`transition-transform ${
            open ? "rotate-180" : "rotate- 0"
          }`}
        />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -150, opacity: 0 }}
            className="absolute top-[150px] p-[25px] left-[0] bg-[#2c2c2e] shadow-[0_15px_25px_rgba(0,0,0,0),_0_10px_15px_rgba(0,0,0,0.4)] rounded-[12px]"
          >
            <UtilityPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UtilityBox;
