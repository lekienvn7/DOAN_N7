import React from "react";
import { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";

const CreateForm = () => {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [repoType, setRepoType] = useState("");
  const [yourRepo, setYourRepo] = useState("");

  const handleSubmit = async () => {
    if (!userID || !username || !fullName || !role) {
      toast.error("Thiếu thông tin tài khoản!");
      return;
    }

    if (username.length < 8 || username.length > 14) {
      toast.error("Tên tài khoản tối thiểu 8 ký tự và không dài quá 14!");
      return;
    }
    try {
      const res = await axiosClient.post("/user", {
        userID: userID,
        username: username,
        fullName: fullName,
        role: role,
        repoType: repoType,
        email: email || null,
        yourRepo: yourRepo,
      });

      if (res.data.success) {
        toast.success("Tạo tài khoản thành công!");
        setUserID("");
        setUsername("");
        setFullName("");
        setEmail("");
        setRepoType("");
        setRole("");
        setYourRepo("");

        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error("Tạo tài khoản thất bại!");
      }
    } catch (error) {
      console.error("Lỗi tạo tài khoản", error);
    }
  };

  return (
    <div className="flex flex-col p-[25px] gap-[30px] items-center justify-center text-textpri">
      <div className="flex flex-col gap-[15px] items-center">
        <p className="font-bold text-[25px]">Tạo tài khoản</p>
        <p className="text-[16px] w-[410px] text-textsec text-center">
          Tạo tài khoản cho các quản lý!
        </p>
      </div>

      <div className="flex flex-col p-[20px] gap-[20px] justify-center text-textpri">
        <input
          type="text"
          placeholder="Mã tài khoản"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="w-[250px] px-4 py-3 bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         placeholder:text-gray-400 transition-all duration-200"
        />

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-[250px] px-4 py-3 bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         placeholder:text-gray-400 transition-all duration-200"
        />
        <input
          type="text"
          placeholder="Họ tên quản lý"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-[250px] px-4 py-3 bg-[#2c2c2e] text-pri border-[2px] border-[#5E5E60] rounded-[12px]
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         placeholder:text-gray-400 transition-all duration-200"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-[10px] rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer"
        >
          <option value="">-- Chọn vai trò --</option>
          <option value="ADMINISTRATOR">Quản lý tổng</option>
          <option value="WH MANAGER">Quản lý kho</option>
          <option value="MT MANAGER">Quản lý bảo trì</option>
          <option value="LECTURER">Giảng viên</option>
        </select>

        <select
          value={yourRepo}
          onClick={() => {
            if (!(role === "ADMINISTRATOR" || role === "WH MANAGER")) {
              toast.error("Không thể chọn phân kho với quyền hiện tại!");
            }
          }}
          onChange={(e) => {
            {
              !(role === "ADMINISTRATOR" || role === "WH MANAGER")
                ? e.preventDefault()
                : setYourRepo(e.target.value);
            }
          }}
          className={`p-[10px] rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer `}
        >
          <option value="">-- Chọn kho quản lý --</option>
          <option value="chemical">Kho hóa chất</option>
          <option value="electric">Kho điện</option>
          <option value="mechanical">Kho cơ khí</option>
          <option value="iot">Kho nhúng và iot</option>
          <option value="technology">Kho công nghệ thông tin</option>
          <option value="automotive">Kho công nghệ oto</option>
          <option value="telecom">Kho điện tử viễn thông</option>
          <option value="fashion">Kho thời trang</option>
        </select>

        <button
          onClick={handleSubmit}
          className="mt-2 bg-[#ffd700] text-black font-semibold rounded-[24px] p-[10px] cursor-pointer hover:bg-[#ffb700] transition"
        >
          Tạo tài khoản
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
