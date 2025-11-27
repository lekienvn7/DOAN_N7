import React from "react";
import HeaderLogo from "./Logo";
import Menu from "./Menu";
import LoginButton from "./LoginButton";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); // Kiểm tra URL hiện tại

  return (
    <div className="header__container sticky flex flex-row items-center justify-between text-center m-[0%_2.5%] py-[30px] h-[50px] gap-[40px] w-screen bg-[#f8f9fa">
      <div className="w-[70%] flex flex-row items-center justify-between text-center">
        <HeaderLogo />
    
        <Menu />
      </div>

      <div className="">{<LoginButton />}</div>
    </div>
  );
};

export default Header;
