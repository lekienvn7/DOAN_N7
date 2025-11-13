import React from "react";
import { useState, useEffect } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";

const UserList = () => {
  const [users, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const RepoList = {
    all: "Tất cả các kho",
    chemical: "Kho hóa chất",
    electric: "Kho điện",
    mechanical: "Kho cơ khí",
    fashion: "Kho thời trang",
    iot: "Kho nhúng và iot",
    technology: "Kho CNTT",
    automotive: "Kho CN oto",
  };

  const TrueFalse = {
    true: "Chưa đổi",
    false: "Đã đổi",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/user");

        if (res.data.success) {
          const sorted = [...res.data.data].sort((a, b) =>
            a.userID.localeCompare(b.userID)
          );
          setUser(sorted);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleResetPassword = async (userID) => {
    try {
      const res = await axiosClient.put(`user/reset/${userID}`);
      if (res.data.success) {
        toast.success("Reset mật khẩu thành công!");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(res.data.message || "Không thể reset tài khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi reset mật khẩu!", error);
      toast.error("Reset thất bại! Vui lòng thử lại sau.");
    }
  };

  const handleDeleteUser = async (userID) => {
    try {
      const res = await axiosClient.delete(`/user/${userID}`);

      if (res.data.userID === "ADMIN") {
        toast.error("Không thể xóa tài khoản ADMIN");
        return;
      }

      if (res.data.success) {
        toast.success("Xóa tài khoản thành công!");

        setUser((prev) => prev.filter((u) => u.userID !== userID));
      } else {
        toast.error(res.data.message || "Không thể xóa tài khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      toast.error("Xóa thất bại! Vui lòng thử lại sau.");
    }
  };

  const ConfirmReset = ({ username, onConfirm }) => {
    const [input, setInput] = useState("");

    const isMatch = input.trim() === username;

    return (
      <div className="mt-4 flex flex-col gap-3">
        <label className="text-sm text-gray-300">
          Gõ lại tên tài khoản{" "}
          <span className="font-semibold text-yellow-400">{username}</span> để
          xác nhận:
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập lại tên tài khoản..."
          className="px-3 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-highlightcl transition"
        />

        <DialogFooter className="mt-3 flex justify-end gap-3">
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
              Hủy
            </button>
          </DialogClose>

          <DialogClose asChild>
            <button
              onClick={onConfirm}
              disabled={!isMatch}
              className={`px-4 py-2 rounded transition ${
                isMatch
                  ? "bg-[#ff5555] hover:bg-[#ff7676] text-white cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isMatch ? "Reset" : "Nhập đúng để reset"}
            </button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  };

  const ConfirmDelete = ({ username, onConfirm }) => {
    const [input, setInput] = useState("");

    const isMatch = input.trim() === username;

    return (
      <div className="mt-4 flex flex-col gap-3">
        <label className="text-sm text-gray-300">
          Gõ lại tên tài khoản{" "}
          <span className="font-semibold text-yellow-400">{username}</span> để
          xác nhận:
        </label>
        <form
          onSubmit={(e) => {
            onConfirm();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập lại tên tài khoản..."
            className="px-3 py-2 w-[465px] rounded-md bg-[#2a2a2a] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-highlightcl transition"
          />
        </form>

        <DialogFooter className="mt-3 flex justify-end gap-3">
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
              Hủy
            </button>
          </DialogClose>

          <DialogClose asChild>
            <button
              onClick={onConfirm}
              disabled={!isMatch}
              className={`px-4 py-2 rounded transition ${
                isMatch
                  ? "bg-[#ff5555] hover:bg-[#ff7676] text-white cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isMatch ? "Xóa" : "Nhập đúng để xóa"}
            </button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-4 text-textpri">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className=" border-collapse w-full text-textpri  ">
        <thead className="sticky top-0 z-20 border-b border-[#fdd700] bg-bgmain">
          <tr className="text-left  text-[14px] font-semibold">
            <th className="relative p-[5px] w-[3%] ">UserID</th>
            <th className="relative p-[5px] w-[10%]">Tên đầy đủ</th>
            <th className="relative p-[5px] w-[8%]">Username</th>
            <th className="relative p-[5px] w-[10%] ">Email</th>
            <th className="relative p-[5px] w-[8%] ">Đổi mật khẩu?</th>
            <th className="relative p-[5px] w-[8%]">Quyền hạn</th>
            <th className="relative p-[5px] w-[10%] ">Phân kho (nếu có)</th>

            <th colSpan={2} className=" p-[5px] w-[5%] ">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody className="">
          {users.map((item) => {
            let roleColor = "";

            if (item.role.roleID === "ADMINISTRATOR") {
              roleColor = "text-yellow-400";
            } else if (item.role.roleID === "WH MANAGER") {
              roleColor = "text-textpri";
            } else if (item.role.roleID === "MT MANAGER") {
              roleColor = "text-textpri";
            }

            return (
              <tr className="border-b-1 border-gray-700 text-left text-[14px] text-[#e5e5e7] hover:bg-[#1c1c1e]">
                <td className="p-[5px]">{item.userID}</td>
                <td className="p-[5px]">{item.fullName}</td>
                <td className="p-[5px]">{item.username}</td>
                <td
                  className={`p-[5px] ${
                    !item.email ? "text-red-400" : "text-textpri"
                  } `}
                >
                  {item.email?.length > 0 ? item.email : "Chưa có email"}
                </td>
                <td
                  className={`p-[5px] ${
                    item.mustChangePassword ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {TrueFalse[item.mustChangePassword.toString()]}
                </td>
                <td className={`p-[5px] ${roleColor}`}>{item.role.roleName}</td>
                <td
                  className={`p-[5px] ${
                    item.yourRepo?.length === 0
                      ? "text-red-400"
                      : "text-textpri"
                  }`}
                >
                  {item.yourRepo?.length > 0
                    ? item.yourRepo
                        .map((repo) => RepoList[repo] || repo)
                        .join(", ")
                    : "Không có"}
                </td>
                <td className="p-[5px] border-r border-l text-center border-gray-700">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                        <PencilLine size={15} />
                      </button>
                    </DialogTrigger>

                    <DialogContent className="bg-[#1a1a1a] rounded-[12px] border-none text-white">
                      <DialogHeader>
                        <DialogTitle>Xác nhận reset mật khẩu</DialogTitle>

                        <DialogDescription className="text-gray-400">
                          Bạn có chắc chắn muốn reset mật khẩu tài khoản{" "}
                          <span className="text-yellow-400 font-semibold">
                            {item.username}
                          </span>{" "}
                          không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                      </DialogHeader>

                      <ConfirmReset
                        username={item.username}
                        onConfirm={() => handleResetPassword(item.userID)}
                      />
                    </DialogContent>
                  </Dialog>
                </td>

                <td className="text-center p-[5px]">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="cursor-pointer p-[5px] text-[#ff5555] hover:text-[#ff7676]">
                        <Trash2 size={15} />
                      </button>
                    </DialogTrigger>

                    <DialogContent className="bg-[#1a1a1a] rounded-[12px] border-none text-white">
                      <DialogHeader>
                        <DialogTitle>Xác nhận xoá tài khoản</DialogTitle>

                        <DialogDescription className="text-gray-400">
                          Bạn có chắc chắn muốn xoá tài khoản{" "}
                          <span className="text-yellow-400 font-semibold">
                            {item.username}
                          </span>{" "}
                          không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                      </DialogHeader>

                      <ConfirmDelete
                        username={item.username}
                        onConfirm={() => handleDeleteUser(item.userID)}
                      />
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
