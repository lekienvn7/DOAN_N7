import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import logoUneti from "../../assets/images/uneti_logo.png";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import ChangePassBox from "./ChangePassBox";

const LoginBox = () => {
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate(); // hook điều hướng

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userToChange, setUserToChange] = useState(null);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);

      // Gọi API bằng axiosClient
      const { data } = await axiosClient.post("/login", { username, password });

      // Nếu yêu cầu đổi mật khẩu lần đầu
      if (data.mustChangePassword) {
        toast.info("Bạn cần đổi mật khẩu lần đầu!");

        // Lưu token tạm thời
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUserToChange(data.user);
        setShowChangePassword(true);
        return;
      }

      // Nếu đăng nhập thất bại
      if (!data.success) {
        toast.error(data.message || "Sai tài khoản hoặc mật khẩu");
        return; // Không load trang
      }

      // Nếu đăng nhập thành công
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Đăng nhập thành công");
      toast.success(`Xin chào ${data.user.fullName}!`, { duration: 2000 });

      // Dùng navigate để chuyển ngay UI, sau đó reload nhẹ để reset context
      setTimeout(() => {
        navigate("/"); // Chuyển route trước
        setTimeout(() => {
          window.location.reload(); // Reload sau để đảm bảo load lại AuthProvider, context, v.v.
        }, 1); // Chờ 150ms cho navigate hoạt động trước
      }, 500);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const msg =
        error.response?.data?.message || "Không thể kết nối đến server";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Nếu đang trong giai đoạn đổi mật khẩu
  if (showChangePassword && userToChange) {
    return <ChangePassBox user={userToChange} navigate={navigate} />;
  }

  const handleForgot = () => {
    setLoading(true);
    if (!email) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    toast.info(
      "Đã gửi yêu cầu reset mật khẩu đến Admin. Vui lòng kiểm tra email của bạn.",
      { duration: 2000 }
    );

    setTimeout(() => {
      setLoading(false);
      setShowForgot(false);
    }, 1000);
  };

  return (
    <div
      className="
        login-box
        w-[560px] h-[550px]
        rounded-[24px] flex flex-col items-center
        p-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.85),_0_-10px_30px_rgba(0,0,0,0.4),_0_0_50px_rgba(255,255,255,0.05)]
        bg-[#1d1d1f] overflow-hidden relative
      "
    >
      <img
        src={logoUneti}
        alt="logo_uneti"
        className="w-[120px] brightness-0 invert"
      />

      <AnimatePresence mode="wait">
        {!showForgot ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-[25px] mt-5"
          >
            <p className="text-[25px] font-bold text-center text-[#ffffff]">
              Đăng nhập vào tài khoản được cấp
            </p>

            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[410px] px-4 py-3 bg-[#2C2C2E] text-[#ffffff]
                         border-[2px] border-[#5E5E60] rounded-[12px]
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         placeholder:text-gray-400 transition-all duration-200"
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[410px] px-4 py-3 bg-[#2C2C2E] text-[#ffffff]
                         border-[2px] border-[#5E5E60] rounded-[12px]
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         placeholder:text-gray-400 transition-all duration-200"
            />

            <button
              onClick={handleLogin}
              className="w-[410px] h-[55px] rounded-[24px] bg-[#0A84FF]
                         text-white font-bold hover:bg-[#2997FF] hover:scale-105
                         transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                         flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>

            <p
              onClick={() => setShowForgot(true)}
              className="text-[#0A84FF] text-sm cursor-pointer hover:underline transition-all duration-200"
            >
              Quên mật khẩu?
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-[25px] mt-5"
          >
            <p className="text-[25px] font-bold text-center text-[#ffffff]">
              Khôi phục mật khẩu
            </p>
            <p className="text-[#A1A1A6] text-center w-[400px] text-sm leading-snug">
              Nhập email của bạn để gửi yêu cầu lấy lại mật khẩu.
            </p>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email hoặc số điện thoại"
              className="w-[410px] px-4 py-3 bg-[#2C2C2E] text-[#ffffff]
                         border-[2px] border-[#5E5E60] rounded-[12px]
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         placeholder:text-gray-400 transition-all duration-200"
            />

            <button
              onClick={handleForgot}
              className="w-[410px] h-[55px] rounded-[24px] bg-[#0A84FF]
                         text-white font-bold hover:bg-[#2997FF] hover:scale-105
                         transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.2)]
                         flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Gửi yêu cầu"
              )}
            </button>

            <p
              onClick={() => setShowForgot(false)}
              className="text-[#0A84FF] text-sm cursor-pointer hover:text-[#2997FF] transition-all duration-200"
            >
              ← Quay lại đăng nhập
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginBox;
