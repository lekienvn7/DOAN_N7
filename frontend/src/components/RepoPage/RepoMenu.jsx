import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PlugZap,
  FlaskConical,
  Cpu,
  Computer,
  Wrench,
  Car,
  Network,
  Shirt,
} from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "@/api/axiosClient";

const RepoMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);

  const iconMap = {
    electric: PlugZap,
    chemical: FlaskConical,
    iot: Network,
    technology: Computer,
    mechanical: Wrench,
    automotive: Car,
    telecom: Cpu,
    fashion: Shirt,
  };

  const REPO_COLORS = {
    mechanical: "#E5E7EB", // Cơ khí
    iot: "#5eead4", // Nhúng & IoT
    technology: "#60a5fa", // CNTT
    automotive: "#fb923c", // Công nghệ ô tô
    telecom: "#a78bfa", // Điện tử viễn thông
    fashion: "#f472b6", // Thiết kế thời trang
    electric: "#fdd700", // Điện
    chemical: "#c7a7ff", // Hóa chất
  };

  // Lấy danh sách kho từ backend
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axiosClient.get("/repository");
        if (res.data.success) {
          setRepos(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách kho:", error);
      }
    };
    fetchRepos();
  }, []);

  // Xác định kho hiện tại trong danh sách
  const currentIndex = repos.findIndex((repo) =>
    location.pathname.startsWith(`/repository/${repo.repoID}`)
  );

  // Lắng nghe phím tắt (A/D)
  useEffect(() => {
    const handleKeyPress = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (["input", "textarea"].includes(tag) || e.target.isContentEditable)
        return;

      const key = e.key.toLowerCase();
      if (repos.length === 0) return;

      if (key === "a") {
        // A → kho trước
        const prevIndex = (currentIndex - 1 + repos.length) % repos.length;
        navigate(`/repository/${repos[prevIndex].repoID}`);
      } else if (key === "d") {
        // D → kho sau
        const nextIndex = (currentIndex + 1) % repos.length;
        navigate(`/repository/${repos[nextIndex].repoID}`);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [repos, currentIndex, navigate]);

  return (
    <motion.ul
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 12,
      }}
      className="flex flex-row flex-wrap gap-[25px] items-center justify-center gpu"
    >
      {repos.map((repo, index) => {
        const Icon = iconMap[repo.repoID] || PlugZap;
        const path = `/repository/${repo.repoID.toLowerCase()}`;
        const isActive = location.pathname.startsWith(path);

        return (
          <li key={repo.repoID || index}>
            <Link
              to={path}
              className={`group flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? `text-[${REPO_COLORS[repo.repoID]}]`
                  : "text-[#A1A1A6] hover:text-textpri"
              }`}
            >
              <Icon
                size={20}
                className={`transition-colors duration-300 ${
                  isActive
                    ? `text-[${REPO_COLORS[repo.repoID]}]`
                    : "text-[#A1A1A6] group-hover:text-textpri"
                }`}
              />
              <p className="mt-1 text-[12px] font-medium whitespace-nowrap">
                {repo.repoName}
              </p>
            </Link>
          </li>
        );
      })}
    </motion.ul>
  );
};

export default RepoMenu;
