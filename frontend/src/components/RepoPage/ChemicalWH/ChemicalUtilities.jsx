import React, { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { useEffect } from "react";

const ChemicalUtilities = () => {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState("");
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/repository/chemical");
        if (res.data.success) {
          setRepo({
            ...res.data.data,
            totalMaterials: res.data.totalMaterials,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, []);

  return (
    <div className=" flex flex-col p-[15px] w-[240px] h-[calc(100vh-120px)] bg-bgmain border-t-1 border-r-1  border-gray-700">
      <div>
        <h2 className="text-center text-[18px] font-satoshi font-bold">
          Tổng quan
        </h2>
        <div className="flex flex-row text-[15px] gap-[5px]">
          <span>Tổng vật tư trong kho:</span>
          {loading ? (
            <span className="w-4 h-4 border-2 border-[#fdd700] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            `${repo.totalMaterials} loại`
          )}
        </div>
      </div>
    </div>
  );
};

export default ChemicalUtilities;
