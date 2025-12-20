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

  // original để so sánh
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
    if (!isValid) return toast.error("Không có gì để cập nhật 😴");

    try {
      setLoading(true);

      const body = { fullName, email, phone, username };
      const res = await axiosClient.put(`/user/${user.userID}`, body);

      // cập nhật lại auth context + localStorage
      const updatedUser = { ...user, ...body };
      updateUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Cập nhật tài khoản thành công");
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Lỗi khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box w-[560px] h-[600px] rounded-[24px] flex flex-col items-center p-[30px] bg-bgmain">
      <img
        src={logoUneti}
        alt="logo_uneti"
        className="w-[80px] brightness-[0%] invert-[100%]"
      />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-[20px] mt-5"
        >
          <p className="text-[36px] font-bold text-textpri">
            CHỈNH SỬA THÔNG TIN
          </p>

          <p className="text-[15px] w-[420px] text-textsec text-center">
            Cập nhật thông tin cá nhân. Thay đổi sẽ có hiệu lực ngay.
          </p>

          <div className="flex flex-row gap-[10px]">
            <div className="flex flex-col gap-[10px]">
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

            <div className="flex flex-col gap-[10px]">
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
            className={`mt-4 w-[420px] py-3 rounded-[14px] font-semibold transition-all 
              ${
                isValid
                  ? "bg-[#c7a7ff] text-black hover:bg-[#e8d6ff] cursor-pointer"
                  : "bg-gray-700 text-textsec cursor-not-allowed"
              }`}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Input = ({ label, value, original, onChange }) => (
  <div className="flex flex-col gap-1 w-[210px]">
    <p
      className={`ml-2 text-sm ${
        value === original ? "text-textsec" : "text-[#c7a7ff]"
      }`}
    >
      {label}
    </p>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`p-3 rounded-[12px] bg-[#2c2c2e] border-2
        ${
          value === original
            ? "border-textsec text-textsec"
            : "border-[#c7a7ff] text-white"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  </div>
);

export default EditUser;
