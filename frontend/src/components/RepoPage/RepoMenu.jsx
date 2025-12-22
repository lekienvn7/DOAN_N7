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
    mechanical: "#8E8E93",
    iot: "#5EEAD4",
    technology: "#60A5FA",
    automotive: "#FB923C",
    telecom: "#FF453A",
    fashion: "#F472B6",
    electric: "#FDD700",
    chemical: "#C7A7FF",
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axiosClient.get("/repository");
        if (res.data.success) {
          setRepos(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách kho:", err);
      }
    };
    fetchRepos();
  }, []);

  const currentIndex = repos.findIndex((repo) =>
    location.pathname.startsWith(`/repository/${repo.repoID}`)
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (["input", "textarea"].includes(tag) || e.target.isContentEditable)
        return;

      if (!repos.length) return;

      if (e.key.toLowerCase() === "a") {
        navigate(
          `/repository/${
            repos[(currentIndex - 1 + repos.length) % repos.length].repoID
          }`
        );
      }
      if (e.key.toLowerCase() === "d") {
        navigate(
          `/repository/${repos[(currentIndex + 1) % repos.length].repoID}`
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [repos, currentIndex, navigate]);

  return (
    <motion.ul
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-row gap-[25px] items-center justify-center gpu"
    >
      {repos.map((repo) => {
        const Icon = iconMap[repo.repoID] || PlugZap;
        const path = `/repository/${repo.repoID.toLowerCase()}`;
        const isActive = location.pathname.startsWith(path);
        const activeColor = REPO_COLORS[repo.repoID];

        return (
          <li key={repo.repoID}>
            <Link
              to={path}
              className="group flex flex-col items-center text-center transition-all duration-200 cursor-pointer"
              style={{
                color: isActive ? activeColor : "var(--text-tertiary)",
              }}
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="transition-colors"
                style={{
                  color: isActive ? activeColor : "var(--text-tertiary)",
                }}
              />

              <span
                className={` mt-1
                  text-[12px] font-medium whitespace-nowrap
                  ${!isActive && "group-hover:text-[var(--text-primary)]"}
                `}
              >
                {repo.repoName}
              </span>
            </Link>
          </li>
        );
      })}
    </motion.ul>
  );
};

export default RepoMenu;
