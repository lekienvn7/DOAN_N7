import React from "react";
import HeaderLogo from "./Logo";
import Menu from "./Menu";
import LoginButton from "./LoginButton";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); // Kiểm tra URL hiện tại

  return (
    <div className="header__container sticky flex flex-row items-center text-center m-[0px_25px] p-[30px] h-[50px] gap-[40px] w-screen bg-[#f8f9fa">
      <HeaderLogo />
      <div className="sticky left-[500px]">
        <Menu />
      </div>
      <div className="sticky left-[1500px]">{<LoginButton />}</div>
    </div>
  );
};

export default Header;
