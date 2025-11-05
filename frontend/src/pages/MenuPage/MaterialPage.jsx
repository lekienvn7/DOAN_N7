import React from "react";
import MaterialHeader from "@/components/MaterialPage/MaterialHeader";
import RepoMenu from "@/components/MaterialPage/RepoMenu";

const MaterialPage = () => {
  return (
    <div className="flex flex-row">
      <RepoMenu />
      <div>
        <MaterialHeader />
        <hr className="m-[0px_35px] text-gray-400" />
      </div>
    </div>
  );
};

export default MaterialPage;
