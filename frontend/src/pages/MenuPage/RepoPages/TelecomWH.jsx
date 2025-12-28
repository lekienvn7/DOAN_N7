import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";

import HeaderDetail from "@/components/RepoPage/TelecomWH/HeaderDetail";
import TelecomList from "@/components/RepoPage/TelecomWH/TelecomList/TelecomList";
import AddTelecom from "@/components/RepoPage/TelecomWH/AddTelecom";
import QuickSectionNav from "@/components/RepoPage/TelecomWH/QuickSectionNav";
import BorrowList from "@/components/RepoPage/TelecomWH/ManagerPage/BorrowList";
import BorrowForm from "@/components/RepoPage/TelecomWH/LecturerPage/BorrowForm";
import ReportPage from "../ReportPage";
import InfoPage from "@/pages/InfoPage";

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const TelecomWH = () => {
  const { user } = useAuth();

  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);

  const [borrowList, setBorrowList] = useState([]);

  // ⚠️ thay bằng repoId kho telecom trong DB
  const repoId = "690981765de9a612110089fe";

  const isLecturer = user?.roleID === "LECTURER";
  const canAddMaterial =
    user?.roleID === "ADMINISTRATOR" || user?.roleID === "WH MANAGER";
  const canSeeBorrowTickets = canAddMaterial;

  const reloadList = () => setReload((p) => p + 1);
  const reloadTicket = () => setReload((p) => p + 1);

  const handleBorrowSelect = (item, quantity) => {
    setBorrowList((prev) => {
      if (!quantity || quantity <= 0)
        return prev.filter((i) => i._id !== item._id);

      const existed = prev.find((i) => i._id === item._id);
      if (existed)
        return prev.map((i) =>
          i._id === item._id ? { ...i, borrowQty: quantity } : i
        );

      return [...prev, { ...item, borrowQty: quantity }];
    });
  };

  const handleUpdateQuantity = (id, qty) => {
    setBorrowList((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, borrowQty: qty } : i))
        .filter((i) => i.borrowQty > 0)
    );
  };

  const listRef = useRef(null);
  const addRef = useRef(null);
  const ticketRef = useRef(null);
  const borrowFormRef = useRef(null);
  const reportRef = useRef(null);

  const sections = useMemo(() => {
    return [
      { id: "list", label: "Danh sách vật tư", ref: listRef },

      ...(canAddMaterial
        ? [{ id: "add", label: "Thêm vật tư", ref: addRef }]
        : []),

      ...(canSeeBorrowTickets
        ? [{ id: "tickets", label: "Phiếu mượn", ref: ticketRef }]
        : []),

      ...(isLecturer
        ? [{ id: "borrow", label: "Mượn vật tư", ref: borrowFormRef }]
        : []),

      { id: "report", label: "Vật tư đang mượn", ref: reportRef },
    ];
  }, [canAddMaterial, canSeeBorrowTickets, isLecturer]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col">
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
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* ===== QUICK NAV ===== */}
      <QuickSectionNav sections={sections} />

      <main className="mt-[56px] flex flex-col gap-[20px]">
        {/* ===== DANH SÁCH VẬT TƯ ===== */}
        <motion.section
          ref={listRef}
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <TelecomList
            mode={mode}
            reload={reload}
            searchData={searchData}
            sortMode={sortMode}
            isLecturer={isLecturer}
            onSelectChange={handleBorrowSelect}
          />
        </motion.section>

        {/* ===== THÊM VẬT TƯ ===== */}
        {canAddMaterial && (
          <motion.section
            ref={addRef}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            className="mx-[80px] p-[28px]"
          >
            <AddTelecom onReload={reloadList} />
          </motion.section>
        )}

        {/* ===== PHIẾU MƯỢN ===== */}
        {canSeeBorrowTickets && (
          <motion.section
            ref={ticketRef}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            className="mx-[80px] p-[28px]"
          >
            <BorrowList
              repositoryId={repoId}
              reload={reload}
              onReloadTicket={reloadTicket}
            />
          </motion.section>
        )}

        {/* ===== FORM MƯỢN (LECTURER) ===== */}
        {isLecturer && (
          <motion.section
            ref={borrowFormRef}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            className="mx-[80px] p-[28px]"
          >
            <BorrowForm
              repositoryId={repoId}
              borrowList={borrowList}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </motion.section>
        )}

        {isLecturer && (
          <motion.section
            ref={reportRef}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            className="mx-[80px] p-[28px]"
          >
            <ReportPage canReturn={isLecturer} />
          </motion.section>
        )}
      </main>

      <InfoPage />
    </div>
  );
};

export default TelecomWH;
