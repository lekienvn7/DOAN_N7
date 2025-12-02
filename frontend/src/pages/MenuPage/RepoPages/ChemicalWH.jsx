import React from "react";
import { useState } from "react";
import RepoDetail from "@/components/RepoPage/ChemicalWH/RepoDetail";
import ChemicalUtilities from "@/components/RepoPage/ChemicalWH/ChemicalUtilities";
import HeaderDetail from "@/components/RepoPage/ChemicalWH/HeaderDetail";

const ChemicalWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <ChemicalUtilities />
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
          onReload={reloadList}
        />
      </div>
    </div>
  );
};

export default ChemicalWH;
