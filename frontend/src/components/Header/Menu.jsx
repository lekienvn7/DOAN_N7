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
    { name: "Báo cáo tháng", path: "/error-report", key: "4" },
    { name: "Chỉnh sửa thông tin", path: "/user", key: "5" },
  ];

  const adMenuItems = [
    { name: "Trang chủ", path: "/home", key: "1" },
    { name: "Kho vật tư", path: "/repository/electric", key: "2" },
    { name: "Thanh lý vật tư", path: "/material/problematic", key: "3" },
    { name: "Chỉnh sửa thông tin", path: "/user", key: "4" },
    { name: "Báo cáo tháng", path: "/budget", key: "5" },
    { name: "Quản lý / Phân quyền", path: "/role", key: "6" },
  ];

  const managerMenuItems = [
    { name: "Trang chủ", path: "/home", key: "1" },
    { name: "Kho vật tư", path: "/repository/electric", key: "2" },
    { name: "Thanh lý vật tư", path: "/material/problematic", key: "3" },
    { name: "Báo cáo tháng", path: "/budget", key: "4" },
    { name: "Chỉnh sửa thông tin", path: "/user", key: "5" },
  ];

  const lecturerMenuItems = managerMenuItems;

  const activeMenu = useMemo(() => {
    if (!user) return menuItems;
    if (user.roleID === "ADMINISTRATOR") return adMenuItems;
    if (["WH MANAGER", "MT MANAGER"].includes(user.roleID))
      return managerMenuItems;
    if (user.roleID === "LECTURER") return lecturerMenuItems;
    return menuItems;
  }, [user]);

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

  const isActive = (path) => {
    const seg = "/" + (path.split("/")[1] || "");
    return location.pathname.startsWith(seg);
  };

  return (
    <ul className="flex flex-row gap-[36px] font-googleSans">
      {activeMenu.map((item) => {
        const active = isActive(item.path);

        return (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`
                relative
                pb-[6px]
                text-[14px]
                transition-colors
                duration-200

                ${
                  active
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }

                after:absolute
                after:left-0
                after:-bottom-[7px]
                after:h-[2px]
                after:w-full
                after:rounded-full
                after:bg-[var(--accent-blue)]
                after:transition-transform
                after:duration-300
                after:origin-left
                ${
                  active
                    ? "after:scale-x-100"
                    : "after:scale-x-0 hover:after:scale-x-100"
                }
              `}
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
