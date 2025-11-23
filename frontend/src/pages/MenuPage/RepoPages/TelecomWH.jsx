import React from "react";
import { useState } from "react";
import TelecomUtilities from "@/components/RepoPage/TelecomWH/TelecomUtilities";
import HeaderDetail from "@/components/RepoPage/TelecomWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/TelecomWH/RepoDetail";

const TelecomWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <TelecomUtilities />
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

export default TelecomWH;
