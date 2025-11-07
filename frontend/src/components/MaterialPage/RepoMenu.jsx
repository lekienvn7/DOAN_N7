import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu component này nằm dưới route cha /material/* thì để basePath = "/material/"
  const basePath = "/material/"; // đổi hoặc bỏ nếu bạn đang dùng relative routes

  const repoList = [
    { name: "Kho hóa chất", path: "chemical/repair", icon: FlaskConical },
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

  // segment kho hiện tại: /material/<SEGMENT>/...
  const currentSegment = useMemo(
    () => location.pathname.split("/")[2] || "",
    [location.pathname]
  );

  // index hiện tại trong repoList (so theo segment đầu của path)
  const currentIndex = useMemo(() => {
    const idx = repoList.findIndex(
      (r) => r.path.split("/")[0] === currentSegment
    );
    return idx >= 0 ? idx : 0; // fallback an toàn
  }, [currentSegment]);

  // dựng đường dẫn (absolute) để navigate chắc cú
  const buildPath = (p) => {
    // nếu route lồng dưới /material/* thì dùng absolute cho rõ ràng
    if (p.startsWith("/")) return p;
    return `${basePath}${p}`;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const isTyping =
        tag === "input" || tag === "textarea" || e.target.isContentEditable;
      if (isTyping) return; // đừng cướp phím khi user đang gõ

      const key = e.key.toLowerCase();
      if (key === "w") {
        const prevIndex =
          (currentIndex - 1 + repoList.length) % repoList.length;
        navigate(buildPath(repoList[prevIndex].path));
      } else if (key === "s") {
        const nextIndex = (currentIndex + 1) % repoList.length;
        navigate(buildPath(repoList[nextIndex].path));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, navigate]);

  return (
    <div className="w-[250px] h-[calc(100vh-60px)] p-[35px_15px] bg-bgmain border-t border-r border-gray-700">
      <div className="flex flex-col gap-[50px] items-start">
        <p className="text-[20px] font-bold text-textpri">Danh sách kho</p>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col gap-[30px] text-textsec"
        >
          {repoList.map((item) => {
            const Icon = item.icon;
            const itemSegment = item.path.split("/")[0];
            const isActive = currentSegment === itemSegment;

            return (
              <motion.li
                key={item.name}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  to={buildPath(item.path)}
                  className={`flex items-center gap-[10px] transition-colors duration-150 ${
                    isActive
                      ? "text-[#ffd700] font-semibold"
                      : "hover:text-textpri"
                  }`}
                  aria-current={isActive ? "page" : undefined}
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
