import React, { useState } from "react";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import logoUneti from "../../assets/images/uneti_logo.png";

const ChangePasswordBox = ({ user, navigate }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (newPass === oldPass) {
      toast.error("Mật khẩu mới phải khác mật khẩu cũ!");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      // gọi API đổi mật khẩu
      const { data } = await axiosClient.put(
        `/user/change-pass/${user.userID}`,
        {
          oldPass,
          newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.success) {
        toast.error(data.message || "Đổi mật khẩu thất bại!");
        return;
      }

      toast.success("Đổi mật khẩu thành công!");

      // Đăng nhập lại ngay sau khi đổi mật khẩu
      const res = await axiosClient.post("/login", {
        username: user.username,
        password: newPass, // Đăng nhập với mật khẩu mới
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("Token:", localStorage.getItem("token"));
        console.log("User:", localStorage.getItem("user"));

        toast.success("Đăng nhập lại thành công!");
        navigate("/"); // Điều hướng về trang chính
      } else {
        toast.error("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      const msg =
        error.response?.data?.message || "Không thể kết nối đến server!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="login"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="w-[560px] h-[550px] p-[30px] flex flex-col gap-[20px] items-center bg-white shadow-[0_0_15px_rgba(0,0,0,0.25)] p-6 rounded-[12px]"
      >
        <img src={logoUneti} alt="logo_uneti" className="w-[100px]" />
        <h2 className="text-2xl font-bold">Cập nhật mật khẩu mới</h2>
        <p className="">Đổi mật khẩu bắt buộc khi lần đầu đăng nhập</p>
        <input
          type="password"
          placeholder="Mật khẩu cũ"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          className="w-[410px] px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-[410px] px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-[410px] px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-[410px] h-[50px] bg-black text-white font-bold rounded-[24px] hover:bg-[#2f576f] transition-all duration-300"
        >
          {loading ? "Đang cập nhật..." : "Xác nhận"}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordBox;
