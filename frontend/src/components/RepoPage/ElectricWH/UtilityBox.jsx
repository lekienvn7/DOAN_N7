import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/authContext";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const { repoID } = useParams();

const UtilityBox = () => {
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
      }
    } catch (error) {
      console.log("Lỗi hệ thống", error);
      toast.error("Lỗi hệ thống thêm xóa!");
    }
  };

  return div;
};

export default UtilityBox;
