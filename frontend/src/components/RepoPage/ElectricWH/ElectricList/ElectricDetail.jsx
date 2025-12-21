import React from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import cadivi from "@/assets/images/cadivi225.png";

const ElectricDetail = ({ item, open, onClose }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          bg-[#0f0f10] text-white border-none rounded-[24px] p-0 !max-w-none
    w-[900px] max-w-none
    max-h-[90vh] overflow-hidden
        "
      >
        <div className="flex gap-[48px] p-[40px]">
          {/* LEFT – IMAGE */}
          <div className="flex-shrink-0">
            <div className="w-[360px] h-[360px] rounded-[20px] flex items-center justify-center">
              <img
                src={cadivi}
                alt={item.name}
                className="w-[85%] h-[85%] object-contain"
              />
            </div>
          </div>

          {/* RIGHT – INFO */}
          <div className="flex flex-col flex-1">
            {/* TITLE */}
            <h1 className="text-[36px] font-semibold leading-tight">
              {item.name}
            </h1>

            {/* META */}
            <p className="mt-2 text-[#a1a1a6] text-[15px]">
              {item.materialID} • {item.quantity} {item.unit}
              {item.maintenanceCycle ? ` • ${item.maintenanceCycle} tháng` : ""}
            </p>

            {/* DIVIDER */}
            <div className="my-6 h-px bg-[#2c2c2e]" />

            {/* SCROLLABLE SPECS */}
            <div
              className="
                max-h-[260px]
                overflow-y-auto
                pr-4
                space-y-3
                scrollbar-thin
              "
            >
              <Spec label="Thêm bởi" value={item.createdBy?.fullName} />
              <Spec label="Email" value={item.createdBy?.email} />
              <Spec
                label="Cách điện"
                value={item.materialInsulation === "Cách điện" ? "Có" : "Không"}
              />
              <Spec
                label="Tần số"
                value={item.frequency && `${item.frequency} Hz`}
              />
              <Spec
                label="Điện trở"
                value={item.resistance && `${item.resistance} Ω`}
              />
              <Spec label="Loại pha" value={item.phaseType} />
              <Spec label="Vật liệu lõi" value={item.conductorMaterial} />
              <Spec label="Lớp bọc" value={item.insulationMaterial} />
              <Spec label="Chịu lửa" value={item.fireResistance} />
              <Spec
                label="Đường kính"
                value={item.cableDiameter && `${item.cableDiameter} mm²`}
              />
              <Spec label="Mức bảo vệ" value={item.waterproofLevel} />
              <Spec label="Nhiệt độ" value={item.operatingTemp} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* -------- SPEC ROW -------- */
const Spec = ({ label, value }) => (
  <div className="flex justify-between gap-6 text-[15px]">
    <span className="text-highlightcl">{label}</span>
    <span className="text-white text-right">{value || "—"}</span>
  </div>
);

export default ElectricDetail;
