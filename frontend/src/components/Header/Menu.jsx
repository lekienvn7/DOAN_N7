import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { name: "Trang chủ", path: "/home", key: "1" },
    { name: "Kho vật tư", path: "/error-repo", key: "2" },
    { name: "Bảo trì thiết bị", path: "/error-material", key: "3" },
    { name: "Báo cáo", path: "/error-report", key: "4" },
    { name: "Thông tin tài khoản", path: "/error-user", key: "5" },
  ];

  // Admin
  const adMenuItems = [
    { name: "Trang chủ", path: "/home", key: "1" },
    { name: "Kho vật tư", path: "/repository/mechanical", key: "2" },
    { name: "Bảo trì thiết bị", path: "/material/chemical/repair", key: "3" },
    { name: "Giao tiếp", path: "/notice", key: "4" },
    { name: "Quản lý/Phân quyền", path: "/role", key: "5" },
  ];

  // Quản lý
  const managerMenuItems = [
    { name: "Trang chủ", path: "/home", key: "1" },
    { name: "Kho vật tư", path: "/repository/mechanical", key: "2" },
    { name: "Bảo trì thiết bị", path: "/material/chemical/repair", key: "3" },
    { name: "Báo cáo", path: "/report", key: "4" },
    { name: "Thông tin tài khoản", path: "/user", key: "5" },
  ];

  const lecturerMenuItems = [
    { name: "Trang chủ", path: "/home", key: "1" },
    { name: "Kho vật tư", path: "/repository/mechanical", key: "2" },
    { name: "Bảo trì thiết bị", path: "/material/chemical/repair", key: "3" },
    { name: "Tin nhắn", path: "/notice", key: "4" },
    { name: "Thông tin tài khoản", path: "/user", key: "5" },
  ];

  // Chọn menu theo role
  const activeMenu = useMemo(() => {
    if (!user) return menuItems;
    if (user.roleID === "ADMINISTRATOR") return adMenuItems;
    if (["WH MANAGER", "MT MANAGER"].includes(user.roleID))
      return managerMenuItems;
    if (user.roleID === "LECTURER") return lecturerMenuItems;
    return menuItems;
  }, [user]);

  // Hotkeys
  useEffect(() => {
    const handleKeyPress = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (["input", "textarea"].includes(tag) || e.target.isContentEditable)
        return;

      const key = e.key.toLowerCase();
      const target = activeMenu.find((item) => item.key === key);
      if (target) {
        e.preventDefault();
        navigate(target.path);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeMenu, navigate]);

  // Helper: xác định tab active theo segment đầu
  const isActive = (path) => {
    const seg = "/" + (path.split("/")[1] || "");
    return location.pathname.startsWith(seg);
  };

  return (
    <ul className="flex flex-row gap-[30px]">
      {activeMenu.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`relative pb-5 text-[15px]
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
              after:scale-x-0 after:bg-textsec after:transition-transform after:duration-300 
              hover:after:scale-x-100
              ${
                isActive(item.path)
                  ? "text-white font-semibold after:scale-x-50"
                  : "text-[#A1A1A6] hover:text-white"
              }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
