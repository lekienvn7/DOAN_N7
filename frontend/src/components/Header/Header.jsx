import React from "react";
import HeaderLogo from "./Logo";
import Menu from "./Menu";
import LoginButton from "./LoginButton";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <div
      className="
        header__container
        sticky
        top-0
        z-50
        flex
        flex-row
        items-center
        justify-between
        gap-[40px]
        w-full
        px-[2.5%]
        h-[45px]
        bg-[rgba(255,255,255,0.85)]
        backdrop-blur-md

        text-[var(--text-primary)]
      "
    >
      <HeaderLogo />

      <Menu />

      <LoginButton />
    </div>
  );
};

export default Header;
