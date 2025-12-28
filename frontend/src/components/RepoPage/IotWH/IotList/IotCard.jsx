import { useState } from "react";
import IotDetail from "./IotDetail";
import cadivi from "@/assets/images/cadivi225.png";

const IotCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group relative flex flex-col justify-between min-w-[450px] min-h-[500px] bg-[var(--bg-panel)] rounded-[24px] p-8 cursor-pointer hover:scale-[1.02] transition"
      >
        <h3 className="text-[20px] font-semibold">{item.name}</h3>

        <img
          src={cadivi}
          alt={item.name}
          className="w-full h-[250px] object-contain group-hover:scale-[1.03] transition"
        />

        <div className="flex justify-between items-center">
          <p className="text-[13px] text-[var(--text-tertiary)] line-clamp-2">
            {item.description || "Thiết bị nhúng & IoT"}
          </p>
          <div className="px-[25px] py-[10px] bg-[var(--bg-subtle)] rounded-[48px] text-[13px]">
            {item.quantity} {item.unit}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition rounded-[24px]">
          Ấn để xem chi tiết
        </div>
      </div>

      <IotDetail open={open} item={item} onClose={() => setOpen(false)} />
    </>
  );
};

export default IotCard;
