import React, { useEffect, useState } from "react";
import logoUneti from "../../assets/images/logo.png";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router";

const EditUser = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const original = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    username: user?.username || "",
  };

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setUsername(user.username || "");
  }, [user]);

  const isValid =
    fullName !== original.fullName ||
    email !== original.email ||
    phone !== original.phone ||
    username !== original.username;

  const handleUpdate = async () => {
    if (!isValid) return toast.error("Không có gì để cập nhật");

    try {
      setLoading(true);

      const body = { fullName, email, phone, username };
      await axiosClient.put(`/user/${user.userID}`, body);

      const updatedUser = { ...user, ...body };
      updateUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Cập nhật thành công");
      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-[560px] h-[560px] rounded-[24px] p-[30px] flex flex-col items-center"
      style={{
        background: "var(--bg-panel)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <img src={logoUneti} alt="logo" className="w-[72px]" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center gap-[20px] mt-6"
        >
          <p
            className="text-[34px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Chỉnh sửa thông tin
          </p>

          <p
            className="text-[15px] text-center w-[420px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Cập nhật thông tin cá nhân. Thay đổi có hiệu lực ngay.
          </p>

          <div className="flex gap-[12px]">
            <div className="flex flex-col gap-[12px]">
              <Input
                label="Họ và tên"
                value={fullName}
                original={original.fullName}
                onChange={setFullName}
              />
              <Input
                label="Tên đăng nhập"
                value={username}
                original={original.username}
                onChange={setUsername}
              />
            </div>

            <div className="flex flex-col gap-[12px]">
              <Input
                label="Email"
                value={email}
                original={original.email}
                onChange={setEmail}
              />
              <Input
                label="Số điện thoại"
                value={phone}
                original={original.phone}
                onChange={setPhone}
              />
            </div>
          </div>

          <button
            disabled={!isValid || loading}
            onClick={handleUpdate}
            className="mt-4 w-[420px] py-3 rounded-[14px] font-semibold transition-all"
            style={{
              background: isValid ? "var(--accent-blue)" : "var(--bg-hover)",
              color: isValid ? "#fff" : "var(--text-tertiary)",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Input = ({ label, value, original, onChange }) => {
  const changed = value !== original;

  return (
    <div className="flex flex-col gap-1 w-[210px]">
      <p
        className="ml-2 text-sm"
        style={{
          color: changed ? "var(--accent-blue)" : "var(--text-tertiary)",
        }}
      >
        {label}
      </p>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-3 rounded-[12px] focus:outline-none transition-all"
        style={{
          background: "var(--bg-subtle)",
          border: `1.5px solid ${
            changed ? "var(--accent-blue)" : "var(--border-light)"
          }`,
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
};

export default EditUser;
