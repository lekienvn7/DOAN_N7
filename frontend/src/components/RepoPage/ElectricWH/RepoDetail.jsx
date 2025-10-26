import React from "react";
import MaterialDetail from "./MaterialDetail";
import EquipmentDetail from "./EquipmentDetail";

const RepoDetail = () => {
  return (
    <div className="flex flex-col gap-[50px]">
      <MaterialDetail />
      <EquipmentDetail />
    </div>
  );
};

export default RepoDetail;
