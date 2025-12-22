import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import axiosClient from "@/api/axiosClient";
import AnimatedStat from "@/components/AnimatedStat";
import NoticePage from "./NoticePage";
import WeatherToday from "@/components/WeatherToday";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [totals, setTotals] = useState({
    electric: "",
    automotive: "",
    mechanical: "",
    iot: "",
    technology: "",
    fashion: "",
    telecom: "",
    chemical: "",
  });

  const fetchRepo = async (type) => {
    try {
      const res = await axiosClient.get(`/repository/${type}`);
      if (res.data.success) {
        setTotals((p) => ({ ...p, [type]: res.data.totalMaterials }));
      }
    } catch {}
  };

  useEffect(() => {
    Object.keys(totals).forEach(fetchRepo);
  }, []);

  return (
    <div
      className="
        w-full
        px-[48px]
        py-[36px]
        page-ambient
        font-googleSans
        text-[var(--text-primary)]
      "
    >
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-full
          bg-[var(--bg-panel)]
          rounded-[28px]
          p-[36px]
          mb-[36px]
          shadow-[var(--shadow-md)]
          grid
          grid-cols-[1.2fr_1fr]
          gap-[40px]
          items-center
        "
      >
        {/* LEFT */}
        <div className="flex flex-col gap-[18px]">
          <p className="text-[48px] font-bold">Xin chào, {user?.fullName}</p>

          <div className="text-[16px] text-[var(--text-primary)] space-y-[6px]">
            <p>
              <span className="text-highlightcl">Chức vụ:</span>{" "}
              {user?.roleName}
            </p>
            <p>
              <span className="text-highlightcl">Email:</span>{" "}
              {user?.email || "Không có"}
            </p>
            <p>
              <span className="text-highlightcl">SĐT:</span>{" "}
              {user?.phone || "Không có"}
            </p>
          </div>

          <p className="text-[14px] text-[var(--text-tertiary)] max-w-[520px]">
            Chúc bạn một ngày làm việc hiệu quả. Theo dõi kho vật tư, thông báo
            và tình hình hệ thống ngay tại đây.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-end">
          <WeatherToday />
        </div>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-2 gap-[36px] items-start">
        {/* ===== DANH SÁCH KHO ===== */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-[var(--bg-panel)]
            rounded-[24px]
            p-[28px]
            shadow-[var(--shadow-md)]
          "
        >
          <div className="flex justify-between items-center mb-[24px]">
            <p className="text-[40px] font-bold gradient-text">Danh sách kho</p>
            <p className="text-[14px] text-[var(--text-tertiary)]">
              Tổng loại vật tư
            </p>
          </div>

          <div className="flex flex-col gap-[14px]">
            {[
              ["Kho điện", totals.electric, "/repository/electric"],
              [
                "Kho công nghệ ô tô",
                totals.automotive,
                "/repository/automotive",
              ],
              ["Kho cơ khí", totals.mechanical, "/repository/mechanical"],
              ["Kho nhúng & IoT", totals.iot, "/repository/iot"],
              ["Kho CNTT", totals.technology, "/repository/technology"],
              ["Kho thời trang", totals.fashion, "/repository/fashion"],
              ["Kho viễn thông", totals.telecom, "/repository/telecom"],
              ["Kho hóa chất", totals.chemical, "/repository/chemical"],
            ].map(([name, value, link]) => (
              <button
                key={name}
                onClick={() => navigate(link)}
                className="
                  h-[56px]
                  px-[18px]
                  rounded-[16px]
                  bg-[var(--bg-subtle)]
                  flex
                  items-center
                  justify-between
                  hover:bg-[var(--bg-hover)]
                  transition
                "
              >
                <span className="text-[15px] font-medium">{name}</span>
                <AnimatedStat value={value} color="var(--text-primary)" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ===== THÔNG BÁO ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-[var(--bg-panel)]
            rounded-[24px]
            p-[28px]
            shadow-[var(--shadow-md)]
          "
        >
          <p className="text-[40px] font-bold gradient-text mb-[20px]">
            Thông báo
          </p>
          <NoticePage />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
