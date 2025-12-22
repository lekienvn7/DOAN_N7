import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

const HeaderDetail = ({ mode, setMode, sortMode, setSortMode }) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      axiosClient.get("/repository/electric").then((res) => {
        if (res.data?.success) {
          setData(res.data.data);
          setLoading(false);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[460px] gap-4">
        <div className="w-10 h-10 border-[3px] border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-[15px]">
          Đang tải dữ liệu…
        </p>
      </div>
    );
  }

  return (
    <header
      className="pt-[56px] pb-[44px]"
      style={{ paddingInline: "var(--page-x)" }}
    >
      {/* ===== TITLE ===== */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[74px] font-googleSans font-bold tracking-tight gradient-text">
            Kho Điện
          </h1>

          <p className="mt-3 text-[22px] font-semibold text-[var(--text-primary)]">
            Danh sách vật tư phục vụ giảng dạy và thực hành
          </p>
        </div>
      </div>

      {/* ===== META / ACTIONS ===== */}
      <div className="mt-10 flex justify-end items-center">
        <div className="flex items-center gap-6 text-[15px] text-[var(--text-tertiary)]">
          {data.location && (
            <span className="whitespace-nowrap">{data.location}</span>
          )}

          {data.manager?.fullName && (
            <button
              onClick={() => setMode((p) => (p === "view" ? "edit" : "view"))}
              className="
                font-medium
                text-[var(--text-secondary)]
                hover:text-[var(--accent-blue)]
                transition-colors
              "
            >
              {data.manager.fullName}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderDetail;
