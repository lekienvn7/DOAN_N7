import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

  return (
    <motion.ul
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      className="flex flex-row flex-wrap gap-[50px] items-center justify-center"
    >
      {repos.map((repo, index) => {
        const Icon = iconMap[repo.repoID] || PlugZap;
        const path = `/repository/${repo.repoID.toLowerCase()}`;
        const isActive = location.pathname === path;

        return (
          <li key={repo.repoID || index} className="">
            <Link
              to={path}
              className={`group flex flex-col whitespace-nowrap gap-0 items-center text-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-highlightcl"
                  : "text-[#A1A1A6] hover:text-highlightcl"
              }`}
            >
              <Icon
                size={30}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-highlightcl"
                    : "text-[#A1A1A6] group-hover:text-highlightcl"
                }`}
              />
              <p className="mt-1 text-[12px] font-medium">{repo.repoName}</p>
            </Link>
          </li>
        );
      })}
    </motion.ul>
  );
};

export default RepoMenu;
