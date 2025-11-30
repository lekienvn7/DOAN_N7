import React from "react";
import HeaderMenu from "./MaterialMenu";
import { useLocation } from "react-router-dom";

const MaterialHeader = () => {
  const location = useLocation();
  const repoList = [
    { name: "hóa chất", path: "/material/chemical" },
    { name: "điện", path: "/material/electric" },
    { name: "cơ khí", path: "/material/mechanical" },
    { name: "nhúng và Iot", path: "/material/iot" },
    { name: "công nghệ thông tin", path: "/material/technology" },
    { name: "công nghệ ô tô", path: "/material/automotive" },
    { name: "điện tử viễn thông", path: "/material/telecom" },
    { name: "thời trang", path: "/material/fashion" },
  ];

  const currentRepo = repoList.find((repo) =>
    location.pathname.startsWith(repo.path)
  );

  return (
    <div className="sticky bg-bgmain w-[calc(100vw-280px)] h-[145px] p-[35px] text-textpri border-t-1 border-gray-700">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-[20px]">
          <p className="font-bold text-[35px]">
            Bảo trì vật tư{" "}
            <span className="text-[#ffd700] text-[35px]">
              {currentRepo ? currentRepo.name : "Chưa chọn kho"}
            </span>
          </p>

          <HeaderMenu />
        </div>
        <button className="h-[30px] w-[100px] p-[5px] font-bold text-[14px] text-center  bg-highlightcl rounded-[12px] cursor-pointer hover:bg-[#2563eb] transition-all duration-300">
          Xuất file
        </button>
      </div>
    </div>
  );
};

export default MaterialHeader;
