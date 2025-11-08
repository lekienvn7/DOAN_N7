import React from "react";
import UserList from "./UserList";

const UserListHeader = () => {
  return (
    <div className="w-[1100px] p-[25px] text-textpri h-[590px] bg-bgmain rounded-[12px] border-1 border-gray-600">
      <div className="flex flex-col gap-[25px]">
        <p className="text-[25px] font-bold">Danh sách tài khoản</p>
        <hr className="text-[#fdd700]" />
      </div>
      <div>
        <UserList />
      </div>
    </div>
  );
};

export default UserListHeader;
