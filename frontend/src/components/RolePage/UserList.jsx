import React, { useState, useEffect } from "react";
import { PencilLine, Trash2, Lock } from "lucide-react";
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

const UserList = ({ reload }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const RepoList = [
    { type: "all", name: "Tất cả các kho" },
    { type: "chemical", name: "Kho hóa chất" },
    { type: "electric", name: "Kho điện" },
    { type: "mechanical", name: "Kho cơ khí" },
    { type: "fashion", name: "Kho thời trang" },
    { type: "iot", name: "Kho nhúng & IoT" },
    { type: "technical", name: "Kho CNTT" },
    { type: "automotive", name: "Kho CN ô tô" },
  ];

  const TrueFalse = {
    true: "Chưa đổi",
    false: "Đã đổi",
  };

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await axiosClient.get("/user");
        if (res.data.success) {
          const sorted = [...res.data.data].sort((a, b) =>
            a.userID.localeCompare(b.userID)
          );
          setUsers(sorted);
        }
      } catch {
        toast.error("Lỗi khi tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [reload]);

  /* ================= UNLOCK USER ================= */
  const handleUnlockUser = async (userID, username) => {
    try {
      await axiosClient.put(`/user/${userID}`, {
        isLocked: false,
        damageCount: 0,
      });

      toast.success(`Đã mở khóa tài khoản ${username}`);

      // Update UI ngay, không cần reload
      setUsers((prev) =>
        prev.map((u) =>
          u.userID === userID ? { ...u, isLocked: false, damageCount: 0 } : u
        )
      );
    } catch {
      toast.error("Mở khóa tài khoản thất bại");
    }
  };

  const handleResetPassword = async (userID) => {
    try {
      const res = await axiosClient.put(`user/reset/${userID}`);
      if (res.data.success) {
        toast.success("Reset mật khẩu thành công!");
        setTimeout(() => window.location.reload(), 800);
      } else toast.error(res.data.message);
    } catch {
      toast.error("Reset thất bại!");
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
        setUsers((prev) => prev.filter((u) => u.userID !== userID));
      }
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  /* ================= CONFIRM RESET ================= */
  const ConfirmReset = ({ username, onConfirm }) => {
    const [input, setInput] = useState("");
    const isMatch = input.trim() === username;

    return (
      <div className="mt-4 flex flex-col gap-3">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Gõ lại tên tài khoản{" "}
          <b style={{ color: "var(--accent-blue)" }}>{username}</b> để xác nhận:
        </label>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 rounded-md focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
          }}
        />

        <DialogFooter className="mt-3 flex justify-end gap-3">
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              Hủy
            </button>
          </DialogClose>

          <DialogClose asChild>
            <button
              onClick={onConfirm}
              disabled={!isMatch}
              className="px-4 py-2 rounded"
              style={{
                background: isMatch ? "var(--danger)" : "var(--bg-hover)",
                color: isMatch ? "#fff" : "var(--text-tertiary)",
                cursor: isMatch ? "pointer" : "not-allowed",
              }}
            >
              Reset
            </button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  };

  /* ================= CONFIRM DELETE ================= */
  const ConfirmDelete = ({ username, onConfirm }) => {
    const [input, setInput] = useState("");
    const isMatch = input.trim() === username;

    return (
      <div className="mt-4 flex flex-col gap-3">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Gõ lại tên tài khoản{" "}
          <b style={{ color: "var(--danger)" }}>{username}</b> để xác nhận:
        </label>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 rounded-md focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
          }}
        />

        <DialogFooter className="mt-3 flex justify-end gap-3">
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              Hủy
            </button>
          </DialogClose>

          <DialogClose asChild>
            <button
              onClick={onConfirm}
              disabled={!isMatch}
              className="px-4 py-2 rounded"
              style={{
                background: isMatch ? "var(--danger)" : "var(--bg-hover)",
                color: isMatch ? "#fff" : "var(--text-tertiary)",
                cursor: isMatch ? "pointer" : "not-allowed",
              }}
            >
              Xóa
            </button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  };

  /* ================= CONFIRM UNLOCK ================= */
  const ConfirmUnlock = ({ username, userID }) => {
    const [input, setInput] = useState("");
    const isMatch = input.trim() === username;

    return (
      <div className="mt-4 flex flex-col gap-3">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Nhập lại username{" "}
          <b style={{ color: "var(--accent-blue)" }}>{username}</b> để mở khóa:
        </label>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 rounded-md focus:outline-none"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
          }}
        />

        <DialogFooter className="mt-3 flex justify-end gap-3">
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              Hủy
            </button>
          </DialogClose>

          <DialogClose asChild>
            <button
              disabled={!isMatch}
              onClick={() => handleUnlockUser(userID, username)}
              className="px-4 py-2 rounded"
              style={{
                background: isMatch ? "var(--success)" : "var(--bg-hover)",
                color: isMatch ? "#fff" : "var(--text-tertiary)",
                cursor: isMatch ? "pointer" : "not-allowed",
              }}
            >
              Mở khóa
            </button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] gap-3">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--accent-blue)",
            borderTopColor: "transparent",
          }}
        />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="border-collapse w-full text-[14px]">
        <thead
          className="sticky top-0 z-20"
          style={{
            background: "var(--bg-subtle)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <tr className="font-semibold text-left">
            <th className="p-[6px]">UserID</th>
            <th className="p-[6px]">Tên đầy đủ</th>
            <th className="p-[6px]">Username</th>
            <th className="p-[6px]">Email</th>
            <th className="p-[6px]">Đổi MK?</th>
            <th className="p-[6px]">Quyền hạn</th>
            <th className="p-[6px]">Phân kho</th>
            <th colSpan={2} className="p-[6px] text-center">
              Lựa chọn
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((item) => (
            <tr
              key={item.userID}
              style={{
                background: item.isLocked
                  ? "rgba(239,68,68,0.12)"
                  : "var(--bg-panel)",
                borderBottom: "1px solid var(--border-light)",
                opacity: item.isLocked ? 0.75 : 1,
              }}
            >
              {/* USER ID + LOCK ICON */}
              <td className="p-[6px] flex items-center gap-2">
                {item.userID}

                {item.isLocked && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        title="Mở khóa tài khoản"
                        style={{ color: "var(--danger)" }}
                      >
                        <Lock size={14} />
                      </button>
                    </DialogTrigger>

                    <DialogContent
                      style={{
                        background: "var(--bg-panel)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Mở khóa tài khoản</DialogTitle>
                        <DialogDescription>
                          Tài khoản <b>{item.username}</b> đang bị khóa do vi
                          phạm / hỏng hóc
                        </DialogDescription>
                      </DialogHeader>

                      <ConfirmUnlock
                        username={item.username}
                        userID={item.userID}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </td>

              <td className="p-[6px]">{item.fullName}</td>
              <td className="p-[6px]">{item.username}</td>
              <td className="p-[6px]">{item.email || "—"}</td>

              <td
                className="p-[6px]"
                style={{
                  color: item.mustChangePassword
                    ? "var(--danger)"
                    : "var(--success)",
                }}
              >
                {TrueFalse[item.mustChangePassword.toString()]}
              </td>

              <td className="p-[6px]">{item.role.roleName}</td>

              <td className="p-[6px]">
                {RepoList.find((r) => r.type === item.yourRepo)?.name ||
                  "Không có"}
              </td>

              {/* RESET */}
              <td className="text-center p-[6px]">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      disabled={item.isLocked}
                      style={{
                        color: item.isLocked
                          ? "var(--text-tertiary)"
                          : "var(--accent-blue)",
                        cursor: item.isLocked ? "not-allowed" : "pointer",
                      }}
                    >
                      <PencilLine size={15} />
                    </button>
                  </DialogTrigger>

                  <DialogContent
                    className="rounded-[16px]"
                    style={{
                      background: "var(--bg-panel)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Reset mật khẩu</DialogTitle>
                      <DialogDescription>
                        Xác nhận reset mật khẩu cho <b>{item.username}</b>
                      </DialogDescription>
                    </DialogHeader>

                    <ConfirmReset
                      username={item.username}
                      onConfirm={() => handleResetPassword(item.userID)}
                    />
                  </DialogContent>
                </Dialog>
              </td>

              {/* DELETE */}
              <td className="text-center p-[6px]">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      disabled={item.isLocked}
                      style={{
                        color: item.isLocked
                          ? "var(--text-tertiary)"
                          : "var(--danger)",
                        cursor: item.isLocked ? "not-allowed" : "pointer",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </DialogTrigger>

                  <DialogContent
                    className="rounded-[16px]"
                    style={{
                      background: "var(--bg-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Xóa tài khoản</DialogTitle>
                      <DialogDescription>
                        Xác nhận xóa tài khoản <b>{item.username}</b>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
