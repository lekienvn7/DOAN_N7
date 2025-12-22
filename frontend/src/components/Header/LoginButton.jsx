import React from "react";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import axiosClient from "@/api/axiosClient";

const SearchBox = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    toast.success("Xin mời đăng nhập!");
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout", {}, { withCredentials: true });
      logout();
      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        window.location.href = "/home";
      }, 400);
    } catch (error) {
      console.error("Lỗi khi logout:", error);
      toast.error("Không thể đăng xuất. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleLogout}
          className="
            group
            flex items-center gap-[6px]
            px-[10px] py-[6px]
            rounded-[10px]
            transition-all duration-200
            hover:bg-[var(--bg-hover)]
          "
        >
          <LogOut
            className="
              size-[18px]
              text-[var(--text-secondary)]
              group-hover:text-[var(--accent-blue)]
              transition-colors
            "
            strokeWidth={2}
          />
          <span
            className="
              text-[14px]
              text-[var(--text-primary)]
              font-medium
              max-w-0 opacity-0 overflow-hidden
              transition-all duration-300
              group-hover:max-w-[80px] group-hover:opacity-100
            "
          >
            Đăng xuất
          </span>
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="
            group
            flex items-center gap-[6px]
            px-[10px] py-[6px]
            rounded-[10px]
            transition-all duration-200
            hover:bg-[var(--bg-hover)]
          "
        >
          <LogIn
            className="
              size-[18px]
              text-[var(--text-secondary)]
              group-hover:text-[var(--accent-blue)]
              transition-colors
            "
            strokeWidth={2}
          />
          <span
            className="
              text-[14px]
              text-[var(--text-primary)]
              font-medium
              max-w-0 opacity-0 overflow-hidden
              transition-all duration-300
              group-hover:max-w-[80px] group-hover:opacity-100
            "
          >
            Đăng nhập
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchBox;
