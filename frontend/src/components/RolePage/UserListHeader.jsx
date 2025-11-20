import React from "react";
import UserList from "./UserList";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

const UserListHeader = () => {
  const [reload, setReload] = useState(0);

  const reList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="w-[1100px] p-[25px] text-textpri h-[590px] bg-bgmain rounded-[12px] border-1 border-gray-600">
      <div className="flex flex-col gap-[25px]">
        <div className="flex flex-row justify-between">
          <p className="text-[25px] font-bold">Danh sách tài khoản</p>
          <button
            onClick={reList}
            className="bg-highlightcl text-textpri text-[14px] font-bold rounded-[12px] flex flex-row gap-[5px] items-center hover:bg-[#0a60ff] px-[10px] cursor-pointer"
          >
            <RotateCcw size={14} strokeWidth={3} /> <span>Làm mới</span>
          </button>
        </div>
        <hr className="text-[#fdd700]" />
      </div>
      <div className="max-h-[490px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60 ">
        <UserList reload={reload} />
      </div>
    </div>
  );
};

export default UserListHeader;
