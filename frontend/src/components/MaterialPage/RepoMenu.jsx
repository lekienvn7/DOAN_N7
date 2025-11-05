import React from "react";
import { Link, useLocation } from "react-router-dom";

const RepoMenu = () => {
  const location = useLocation();

  const repoList = [
    { name: "Kho hóa chất", path: "/" },
    { name: "Kho điện", path: "/" },
    { name: "Kho cơ khí", path: "/" },
    { name: "Kho nhúng và Iot", path: "/" },
    { name: "Kho công nghệ thông tin", path: "/" },
    { name: "Kho công nghệ oto", path: "/" },
    { name: "Kho điện tử viễn thông", path: "/" },
    { name: "Kho thời trang", path: "/" },
  ];

  return (
    <div className="w-[250px] h-[calc(100vh-60px)] p-[35px_15px] bg-bgmain border-t-1 border-r-1  border-gray-700">
      <div className="flex flex-col gap-[40px] items-left">
        <p className="text-[20px] font-bold text-[#ffd700]">Danh sách kho</p>
        <ul className="flex flex-col gap-[10px] text-textpri">
          {repoList.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`transition ${
                  location.pathname === item.path
                    ? "text-textpri font-semibold"
                    : "hover:text-highlightcl"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RepoMenu;
