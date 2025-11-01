import React from "react";
import { useState, useEffect } from "react";
import axiosClient from "axios";
import RepoMenu from "../RepoMenu";

const ElectricList = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axiosClient.get("/repository/electric");
        if (res.data.success) {
          setMaterials(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      }
    };

    fetchMaterials();
  }, []);
  return (
    <div>
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default ElectricList;
