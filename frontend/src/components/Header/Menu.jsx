import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const Menu = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Kho vật tư", path: "/error-repo" },
    { name: "Thiết bị/Dụng cụ", path: "/error-material" },
    { name: "Báo cáo", path: "/error-report" },
    { name: "Thông tin tài khoản", path: "/error-user" },
  ];

  const adMenuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Kho vật tư", path: "/repository" },
    { name: "Thiết bị/Dụng cụ", path: "/material" },
    { name: "Giao tiếp", path: "/notice" },
    { name: "Quản lý/Phân quyền", path: "/role" },
  ];

  const managerMenuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Kho vật tư", path: "/repository" },
    { name: "Thiết bị/Dụng cụ", path: "/material" },
    { name: "Báo cáo", path: "/report" },
    { name: "Thông tin tài khoản", path: "/user" },
  ];

  let activeMenu = menuItems;

  if (user) {
    if (user.roleID === "ADMINISTRATOR") {
      activeMenu = adMenuItems;
    } else if (["WH MANAGER", "MT MANAGER"].includes(user.roleID)) {
      activeMenu = managerMenuItems;
    }
  }
  return (
    <ul className="flex flex-row gap-[25px]">
      {activeMenu.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`relative pb-4
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
              after:scale-x-0 after:bg-textsec after:transition-transform after:duration-300 
              hover:after:scale-x-100
              ${
                location.pathname === item.path
                  ? "text-[#ffffff] font-semibold after:scale-x-50"
                  : "text-[#A1A1A6] hover:text-[#ffffff]"
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
