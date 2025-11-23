import React from "react";
import { useState } from "react";
import MechanicalUtilities from "@/components/RepoPage/MechanicalWH/MechanicalUtilities";
import HeaderDetail from "@/components/RepoPage/MechanicalWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/MechanicalWH/RepoDetail";

const MechanicalWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <MechanicalUtilities />
      <div className="flex flex-col">
        <HeaderDetail
          mode={mode}
          setMode={setMode}
          onReload={reloadList}
          searchData={searchData}
          setSearchData={setSearchData}
          sortMode={sortMode}
          setSortMode={setSortMode}
        />
        <RepoDetail
          mode={mode}
          reload={reload}
          searchData={searchData}
          sortMode={sortMode}
        />
      </div>
    </div>
  );
};

export default MechanicalWH;
