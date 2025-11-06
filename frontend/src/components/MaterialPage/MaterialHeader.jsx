import React from "react";
import HeaderMenu from "./MaterialMenu";

const MaterialHeader = () => {
  return (
    <div className="sticky bg-bgmain w-[1250px] h-[145px] p-[35px] text-textpri border-t-1 border-gray-700">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-[20px]">
          <p className="font-bold text-[35px]">Bảo trì vật tư</p>

          <HeaderMenu />
        </div>
        <button className="h-[30px] w-[100px] p-[5px] font-bold text-[14px] text-center  bg-highlightcl rounded-[12px] cursor-pointer hover:bg-[#2997FF] transition-all duration-300">
          Xuất file
        </button>
      </div>
    </div>
  );
};

export default MaterialHeader;
