import React from "react";
import { useState, useEffect } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";

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
    technology: "Kho công nghệ thông tin",
    automotive: "Kho công nghệ oto",
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
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDeleteUser = async (userID) => {
    // Hỏi xác nhận người dùng
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa tài khoản ${users.userID} không?`
    );
    if (!confirm) return;

    try {
      const res = await axiosClient.delete(`/user/${userID}`);
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
      <table className="w-full text-textpri border-collapse">
        <thead className="sticky top-0 z-10 border-b border-[#fdd700] bg-bgmain">
          <tr className="text-center text-[14px] font-semibold">
            <th className="relative py-[5px] w-[3%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              UserID
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Tên đầy đủ
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Username
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Email
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Đổi mật khẩu?
            </th>
            <th className="relative w-[8%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Quyền hạn
            </th>
            <th className="relative w-[10%] after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[60%] after:w-[1px] after:bg-[#caa93e]">
              Phân kho (nếu có)
            </th>

            <th colSpan={2} className=" w-[5%] ">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((item, index) => {
            let roleColor = "";

            if (item.role.roleID === "ADMINISTRATOR") {
              roleColor = "text-yellow-400";
            } else if (item.role.roleID === "WH MANAGER") {
              roleColor = "text-pink-400";
            } else if (item.role.roleID === "MT MANAGER") {
              roleColor = "text-orange-400";
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
                <td className="p-[5px] border-r border-l border-gray-700">
                  <button className="changeTool cursor-pointer p-[5px] justify-center text-[#f9d65c] hover:text-[#ffd700]">
                    <PencilLine size={15} />
                  </button>
                </td>
                <td className="text-center p-[5px]">
                  <button
                    onClick={() => handleDeleteUser(item.userID)}
                    className="cursor-pointer p-[5px] justify-center text-[#ff5555] hover:text-[#ff7676]"
                  >
                    <Trash2 size={15} />
                  </button>
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
