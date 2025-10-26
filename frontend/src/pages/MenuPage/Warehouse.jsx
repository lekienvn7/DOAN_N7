import React from "react";
import { Outlet } from "react-router-dom"; // ⬅️ Thêm dòng này
import RepoMenu from "@/components/RepoPage/RepoMenu";

const Warehouse = () => {
  return (
    <div className="min-h-screen bg-[#1d1d1f] text-white">
      {/* Thanh menu cố định */}
      <div className="sticky top-0 w-screen p-[20px] flex flex-row items-center justify-center bg-[#2c2c2e] shadow-[0_15px_25px_rgba(0,0,0,0),_0_10px_15px_rgba(0,0,0,0.4)] z-50">
        <RepoMenu />
      </div>

      {/* Vùng hiển thị trang con */}
      <div className="p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Warehouse;
