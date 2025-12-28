import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { ArrowUpRight, ToolCase } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import gradient from "../../../assets/images/gradient.png";

/* ===== HELPER ===== */
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

const HeaderDetail = ({ mode, setMode, sortMode, setSortMode }) => {
  const [repository, setRepository] = useState(null);

  useEffect(() => {
    axiosClient.get("/repository/fashion").then((res) => {
      if (res.data?.success) {
        setRepository(res.data.data);
      }
    });
  }, []);

  return (
    <header
      className="relative pt-[56px] pb-[44px] overflow-hidden"
      style={{ paddingInline: "var(--page-x)" }}
    >
      {/* ===== CONTENT ===== */}
      <div className="relative z-10">
        {/* ===== TITLE ===== */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[70px] mt-[25px] font-googleSans font-bold tracking-[-0.02em]">
              <span className="text-blue-600">K</span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-400 to-orange-500 bg-clip-text text-transparent">
                ho Thời Trang
              </span>
            </h1>

            <div className="flex flex-row justify-between items-center mt-3 w-[1270px]">
              <p className="text-[22px] font-semibold text-[var(--text-primary)]">
                Danh sách vật tư thời trang phục vụ giảng dạy và thực hành
              </p>

              {/* ===== DIALOG TRIGGER ===== */}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="
                      flex items-center gap-[6px]
                      text-[20px]
                      text-[var(--accent-blue)]
                      hover:opacity-80
                      transition
                    "
                  >
                    Chi tiết kho
                    <ArrowUpRight size={15} />
                  </button>
                </DialogTrigger>

                {/* ===== DIALOG CONTENT ===== */}
                <DialogContent className="bg-white text-[var(--text-primary)] rounded-[20px] border border-[var(--border-light)] shadow-[var(--shadow-md)] max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[20px]">
                      <ToolCase size={18} />
                      Thông tin chi tiết{" "}
                      <span className="text-[#fb923c]">kho thời trang</span>
                    </DialogTitle>
                  </DialogHeader>

                  <ul className="mt-[20px] flex flex-col gap-[8px] text-[17px]">
                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Vị trí:
                      </span>{" "}
                      {repository?.location || "—"}
                    </li>

                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Quản lý phụ trách:
                      </span>{" "}
                      {repository?.manager?.fullName || "Chưa có quản lý"}
                      {" — "}
                      {repository?.manager?.email || "—"}
                    </li>

                    <li>
                      <span className="text-[#60A5FA] font-semibold">
                        Tạo vào:
                      </span>{" "}
                      {formatDate(repository?.createdAt)}
                    </li>
                  </ul>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* ===== META / ACTIONS ===== */}
        <div className="mt-10 flex justify-end items-center">
          <div className="flex items-center gap-6 text-[15px] text-[var(--text-tertiary)]">
            {repository?.location && (
              <span className="whitespace-nowrap">{repository.location}</span>
            )}

            {repository?.manager?.fullName && (
              <button
                onClick={() => setMode((p) => (p === "view" ? "edit" : "view"))}
                className="
                  font-medium
                  text-[var(--text-secondary)]
                  hover:text-[var(--accent-blue)]
                  transition-colors
                "
              >
                {repository.manager.fullName}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDetail;
