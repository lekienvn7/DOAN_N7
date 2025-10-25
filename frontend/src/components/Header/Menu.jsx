import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation(); // 👈 Lấy đường dẫn hiện tại

  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Kho vật tư", path: "/repository" },
    { name: "Thiết bị/Dụng cụ", path: "/material" },
    { name: "Quản lý/Phân quyền", path: "/role" },
    { name: "Báo cáo", path: "/report" },
  ];

  return (
    <ul className="flex flex-row gap-[20px]">
      {menuItems.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`relative pb-1
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
              after:scale-x-0 after:bg-black after:transition-transform after:duration-300 
              hover:after:scale-x-100
              ${
                location.pathname === item.path
                  ? "text-black font-semibold after:scale-x-100"
                  : "text-[#6e6e6e] hover:text-black"
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
