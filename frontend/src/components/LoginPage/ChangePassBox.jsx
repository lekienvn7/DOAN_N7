import React, { useState } from "react";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import logoUneti from "../../assets/images/logo.png";

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

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axiosClient.put(
        `/user/change-pass/${user.userID}`,
        { oldPass, newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) {
        toast.error(data.message || "Đổi mật khẩu thất bại!");
        return;
      }

      toast.success("Đổi mật khẩu thành công!");

      toast.success("Vui lòng đăng nhập lại!");
      window.location.reload();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Không thể kết nối đến server!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="
          w-[560px] h-[560px]
          rounded-[28px]
          bg-[var(--bg-panel)]
          shadow-[0_30px_60px_rgba(0,0,0,0.55)]
          p-[36px]
          flex flex-col items-center
          gap-[22px]
        "
      >
        <img src={logoUneti} alt="logo" className="w-[64px] mb-[10px]" />

        <h2 className="text-[28px] font-semibold text-[var(--text-primary)]">
          Cập nhật mật khẩu mới
        </h2>

        <p className="text-[15px] text-[var(--text-tertiary)] text-center">
          Đổi mật khẩu bắt buộc khi lần đầu đăng nhập hệ thống
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
          className="flex flex-col gap-[18px] mt-[10px]"
        >
          {[
            ["Mật khẩu cũ", oldPass, setOldPass],
            ["Mật khẩu mới", newPass, setNewPass],
            ["Nhập lại mật khẩu mới", confirmPass, setConfirmPass],
          ].map(([label, value, setter]) => (
            <input
              key={label}
              type="password"
              placeholder={label}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-[410px] px-4 py-3 rounded-[12px] placeholder:text-textsec transition-all focus:outline-none"
              style={{
                background: "var(--bg-subtle)",
                color: "var(--text-primary)",
                border: "1.5px solid var(--border-light)",
              }}
            />
          ))}

          <button
            disabled={loading}
            className="
              w-[410px] h-[52px]
              rounded-full
              bg-[var(--accent-blue)]
              text-white
              font-semibold
              hover:bg-[#2997FF]
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Đang cập nhật..." : "Xác nhận"}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordBox;
