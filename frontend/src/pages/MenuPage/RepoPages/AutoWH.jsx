import React from "react";
import { useState } from "react";
import AutomotiveUtilities from "@/components/RepoPage/AutomotiveWH/AutomotiveUtilities";
import HeaderDetail from "@/components/RepoPage/AutomotiveWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/AutomotiveWH/RepoDetail";

const AutoWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <AutomotiveUtilities />
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

export default AutoWH;
