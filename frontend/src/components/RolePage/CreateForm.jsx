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
        userID,
        username,
        fullName,
        role,
        repoType,
        email: email || null,
        yourRepo,
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
    <div
      className="flex flex-col p-[25px] gap-[30px] items-center justify-center"
      style={{ color: "var(--text-primary)" }}
    >
      <div className="flex flex-col gap-[15px] items-center">
        <p
          className="font-bold text-[25px]"
          style={{ color: "var(--text-primary)" }}
        >
          Tạo tài khoản
        </p>
        <p
          className="text-[16px] w-[410px] text-center"
          style={{ color: "var(--text-secondary)" }}
        >
          Tạo tài khoản cho các quản lý!
        </p>
      </div>

      <div className="flex flex-col p-[20px] gap-[20px] justify-center">
        {/* USER ID */}
        <input
          type="text"
          placeholder="Mã tài khoản"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="w-[250px] px-4 py-3 rounded-[12px] placeholder:text-textsec transition-all focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--border-light)",
          }}
        />

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-[250px] px-4 py-3 rounded-[12px] placeholder:text-textsec transition-all focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--border-light)",
          }}
        />

        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Họ tên quản lý"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-[250px] px-4 py-3 rounded-[12px] placeholder:text-textsec transition-all focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--border-light)",
          }}
        />

        {/* ROLE */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-[10px] rounded-[12px] transition-all cursor-pointer focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--border-light)",
          }}
        >
          <option value="">-- Chọn vai trò --</option>
          <option value="ADMINISTRATOR">Quản lý tổng</option>
          <option value="WH MANAGER">Quản lý kho</option>
          <option value="LECTURER">Nhân viên</option>
        </select>

        {/* REPO */}
        <select
          value={yourRepo}
          onClick={() => {
            if (role === "ADMINISTRATOR") {
              setYourRepo("all");
            } else if (!(role === "WH MANAGER")) {
              toast.error("Không thể chọn phân kho với quyền hiện tại!");
            }
          }}
          onChange={(e) =>
            role === "WH MANAGER"
              ? setYourRepo(e.target.value)
              : e.preventDefault()
          }
          className="p-[10px] rounded-[12px] transition-all cursor-pointer focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--border-light)",
          }}
        >
          <option value="">-- Chọn kho quản lý --</option>
          <option value="chemical">Kho hóa chất</option>
          <option value="electric">Kho điện</option>
          <option value="mechanical">Kho cơ khí</option>
          <option value="iot">Kho nhúng và IoT</option>
          <option value="technology">Kho CNTT</option>
          <option value="automotive">Kho ô tô</option>
          <option value="telecom">Kho viễn thông</option>
          <option value="fashion">Kho thời trang</option>
        </select>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-2 font-semibold rounded-[18px] p-[10px] transition-all"
          style={{
            background: "var(--accent-blue)",
            color: "#fff",
          }}
        >
          Tạo tài khoản
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
