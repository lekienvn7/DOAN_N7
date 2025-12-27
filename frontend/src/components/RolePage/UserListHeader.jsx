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
    <div
      className="w-[75vw] p-[25px] h-[80vh] rounded-[20px]"
      style={{
        background: "var(--bg-panel)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex flex-col gap-[25px]">
        <div className="flex flex-row justify-between items-center">
          <p
            className="text-[25px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Danh sách tài khoản
          </p>

          <button
            onClick={reList}
            className="text-[14px] font-semibold rounded-[12px] flex flex-row gap-[6px] items-center px-[12px] py-[8px] transition-all"
            style={{
              background: "var(--accent-blue)",
              color: "#fff",
            }}
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            <span>Làm mới</span>
          </button>
        </div>

        <hr
          style={{
            borderColor: "var(--border-light)",
          }}
        />
      </div>

      <div
        className="mt-2 max-h-[490px] overflow-y-auto scrollbar-thin"
        style={{
          scrollbarColor: "var(--border-strong) transparent",
        }}
      >
        <UserList reload={reload} />
      </div>
    </div>
  );
};

export default UserListHeader;
