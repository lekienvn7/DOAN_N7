import React from "react";
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

  const iconMap = {
    Điện: PlugZap,
    "Hóa chất": FlaskConical,
    Nhúng: Network,
    "Công nghệ thông tin": Computer,
    "Cơ khí": Wrench,
    "Ô tô": Car,
    "Điện tử": Cpu,
    "Thời trang": Shirt,
  };

  const repoList = [
    { name: "Kho điện", path: "/repository/electric", icon: PlugZap },
    { name: "Kho hóa chất", path: "/repository/chemical", icon: FlaskConical },
    { name: "Kho nhúng/IoT", path: "/repository/iot", icon: Network },
    {
      name: "Kho Công nghệ thông tin",
      path: "/repository/technology",
      icon: Computer,
    },
    { name: "Kho cơ khí", path: "/repository/mechanical", icon: Wrench },
    { name: "Kho công nghệ oto", path: "/repository/automotive", icon: Car },
    {
      name: "Kho điện tử/viễn thông",
      path: "/repository/telecom",
      icon: Cpu,
    },
    { name: "Kho thời trang", path: "/repository/fashion", icon: Shirt },
  ];

  return (
    <motion.ul
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      className="flex flex-row flex-wrap gap-[65px] items-center justify-center"
    >
      {repoList.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <li
            key={index}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Link
              to={item.path}
              className={`group flex flex-col items-center text-center transition-all duration-300 hover:scale-105 ${
                isActive ? "text-white" : "text-[#A1A1A6] hover:text-white"
              }`}
            >
              <Icon
                size={40}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-[#A1A1A6] group-hover:text-white"
                }`}
              />
              <p className="mt-1 text-[15px] font-medium">{item.name}</p>
            </Link>
          </li>
        );
      })}
    </motion.ul>
  );
};

export default RepoMenu;
