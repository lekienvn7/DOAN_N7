import React from "react";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import RepoDetail from "@/components/RepoPage/ElectricWH/RepoDetail";
import HeaderDetail from "@/components/RepoPage/ElectricWH/HeaderDetail";
import BorrowForm from "@/components/RepoPage/ElectricWH/LecturerPage/BorrowForm";

const ElectricWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);
  const [borrowList, setBorrowList] = useState([]);
  const [borrowQty, setBorrowQty] = useState("");
  const [repoId] = useState("691553eafd7805ceea7a95b6");

  const handleBorrowSelect = (item, quantity) => {
    setBorrowList((prev) => {
      if (quantity === 0) return prev.filter((i) => i._id !== item._id);

      const exists = prev.find((i) => i._id === item._id);
      if (exists) return prev; // BorrowForm sẽ lo quantity

      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (id, qty) => {
    setBorrowList((prev) =>
      prev.map((item) => (item._id === id ? { ...item, borrowQty: qty } : item))
    );
  };

  const { user } = useAuth();

  const isLecturer = user?.roleID === "LECTURER";

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  const reloadTicket = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <HeaderDetail
          mode={mode}
          setMode={setMode}
          onReload={reloadList}
          onReloadTicket={reloadTicket}
          searchData={searchData}
          reload={reload}
          setSearchData={setSearchData}
          sortMode={sortMode}
          setSortMode={setSortMode}
          isLecturer={isLecturer}
          borrowList={borrowList}
          onUpdateQuantity={handleUpdateQuantity}
          repositoryId={repoId}
        />
        <RepoDetail
          mode={mode}
          reload={reload}
          searchData={searchData}
          sortMode={sortMode}
          isLecturer={isLecturer}
          onSelectChange={handleBorrowSelect}
        />
      </div>
    </div>
  );
};

export default ElectricWH;
