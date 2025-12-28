import { useState } from "react";
import FashionDetail from "./FashionDetail";
import cadivi from "@/assets/images/cadivi225.png";

const FashionCard = ({ item }) => {
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
              ? "bg-[var(--text-primary)] text-[var(--bg-panel)] border border-[var(--border-light)]"
              : "bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-light)]"
          }
          rounded-[24px] p-8
          cursor-pointer
          transition-all duration-300 ease-out
          hover:scale-[1.02]
          hover:shadow-[var(--shadow-md)]`}
      >
        <h3 className="text-[20px] font-semibold">{item.name}</h3>

        <img
          src={cadivi}
          alt={item.name}
          className="w-full h-[250px] object-contain group-hover:scale-[1.03] transition"
        />

        <div className="flex justify-between items-center">
          <p className="text-[13px] text-[var(--text-tertiary)] line-clamp-2">
            {item.description || "Vật tư thời trang phục vụ thực hành"}
          </p>

          <div className="px-[25px] py-[10px] bg-[var(--bg-subtle)] rounded-[48px] text-[13px]">
            {item.quantity} {item.unit}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition rounded-[24px]">
          Ấn để xem chi tiết
        </div>
      </div>

      <FashionDetail open={open} item={item} onClose={() => setOpen(false)} />
    </>
  );
};

export default FashionCard;
