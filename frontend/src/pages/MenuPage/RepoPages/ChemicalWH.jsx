import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";

import HeaderDetail from "@/components/RepoPage/ChemicalWH/HeaderDetail";
import ChemicalList from "@/components/RepoPage/ChemicalWH/ChemicalList/ChemicalList";
import AddChemical from "@/components/RepoPage/ChemicalWH/AddChemical";
import QuickSectionNav from "@/components/RepoPage/ChemicalWH/QuickSectionNav";

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ChemicalWH = () => {
  const { user } = useAuth();

  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);
  const [borrowList, setBorrowList] = useState([]);

  const repoId = "69230a5e163002521d0aa697";

  const isLecturer = user?.roleID === "LECTURER";
  const canAddMaterial =
    user?.roleID === "ADMINISTRATOR" || user?.roleID === "WH_MANAGER";

  const reloadList = () => setReload((p) => p + 1);

  /* ===== BORROW SELECT ===== */
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
    { id: "list", label: "Danh sách hóa chất", ref: listRef },
    ...(canAddMaterial
      ? [{ id: "add", label: "Thêm hóa chất", ref: addRef }]
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
        {/* ===== DANH SÁCH HÓA CHẤT ===== */}
        <motion.section
          ref={listRef}
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <ChemicalList
            mode={mode}
            reload={reload}
            searchData={searchData}
            sortMode={sortMode}
            isLecturer={isLecturer}
            onSelectChange={handleBorrowSelect}
          />
        </motion.section>

        {/* ===== FORM THÊM HÓA CHẤT ===== */}
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
                Thêm hóa chất
              </h2>
              <p className="text-gray-400 mt-1">
                Nhập thông tin an toàn và thông số kỹ thuật của hóa chất
              </p>
            </div>

            <AddChemical onReload={reloadList} />
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default ChemicalWH;
