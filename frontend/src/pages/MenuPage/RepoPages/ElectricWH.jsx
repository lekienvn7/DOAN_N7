import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";

import HeaderDetail from "@/components/RepoPage/ElectricWH/HeaderDetail";
import ElectricList from "@/components/RepoPage/ElectricWH/ElectricList/ElectricList";
import AddElectric from "@/components/RepoPage/ElectricWH/AddElectric";
import QuickSectionNav from "@/components/RepoPage/ElectricWH/QuickSectionNav";


const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ElectricWH = () => {
  const { user } = useAuth();

  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);
  const [borrowList, setBorrowList] = useState([]);
  const repoId = "691553eafd7805ceea7a95b6";

  const isLecturer = user?.roleID === "LECTURER";
  const canAddMaterial =
    user?.roleID === "ADMINISTRATOR" || user?.roleID === "WH_MANAGER";

  const reloadList = () => setReload((p) => p + 1);

  const handleBorrowSelect = (item, quantity) => {
    setBorrowList((prev) => {
      if (quantity === 0) return prev.filter((i) => i._id !== item._id);
      if (prev.find((i) => i._id === item._id)) return prev;
      return [...prev, { ...item, borrowQty: quantity }];
    });
  };

  /* ===== SECTION REFS ===== */
  const listRef = useRef(null);
  const addRef = useRef(null);

  const sections = [
    { id: "list", label: "Danh sách vật tư", ref: listRef },
    ...(canAddMaterial
      ? [{ id: "add", label: "Thêm vật tư", ref: addRef }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-bgmain text-white flex flex-col">
      {/* ===== HEADER ===== */}
      <HeaderDetail
        mode={mode}
        setMode={setMode}
        onReload={reloadList}
        searchData={searchData}
        setSearchData={setSearchData}
        sortMode={sortMode}
        setSortMode={setSortMode}
        isLecturer={isLecturer}
        borrowList={borrowList}
        repositoryId={repoId}
        reload={reload}
      />

      {/* ===== QUICK NAV ===== */}
      <QuickSectionNav sections={sections} />

      <main className="mt-[56px] flex flex-col gap-[96px]">
        {/* ===== DANH SÁCH VẬT TƯ ===== */}
        <motion.section
          ref={listRef}
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <ElectricList
            mode={mode}
            reload={reload}
            searchData={searchData}
            sortMode={sortMode}
            isLecturer={isLecturer}
            onSelectChange={handleBorrowSelect}
          />
        </motion.section>

        {/* ===== FORM THÊM VẬT TƯ ===== */}
        {canAddMaterial && (
          <motion.section
            ref={addRef}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="px-[120px]"
          >
            <div className="mb-[24px]">
              <h2 className="text-[34px] font-bold text-textpri">
                Thêm vật tư
              </h2>
              <p className="text-gray-400 mt-1">
                Nhập thông tin kỹ thuật và tự động thêm vào kho điện
              </p>
            </div>

            <AddElectric onReload={reloadList} />
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default ElectricWH;
