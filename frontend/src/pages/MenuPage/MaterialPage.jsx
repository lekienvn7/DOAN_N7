import React from "react";
import MaterialHeader from "@/components/MaterialPage/MaterialHeader";
import RepoMenu from "@/components/MaterialPage/RepoMenu";
import { Outlet } from "react-router-dom";

const MaterialPage = () => {
  return (
    <div className="flex flex-row">
      <RepoMenu />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default MaterialPage;
