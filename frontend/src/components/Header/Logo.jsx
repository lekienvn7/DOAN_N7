import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <span>
        <span className="text-[var(--accent-blue)]">AD</span>
        <span className="text-[var(--text-primary)]">ministrator</span>
      </span>
    );
  } else if (roleID === "WH MANAGER") {
    logoContent = (
      <span>
        <span className="text-[var(--accent-blue)]">Warehouse</span>
        <span className="text-[var(--text-primary)]">Manager</span>
      </span>
    );
  } else if (roleID === "MT MANAGER") {
    logoContent = (
      <span>
        <span className="text-[var(--accent-blue)]">Maintenance</span>
        <span className="text-[var(--text-primary)]">Manager</span>
      </span>
    );
  } else {
    logoContent = (
      <span>
        <span className="text-[var(--text-primary)]">Uneti</span>
        <span className="text-[var(--accent-blue)]">Warehouse</span>
      </span>
    );
  }

  return (
    <header className="flex items-center">
      <Link
        to="/home"
        className="
          font-qurova
          text-[20px]
          font-semibold
          tracking-tight
          transition-opacity
          hover:opacity-80
        "
      >
        {logoContent}
      </Link>
    </header>
  );
};

export default HeaderLogo;
