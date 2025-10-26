import React, { useEffect, useState } from "react";
import "@/assets/css/Header/header.css";
import { Link } from "react-router-dom";

const HeaderLogo = () => {
  const [userName, setUserName] = useState("UNETI");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.roleID) {
          setUserName(parsedUser.roleID);
        }
      } catch (error) {
        console.error("Lỗi đọc user:", error);
      }
    }
  }, []);

  return (
    <header className="flex items-center justify-between mt-[10px]">
      <Link
        to="/"
        className="header__logo font-qurova no-underline
        text-[#FFFFFF] text-[25px] font-bold hover:text-[#E5E5E7]"
      >
        {userName}
      </Link>
    </header>
  );
};

export default HeaderLogo;
