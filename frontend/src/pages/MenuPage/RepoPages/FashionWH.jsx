import React from "react";
import { useState } from "react";
import FashionUtilities from "@/components/RepoPage/FashionWH/FashionUtilities";
import HeaderDetail from "@/components/RepoPage/FashionWH/HeaderDetail";
import RepoDetail from "@/components/RepoPage/FashionWH/RepoDetail";

const FashionWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sortMode, setSortMode] = useState(false);

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <FashionUtilities />
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

export default FashionWH;
