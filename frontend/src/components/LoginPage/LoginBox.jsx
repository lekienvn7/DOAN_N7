import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import logoUneti from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import ChangePassBox from "./ChangePassBox";

const LoginBox = () => {
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

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
      const { data } = await axiosClient.post("/auth/login", {
        username,
        password,
      });

      if (!data.success) {
        toast.error(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Xin chào ${data.user.fullName}!`);

      if (data.mustChangePassword) {
        toast.info("Bạn cần đổi mật khẩu lần đầu!");
        setUserToChange(data.user);
        setShowChangePassword(true);
        return;
      }

      setTimeout(() => {
        navigate("/home");
        setTimeout(() => window.location.reload(), 1);
      }, 400);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể kết nối đến server"
      );
    } finally {
      setLoading(false);
    }
  };

  if (showChangePassword && userToChange) {
    return <ChangePassBox user={userToChange} navigate={navigate} />;
  }

  const handleForgot = () => {
    if (!email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    toast.info("Yêu cầu khôi phục đã được gửi tới quản trị viên");

    setTimeout(() => {
      setLoading(false);
      setShowForgot(false);
    }, 800);
  };

  return (
    <div
      className="
        w-[520px]
        rounded-[28px]
        bg-white
        p-[36px]
        shadow-[0_24px_60px_rgba(0,0,0,0.12)]
        flex flex-col items-center
      "
    >
      <img src={logoUneti} alt="logo" className="w-[64px] mb-[10px]" />

      <AnimatePresence mode="wait">
        {!showForgot ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex flex-col items-center gap-[22px]"
          >
            <p className="text-[36px] font-bold text-[var(--text-primary)]">
              ĐĂNG NHẬP
            </p>

            <p className="text-[15px] text-[var(--text-secondary)] text-center px-4">
              Sử dụng tài khoản được cấp để truy cập hệ thống quản lý kho.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="flex flex-col gap-[18px] w-full items-center"
            >
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-[420px]
                  px-4 py-3
                  rounded-[14px]
                  border border-[var(--border-light)]
                  bg-[var(--bg-subtle)]
                  text-[var(--text-primary)]
                  placeholder:text-[var(--text-tertiary)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--accent-blue)]
                "
              />

              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-[420px]
                  px-4 py-3
                  rounded-[14px]
                  border border-[var(--border-light)]
                  bg-[var(--bg-subtle)]
                  text-[var(--text-primary)]
                  placeholder:text-[var(--text-tertiary)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--accent-blue)]
                "
              />

              <button
                type="submit"
                className="
                  w-[420px]
                  h-[52px]
                  rounded-[16px]
                  bg-[var(--accent-blue)]
                  text-white
                  font-semibold
                  hover:bg-[var(--accent-blue-hover)]
                  transition
                  flex items-center justify-center cursor-pointer
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý…
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            <button
              onClick={() => setShowForgot(true)}
              className="text-[14px] text-[var(--accent-blue)] hover:underline"
            >
              Quên mật khẩu?
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col items-center gap-[22px]"
          >
            <p className="text-[32px] font-bold text-[var(--text-primary)]">
              Khôi phục mật khẩu
            </p>

            <p className="text-[15px] text-[var(--text-secondary)] text-center">
              Nhập email để gửi yêu cầu khôi phục.
            </p>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="
                w-[420px]
                px-4 py-3
                rounded-[14px]
                border border-[var(--border-light)]
                bg-[var(--bg-subtle)]
                text-[var(--text-primary)]
                placeholder:text-[var(--text-tertiary)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--accent-blue)]
              "
            />

            <button
              onClick={handleForgot}
              className="
                w-[420px]
                h-[52px]
                rounded-[16px]
                bg-[var(--accent-blue)]
                text-white
                font-semibold
                hover:bg-[var(--accent-blue-hover)]
                transition
              "
            >
              {loading ? "Đang gửi…" : "Gửi yêu cầu"}
            </button>

            <button
              onClick={() => setShowForgot(false)}
              className="text-[14px] text-[var(--accent-blue)] hover:underline"
            >
              ← Quay lại đăng nhập
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginBox;
