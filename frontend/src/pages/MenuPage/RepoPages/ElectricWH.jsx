import React from "react";
import { useState } from "react";
import RepoDetail from "@/components/RepoPage/ElectricWH/RepoDetail";
import ElectricUtilities from "@/components/RepoPage/ElectricWH/ElectricUtilities";
import HeaderDetail from "@/components/RepoPage/ElectricWH/HeaderDetail";

const ElectricWH = () => {
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(0);

  const reloadList = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row">
      <ElectricUtilities />
      <div className="flex flex-col">
        <HeaderDetail mode={mode} setMode={setMode} onReload={reloadList} />
        <RepoDetail mode={mode} reload={reload} />
      </div>
    </div>
  );
};

export default ElectricWH;
