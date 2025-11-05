import React from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderMenu = () => {
  const location = useLocation();

  const menuList = [
    { name: "Cần bảo trì", path: "/material" },
    { name: "Đang bảo trì", path: "/" },
    { name: "Hỏng", path: "/" },
  ];

  return (
    <div>
      <ul className="flex flex-row gap-[15px] text-textsec">
        {menuList.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`relative pb-4
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full 
              after:scale-x-0 after:bg-[#ffd700] after:transition-transform after:duration-300 
              hover:after:scale-x-100
              transition ${
                location.pathname === item.path
                  ? "text-[#ffd700] font-semibold after:scale-x-100"
                  : "hover:text-[#ffd700]"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderMenu;
