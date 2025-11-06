import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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

const RepoMenu = () => {
  const location = useLocation();

  const repoList = [
    {
      name: "Kho hóa chất",
      path: "chemical/repair",
      icon: FlaskConical,
    },
    { name: "Kho điện", path: "electric/repair", icon: PlugZap },
    { name: "Kho cơ khí", path: "mechanical/repair", icon: Wrench },
    { name: "Kho nhúng và Iot", path: "iot/repair", icon: Network },
    {
      name: "Kho công nghệ thông tin",
      path: "technology/repair",
      icon: Computer,
    },
    { name: "Kho công nghệ oto", path: "automotive/repair", icon: Car },
    { name: "Kho điện tử viễn thông", path: "telecom/repair", icon: Cpu },
    { name: "Kho thời trang", path: "fashion/repair", icon: Shirt },
  ];

  return (
    <div className="w-[250px] h-[calc(100vh-60px)] p-[35px_15px] bg-bgmain border-t-1 border-r-1  border-gray-700">
      <div className="flex flex-col gap-[50px] items-left">
        <p className="text-[20px] font-bold text-textpri">Danh sách kho</p>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="flex flex-col gap-[30px] text-textsec"
        >
          {repoList.map((item) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-[10px] transition ${
                    location.pathname.split("/")[2] === item.path.split("/")[0]
                      ? "text-[#ffd700] font-semibold"
                      : "hover:text-textpri"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
};

export default RepoMenu;
