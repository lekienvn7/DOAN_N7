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

/* ================= CONST MAP TÊN KHO ================= */
const REPO_NAME = [
  { repoID: "electric", name: "Điện" },
  { repoID: "chemical", name: "Hóa chất" },
  { repoID: "automotive", name: "CN ô tô" },
  { repoID: "mechanical", name: "Cơ khí" },
  { repoID: "fashion", name: "Thời trang" },
  { repoID: "telecom", name: "Điện tử viễn thông" },
  { repoID: "technology", name: "CNTT" },
  { repoID: "iot", name: "Nhúng & IoT" },
];

const Monthly = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  /* ===== REAL DATA ===== */
  const [borrowTop, setBorrowTop] = useState([]);
  const [damagedTop, setDamagedTop] = useState([]);
  const [repoSummary, setRepoSummary] = useState([]);
  const [newMaterials, setNewMaterials] = useState({ total: 0, list: [] });

  /* ================= FETCH REPORT ================= */
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await axiosClient.get(
          `/report/monthly?month=${month}&year=${year}`
        );

        const data = res.data?.data || {};

        setBorrowTop(data.borrowFrequency || []);
        setDamagedTop(data.damagedMaterials || []);
        setRepoSummary(data.repoSummary || []);
        setNewMaterials(data.newMaterials || { total: 0, list: [] });
      } catch (err) {
        console.error("Lỗi lấy báo cáo:", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [month, year]);

  /* ================= FILTER ================= */
  const borrowList = borrowTop.filter((i) => i.borrowCount > 0);
  const damagedList = damagedTop.filter((i) => i.damagedQuantity > 0);

  /* ================= MAP TÊN KHO ================= */
  const repoNameMap = useMemo(
    () => Object.fromEntries(REPO_NAME.map((r) => [r.repoID, r.name])),
    []
  );

  /* ================= CHART DATA ================= */
  const repoChartData = useMemo(() => {
    return {
      labels: repoSummary.map(
        (r) => repoNameMap[r.repoID] ?? r.repoName ?? "Không rõ"
      ),
      datasets: [
        {
          label: "Vật tư gốc",
          data: repoSummary.map((r) => r.total || 0),
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
        {
          label: "Vật tư hỏng",
          data: repoSummary.map((r) => r.damaged || 0),
          backgroundColor: "#ef4444",
          borderRadius: 6,
        },
      ],
    };
  }, [repoSummary, repoNameMap]);

  /* ================= CHART OPTIONS (ANIMATION TỪ 0) ================= */
  const repoChartOptions = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    animations: {
      y: {
        from: (ctx) => {
          // ÉP CHẠY TỪ ĐÁY TRỤC (0)
          if (ctx.type === "data") {
            return ctx.chart.scales.y.getPixelForValue(0);
          }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] gap-3">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--accent-blue)",
            borderTopColor: "transparent",
          }}
        />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="w-screen px-[100px] py-[20px]">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-[30px]">
        <h2 className="font-bold text-[34px]">
          Báo cáo tháng{" "}
          <span className="text-[var(--accent-blue)]">{month}</span>
        </h2>

        <div className="flex gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border-[var(--border-light)] bg-[var(--bg-panel)] px-3 py-2 rounded-[12px]"
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
            className="border-[var(--border-light)] bg-[var(--bg-panel)] px-3 py-2 rounded-[12px]"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[50px]">
        {/* ================= CHART ================= */}
        <div className="col-span-2 bg-[var(--bg-panel)] p-6 rounded-[12px] shadow-[var(--shadow-md)]">
          <h3 className="font-bold text-[20px] mb-4">
            Thống kê vật tư theo kho
          </h3>

          {loading ? (
            <div className="h-[360px] animate-pulse bg-gray-200/20 rounded-xl" />
          ) : (
            <Bar data={repoChartData} options={repoChartOptions} />
          )}
        </div>

        {/* ================= LISTS ================= */}
        <div className="flex flex-col gap-6">
          {/* BORROW TOP */}
          <div className="bg-[var(--bg-panel)] h-[510px] p-5 rounded-[12px] shadow-[var(--shadow-md)]">
            <h3 className="font-bold text-[20px] mb-3">
              Vật tư mượn nhiều nhất
            </h3>

            {loading ? (
              <p className="text-gray-400 h-[400px]">Đang tải...</p>
            ) : borrowList.length === 0 ? (
              <p className="text-gray-400 h-[400px]">Không có dữ liệu</p>
            ) : (
              <ul className="h-[400px] overflow-y-auto space-y-2">
                {borrowList.map((i) => (
                  <li
                    key={i.materialId}
                    className="flex justify-between bg-[var(--bg-subtle)] p-2 rounded-lg"
                  >
                    <span>{i.name}</span>
                    <span className="font-semibold">{i.borrowCount} lượt</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ================= NEW MATERIALS ================= */}
      <div className="flex flex-row items-center justify-between">
        <div className="bg-[var(--bg-panel)] w-[650px] h-[350px] p-5 rounded-[12px] shadow-[var(--shadow-md)] mt-[50px]">
          <h3 className="font-bold text-[20px] mb-3">
            Vật tư được thêm mới trong tháng
          </h3>

          {newMaterials.total === 0 ? (
            <p className="text-gray-400">Không có vật tư mới</p>
          ) : (
            <>
              <p className="text-sm mb-3">
                Tổng cộng:{" "}
                <span className="font-semibold">{newMaterials.total}</span> vật
                tư
              </p>

              <ul className="h-[200px] overflow-y-auto space-y-2">
                {newMaterials.list.map((m) => (
                  <li
                    key={m._id}
                    className="bg-[var(--bg-subtle)] p-2 rounded-lg"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-sm">{m.materialID}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{repoNameMap[m.category] || "Không rõ"}</span>
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

        {/* DAMAGED TOP */}
        <div className="bg-[var(--bg-panel)] w-[650px] h-[350px] p-5 rounded-[12px] shadow-[var(--shadow-md)] mt-[50px]">
          <h3 className="font-bold text-[20px] mb-[40px]">
            Vật tư hỏng nhiều nhất
          </h3>

          {loading ? (
            <p className="text-gray-400 h-[200px]">Đang tải...</p>
          ) : damagedList.length === 0 ? (
            <p className="text-gray-400 h-[200px]">Không có dữ liệu</p>
          ) : (
            <ul className="h-[200px] overflow-y-auto space-y-2">
              {damagedList.map((i) => (
                <li
                  key={i.materialId}
                  className="flex justify-between bg-[var(--bg-subtle)] p-2 rounded-lg"
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
  );
};

export default Monthly;
