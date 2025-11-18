import React, { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { useEffect } from "react";

const ElectricUtilities = () => {
  const [repo, setRepo] = useState("");
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axiosClient.get("/repository/electric");
        if (res.data.success) {
          setRepo({
            ...res.data.data,
            totalMaterials: res.data.totalMaterials,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      }
    };
    fetchRepo();
  }, []);

  return (
    <div className=" flex flex-col p-[15px] w-[240px] h-[calc(100vh-160px)] bg-bgmain border-t-1 border-r-1  border-gray-700">
      <div>
        <h2 className="text-center text-[18px] font-satoshi font-bold">
          Tổng quan
        </h2>
        <div>Tổng vật tư trong kho: {repo.totalMaterials}</div>
      </div>
    </div>
  );
};

export default ElectricUtilities;
