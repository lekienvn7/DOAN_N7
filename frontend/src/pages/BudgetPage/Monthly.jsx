import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ================= MOCK CHART DATA ================= */
const mockRepoChart = [
  { name: "Kho Điện", total: 420, damaged: 18 },
  { name: "Kho Cơ khí", total: 360, damaged: 12 },
  { name: "Kho CNTT", total: 300, damaged: 6 },
  { name: "Kho Thời trang", total: 390, damaged: 14 },
  { name: "Kho Hóa chất", total: 390, damaged: 14 },
  { name: "Kho Điện tử", total: 390, damaged: 14 },
  { name: "Kho Iot", total: 390, damaged: 14 },
  { name: "Kho Ô tô", total: 390, damaged: 68 },
];

const Monthly = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);
  const [newMaterials, setNewMaterials] = useState({
    total: 0,
    list: [],
  });

  /* ===== REAL DATA FROM BACKEND ===== */
  const [borrowTop, setBorrowTop] = useState([]);
  const [damagedTop, setDamagedTop] = useState([]);

  /* ================= FETCH REAL REPORT ================= */
  useEffect(() => {
    setLoading(true);

    axiosClient
      .get(`/report/monthly?month=${month}&year=${year}`)
      .then((res) => {
        const data = res.data.data;
        setBorrowTop(data.borrowFrequency || []);
        setDamagedTop(data.damagedMaterials || []);
        setNewMaterials(data.newMaterials || { total: 0, list: [] });
      })
      .catch((err) => {
        console.error("Lỗi lấy báo cáo:", err);
      })
      .finally(() => setLoading(false));
  }, [month, year]);

  /* ================= FILTER REAL LIST ================= */
  const borrowList = borrowTop.filter((i) => i.borrowCount > 0);
  const damagedList = damagedTop.filter((i) => i.damagedQuantity > 0);

  /* ================= MOCK CHART ================= */
  const repoChartData = useMemo(() => {
    return {
      labels: mockRepoChart.map((r) => r.name),
      datasets: [
        {
          label: "Vật tư gốc",
          data: mockRepoChart.map((r) => r.total),
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
        {
          label: "Vật tư hỏng",
          data: mockRepoChart.map((r) => r.damaged),
          backgroundColor: "#ef4444",
          borderRadius: 6,
        },
      ],
    };
  }, []);

  const repoChartOptions = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
      delay: (ctx) => ctx.dataIndex * 120,
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const RepoName = [
    { type: "ElectricMaterial", name: "Kho Điện" },
    { type: "ChemicalMaterial", name: "Kho Hóa chất" },
    { type: "AutomotiveMaterial", name: "Kho Công nghệ ô tô" },
    { type: "MechanicalMaterial", name: "Kho Cơ khí" },
    { type: "FashionMaterial", name: "Kho Thời trang" },
    { type: "TelecomMaterial", name: "Kho Điện tử viễn thông" },
    { type: "TechnologyMaterial", name: "Kho Công nghệ thông tin" },
    { type: "IotMaterial", name: "Kho Nhúng & Iot" },
  ];

  return (
    <div className="w-screen px-[100px] py-[20px]">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-[30px]">
        <h2 className="font-bold text-[34px]">Báo cáo theo tháng</h2>

        <div className="flex gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border-[var(--border-light)] bg-[var(--bg-panel)] px-3 py-2 rounded-[12px] outline-none"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border-[var(--border-light)] bg-[var(--bg-panel)] px-3 py-2 rounded-[12px] outline-none"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* ================= CHART (MOCK) ================= */}
        <div className="col-span-2 bg-[var(--bg-panel)] p-6 rounded-[12px] shadow-[var(--shadow-sm)]">
          <h3 className="font-bold text-[20px] mb-4">
            Bảng dữ liệu vật tư (minh hoạ)
          </h3>
          <Bar data={repoChartData} options={repoChartOptions} />
        </div>

        {/* ================= LIST (REAL DATA) ================= */}
        <div className="flex flex-col gap-6">
          {/* BORROW TOP */}
          <div className="bg-[var(--bg-panel)] p-5 rounded-[12px] shadow-[var(--shadow-sm)]">
            <h3 className="font-bold text-[20px] mb-3">
              Vật tư mượn nhiều nhất
            </h3>
            {loading ? (
              <p className="text-gray-400 text-sm h-[300px]">Đang tải...</p>
            ) : borrowList.length === 0 ? (
              <p className="text-gray-400 text-sm h-[300px]">
                Không có dữ liệu
              </p>
            ) : (
              <ul className="flex flex-col gap-[5px] h-[300px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60">
                {borrowList.map((i) => (
                  <li
                    key={i.materialId}
                    className="flex justify-between 
                    bg-[var(--bg-subtle)]
                    border border-[var(--border-light)]
                    p-2 rounded-[12px]
                    text-[15px]"
                  >
                    <span>{i.name}</span>
                    <span className="font-semibold">{i.borrowCount} lượt</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DAMAGED TOP */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="font-bold text-[20px] mb-3">
              Vật tư hỏng nhiều nhất
            </h3>
            {loading ? (
              <p className="text-gray-400 text-sm h-[100px]">Đang tải...</p>
            ) : damagedList.length === 0 ? (
              <p className="text-gray-400 text-sm h-[100px]">
                Không có dữ liệu
              </p>
            ) : (
              <ul className="flex flex-col gap-[5px] h-[100px] max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60">
                {damagedList.map((i) => (
                  <li
                    key={i.materialId}
                    className="flex justify-between 
                    bg-[var(--bg-subtle)]
                    border border-[var(--border-light)]
                    p-2 rounded-[12px]
                    text-[15px]"
                  >
                    <span>{i.name}</span>
                    <span className="font-semibold text-red-500">
                      {i.damagedQuantity} cái
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        * Danh sách vật tư lấy từ dữ liệu thực tế theo tháng được chọn.
      </p>

      <div className="bg-[var(--bg-panel)] p-5 rounded-[12px] shadow-[var(--shadow-sm)] mt-[50px]">
        <h3 className="font-bold text-[20px] mb-3">
          Vật tư được thêm mới trong tháng
        </h3>

        {newMaterials.total === 0 ? (
          <p className="text-gray-400 text-sm">Không có vật tư mới</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Tổng cộng:{" "}
              <span className="font-semibold">{newMaterials.total}</span> vật tư
            </p>

            <ul className="h-[250px] max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60">
              {newMaterials.list.map((m) => (
                <li
                  key={m._id}
                  className="flex flex-col justify-between 
                    bg-[var(--bg-subtle)]
                    border border-[var(--border-light)]
                    p-2 rounded-[12px]
                    text-[15px]"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-[var(--text-tertiary)] font-semibold">{m.materialID}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {RepoName.find((r) => r.type === m.category)?.name}
                    </span>
                    <span>
                      {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Monthly;
