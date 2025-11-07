import React from "react";
import { LogIn } from "lucide-react";
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
      // Gọi API backend xoá session + cookie
      await axiosClient.post("/login/logout", {}, { withCredentials: true });

      // Xoá token trong context/frontend
      logout();

      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        window.location.href = "/home";
      }, 500);
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
        group flex items-center gap-0 overflow-hidden whitespace-nowrap
        rounded-md  text-[#ffffff] font-bold px-3 py-2 
       transition-all duration-300 hover:gap-2 cursor-pointer"
        >
          <LogIn className="size-5 group-hover:color-[]" strokeWidth={3} />
          <span
            className="
              max-w-0 opacity-0 overflow-hidden
              transition-all duration-300 group-hover:max-w-[100px] group-hover:opacity-100"
          >
            Đăng xuất
          </span>
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="
                group flex items-center gap-0 overflow-hidden whitespace-nowrap
                rounded-md  text-[#ffffff] font-bold px-3 py-2 
                transition-all duration-500 ease-out hover:gap-2 cursor-pointer
                "
        >
          <LogIn className="size-5 group-hover:color-[]" strokeWidth={3} />
          <span
            className="
      max-w-0 opacity-0 overflow-hidden
      transition-all duration-300 group-hover:max-w-[100px] group-hover:opacity-100
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
