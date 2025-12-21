const HeaderDetail = ({ mode, setMode, sortMode, setSortMode }) => {
  return (
    <header
      className="pt-[48px] pb-[40px]"
      style={{ paddingInline: "var(--page-x)" }}
    >
      {/* HERO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[64px] font-googleSans font-semibold tracking-tight">
            Kho Điện
          </h1>
          <p className="mt-3 text-[22px] text-[#a1a1a6]">
            Danh sách vật tư phục vụ giảng dạy và thực hành
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex justify-end items-center">
        <div className="flex items-center gap-6 text-sm text-[#a1a1a6]">
          <button onClick={() => setSortMode((p) => !p)}>Sắp xếp</button>

          <button
            onClick={() => setMode((p) => (p === "view" ? "edit" : "view"))}
          >
            {mode === "view" ? "Chỉnh sửa" : "Chi tiết"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDetail;
