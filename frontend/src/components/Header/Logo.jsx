import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoUneti from "../../assets/images/logo.png";

const HeaderLogo = () => {
  const [roleID, setRoleID] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.roleID) {
          setRoleID(parsedUser.roleID);
        }
      } catch (error) {
        console.error("Lỗi đọc user:", error);
      }
    }
  }, []);

  let logoContent;

  if (roleID === "ADMINISTRATOR") {
    logoContent = (
      <p className="font-qurova font-bold text-[#0a84ff]">
        AD<span className="text-textpri">ministrator</span>
      </p>
    );
  } else if (roleID === "WH MANAGER") {
    logoContent = (
      <p className="font-qurova font-bold text-[#0a84ff]">
        WH<span className="text-[#ffffff]">Manager</span>
      </p>
    );
  } else if (roleID === "MT MANAGER") {
    logoContent = (
      <p className="font-qurova font-bold text-[#0a84ff]">
        MT<span className="text-[#ffffff]">MANAGER</span>
      </p>
    );
  } else {
    logoContent = (
      <p className="font-qurova font-bold text-textpri">
        Uneti<span className="text-[#0a84ff]">Warehouse</span>
      </p>
    );
  }

  return (
    <header className="flex items-center justify-between mt-[10px]">
      <Link
        to="/home"
        className="header__logo font-qurova no-underline
          text-[#FFFFFF] text-[20px] font-bold hover:text-[#E5E5E7]"
      >
        {logoContent}
      </Link>
    </header>
  );
};

export default HeaderLogo;
