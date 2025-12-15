import React from "react";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import RepoDetail from "@/components/RepoPage/ChemicalWH/RepoDetail";
import HeaderDetail from "@/components/RepoPage/ChemicalWH/HeaderDetail";
import BorrowForm from "@/components/RepoPage/ChemicalWH/LecturePage/BorrowForm";

const ChemicalWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);
  const [borrowList, setBorrowList] = useState([]);
  const [borrowQty, setBorrowQty] = useState("");
  const [repoId] = useState("69230a5e163002521d0aa697");

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
      {isLecturer ? (
        <BorrowForm
          borrowList={borrowList}
          onUpdateQuantity={handleUpdateQuantity}
          borrowQty={borrowQty}
          setBorrowQty={setBorrowQty}
          repositoryId={repoId}
          onBorrowSuccess={() => setCount((prev) => prev + 1)}
        />
      ) : (
        <></>
      )}
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

export default ChemicalWH;
