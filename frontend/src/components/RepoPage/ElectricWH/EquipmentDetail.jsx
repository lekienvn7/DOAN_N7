import React from "react";
import { motion } from "framer-motion";
import { CircuitBoard } from "lucide-react";
import { Cable } from "lucide-react";
import { Plug } from "lucide-react";
import { ToggleLeft } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
import { CircleGauge } from "lucide-react";

const EquipmentDetail = () => {
  const equipments = [
    {
      id: 1,
      name: "Cầu dao 2P",
      code: "VT001",
      quantity: 20,
      status: "Còn",
      icon: <CircuitBoard size={50} />,
      description: "Cầu dao 2P dùng trong tủ điện công nghiệp.",
    },
    {
      id: 2,
      name: "Dây điện lõi đồng",
      code: "VT002",
      quantity: 100,
      status: "Còn",
      icon: <Cable size={50} />,
      description: "Dây điện lõi đồng tiết diện 2.5mm, bọc PVC cách điện.",
    },
    {
      id: 3,
      name: "Ổ cắm 3 chân",
      code: "VT003",
      quantity: 15,
      status: "Hỏng",
      icon: <Plug size={50} />,
      description: "Ổ cắm công nghiệp 3 chân, 220V.",
    },
    {
      id: 4,
      name: "Cầu chì bảo vệ 10A",
      code: "VT004",
      quantity: 35,
      status: "Còn",
      icon: <CircuitBoard size={50} />,
      description: "Cầu chì bảo vệ dòng 10A, dùng trong mạch điện dân dụng.",
    },
    {
      id: 5,
      name: "Công tắc đảo chiều",
      code: "VT005",
      quantity: 25,
      status: "Còn",
      icon: <ToggleLeft size={50} />,
      description: "Công tắc đảo chiều dùng trong mạch khởi động sao tam giác.",
    },
    {
      id: 6,
      name: "Bộ biến tần mini",
      code: "VT006",
      quantity: 8,
      status: "Còn",
      icon: <ArrowDownUp size={50} />,
      description: "Biến tần mini 220V dùng cho mô hình thí nghiệm điện tử.",
    },
    {
      id: 7,
      name: "Đồng hồ đo điện áp",
      code: "VT007",
      quantity: 12,
      status: "Còn",
      icon: <CircleGauge size={50} />,
      description: "Dụng cụ đo điện áp AC/DC trong phòng thực hành.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#1d1d1f] text-white flex flex-col items-center  relative">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl font-qurova mb-6"
      >
        Danh sách thiết bị
      </motion.h1>

      {/*VÙNG CHỨA SCROLL */}
      <div className="relative w-full max-w-5xl h-[600px] rounded-2xl overflow-hidden">
        {/* Lớp cuộn chính */}
        <div
          className="overflow-y-scroll no-scrollbar h-full px-6 py-4
                     bg-[#2c2c2e]/40 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {equipments.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "#3a3a3c",
                  transition: { duration: 0.25 },
                }}
                className="bg-[#2c2c2e] p-6 rounded-2xl 
                           flex flex-col sm:flex-row sm:items-center sm:justify-between
                           gap-4 shadow-[0_5px_20px_rgba(0,0,0,0.5)] 
                           transition-all duration-30 cursor-pointer"
              >
                {/* Icon + Tên */}
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{item.icon}</div>
                  <div>
                    <p className="font-bold text-xl">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.code}</p>
                  </div>
                </div>

                {/* Mô tả */}
                <p className="text-gray-300 flex-1 text-sm sm:text-base leading-snug sm:mx-6">
                  {item.description}
                </p>

                {/* Trạng thái + SL */}
                <div className="flex flex-col items-end gap-1">
                  <p
                    className={`font-semibold text-sm ${
                      item.status === "Còn" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {item.status}
                  </p>
                  <p className="text-sm text-gray-400">
                    SL:{" "}
                    <span className="text-white font-semibold">
                      {item.quantity}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hiệu ứng fade ở mép trên */}
        <div
          className="pointer-events-none absolute top-0 left-0 w-full h-[40px]
                        bg-gradient-to-b from-[#1d1d1f] via-[#1d1d1f]/60 to-transparent z-10"
        />

        {/* Hiệu ứng fade ở mép dưới */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[60px]
                        bg-gradient-to-t from-[#1d1d1f] via-[#1d1d1f]/60 to-transparent z-10"
        />
      </div>
    </div>
  );
};

export default EquipmentDetail;
