import { useState } from "react";
import ElectricDetail from "./ElectricDetail";
import cadivi from "@/assets/images/cadivi225.png";

const ElectricCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`group relative flex flex-col justify-between
          min-w-[450px] max-w-[320px]
          min-h-[500px]
          ${
            item.borrowType === "approval"
              ? "bg-[var(--text-primary)] text-[var(--bg-panel)] shadow-[var(--shadow-md)]"
              : "bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-[var(--shadow-md)]"
          }
          rounded-[24px] p-8
          cursor-pointer
          transition-all duration-300 ease-out
          hover:scale-[1.02]
          hover:shadow-[var(--shadow-md)]`}
      >
        {/* TITLE */}
        <h3
          className={`text-[20px] font-semibold ${
            item.borrowType === "approval"
              ? "text-[var(--bg-panel)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {item.name}
        </h3>

        {/* IMAGE */}
        <img
          src={cadivi}
          alt={item.name}
          className="
            w-full h-[250px] object-contain
            transition-transform duration-300
            group-hover:scale-[1.03]
          "
        />

        {/* DESCRIPTION + QUANTITY */}
        <div className="flex flex-row justify-between items-center">
          <p
            className={`text-[13px] max-w-[260px] ${
              item.borrowType === "approval"
                ? "text-[var(--bg-subtle)]"
                : "text-[var(--text-tertiary)]"
            } line-clamp-2`}
          >
            {item.description || "Thiết bị điện phục vụ giảng dạy"}
          </p>

          <div
            className={`px-[25px] py-[10px]
              ${
                item.borrowType === "approval"
                  ? "bg-[var(--text-secondary)] text-[var(--bg-subtle)]  border border-[var(--text-primary)]"
                  : "bg-[var(--bg-subtle)] text-[var(--text-primary)]  border border-[var(--border-light)]"
              }
              
              rounded-[48px]
              text-[13px]
              font-medium`}
          >
            {item.quantity} {item.unit}
          </div>
        </div>

        {/* HOVER OVERLAY */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            flex items-center justify-center
            text-[15px] font-medium
            text-[var(--text-secondary)]
            bg-white/80
            backdrop-blur-sm
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-300
            rounded-[24px]
          "
        >
          Ấn để xem chi tiết
        </div>
      </div>

      <ElectricDetail open={open} item={item} onClose={() => setOpen(false)} />
    </>
  );
};

export default ElectricCard;
