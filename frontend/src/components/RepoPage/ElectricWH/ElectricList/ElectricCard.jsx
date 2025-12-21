import { useState } from "react";
import { Tooltip } from "react-tooltip";
import ElectricDetail from "./ElectricDetail";
import cadivi from "@/assets/images/cadivi225.png";

const ElectricCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        data-tooltip-id={`tip-${item._id}`}
        className="
          group relative flex flex-col justify-between
          min-w-[450px] max-w-[320px]
          min-h-[500px]
          bg-[#1a1a1a] text-textpri
          rounded-[24px] p-8
          cursor-pointer
          transition-all duration-300 ease-out
          hover:scale-[1.02]
          hover:shadow-[0_30px_60px_rgba(0,0,0,0.18)]
        "
      >
        <h3 className="text-[20px] font-bold">{item.name}</h3>

        <img
          src={cadivi}
          alt={item.name}
          className="
            w-full h-[250px] object-contain
            transition-transform duration-300
            group-hover:scale-[1.03]
          "
        />

        {/* NAME */}

        {/* DESCRIPTION */}
        <div className="flex flex-row justify-between items-center">
          <p className=" text-[13px] max-w-[260px] text-textsec line-clamp-2">
            {item.description || "Thiết bị điện phục vụ giảng dạy"}
          </p>

          <div className="px-[25px] py-[10px] bg-highlightcl rounded-[48px]">
            {item.quantity} {item.unit}
          </div>
        </div>

        {/* OVERLAY TEXT – chỉ hiện khi hover */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            flex items-center justify-center
            text-white text-[15px] font-medium
            bg-black/40
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
