import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { HousePlus } from "lucide-react";
import { ClipboardMinus } from "lucide-react";
import { ClipboardPlus } from "lucide-react";
import { Trash2 } from "lucide-react";
import FindModal from "./UtilityModal/FindModal";

const UtilityPanel = () => {
  const listMenu = [
    { icon: Search, label: "Tìm kiếm", onClick: () => setOpenSearch(true) },
    { icon: ClipboardPlus, label: "Nhập vật tư" },
    { icon: ClipboardMinus, label: "Xuất vật tư" },
    { icon: HousePlus, label: "Thêm kho " },
    { icon: Trash2, label: "Xóa kho" },
  ];

  const [openSearch, setOpenSearch] = useState(false);
  return (
    <div>
      <p className=" font-qurova font-bold text-[20px] ml-[60px]">TIỆN ÍCH</p>
      <div className="flex flex-col items-center gap-[20px] mt-[20px]">
        {listMenu.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className="group flex items-center gap-0 p-[10px] rounded-[12px] overflow-hidden whitespace-nowrap
        rounded-md  text-[#ffffff] font-bold px-3 py-2 
       transition-all duration-500 ease-out hover:gap-2 cursor-pointer "
            >
              <Icon size={22} className="text-white" />
              <span
                className="max-w-0 opacity-0 overflow-hidden  
      transition-all duration-300 group-hover:max-w-[100px] group-hover:opacity-100"
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <FindModal open={openSearch} onClose={() => setOpenSearch(false)} />
    </div>
  );
};

export default UtilityPanel;
