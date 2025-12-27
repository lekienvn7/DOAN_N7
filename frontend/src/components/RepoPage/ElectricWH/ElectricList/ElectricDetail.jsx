import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";

import { useAuth } from "@/context/authContext";
import ElectricEdit from "@/components/RepoPage/ElectricWH/ElectricEdit";
import cadivi from "@/assets/images/cadivi225.png";

const ElectricDetail = ({ item, open, onClose, onReload }) => {
  if (!item) return null;

  const { user } = useAuth();

  /* =========================
     CHECK PERMISSION
  ========================= */
  const canManage =
    user?.roleID === "ADMINISTRATOR" || user?.roleID === "WH MANAGER";

  /* =========================
     BORROW TYPE
  ========================= */
  const [borrowType, setBorrowType] = useState("free");

  useEffect(() => {
    setBorrowType(item.borrowType || "free");
  }, [item]);

  const updateBorrowType = async () => {
    if (!canManage) return;

    try {
      await axiosClient.put(`/material/${item.materialID}`, {
        borrowType,
      });
    } catch (err) {
      toast.error("Không thể cập nhật loại mượn!");
    }
  };

  const handleClose = (val) => {
    if (!val && canManage) updateBorrowType();
    onClose(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          rounded-[24px] p-0 !max-w-none
          w-[900px] max-h-[90vh] overflow-hidden
        "
        style={{
          background: "var(--bg-panel)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div className="flex gap-[48px] p-[40px]">
          {/* ================= LEFT ================= */}
          <div className="flex-shrink-0 flex flex-col gap-4">
            {/* IMAGE */}
            <div
              className="w-[360px] h-[360px] rounded-[20px] flex items-center justify-center"
              style={{ background: "var(--bg-subtle)" }}
            >
              <img
                src={cadivi}
                alt={item.name}
                className="w-[85%] h-[85%] object-contain"
              />
            </div>

            {/* ACTIONS BELOW IMAGE */}
            {canManage && (
              <div className="flex items-center justify-between gap-3 px-2">
                {/* CHECKBOX */}
                <label
                  className="flex items-center gap-2 text-[14px] cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <input
                    type="checkbox"
                    checked={borrowType === "approval"}
                    onChange={(e) =>
                      setBorrowType(e.target.checked ? "approval" : "free")
                    }
                    className="w-4 h-4"
                    style={{ accentColor: "var(--accent-blue)" }}
                  />
                  <span>Cần duyệt khi mượn</span>
                </label>

                {/* EDIT */}
                <ElectricEdit item={item} onReload={onReload} />
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col flex-1">
            {/* TITLE */}
            <h1
              className="text-[36px] font-semibold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {item.name}
            </h1>

            {/* META */}
            <p
              className="mt-2 text-[15px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.materialID} • {item.quantity} {item.unit}
              {item.maintenanceCycle ? ` • ${item.maintenanceCycle} tháng` : ""}
            </p>

            {/* DIVIDER */}
            <div
              className="my-6 h-px"
              style={{ background: "var(--border-light)" }}
            />

            {/* SCROLLABLE SPECS */}
            <div
              className="
                max-h-[260px]
                overflow-y-auto
                pr-4
                space-y-3
                scrollbar-thin
              "
              style={{
                scrollbarColor: "var(--border-strong) transparent",
              }}
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

/* ================= SPEC ROW ================= */
const Spec = ({ label, value }) => (
  <div className="flex justify-between gap-6 text-[15px]">
    <span style={{ color: "var(--accent-blue)" }}>{label}</span>
    <span className="text-right" style={{ color: "var(--text-primary)" }}>
      {value || "—"}
    </span>
  </div>
);

export default ElectricDetail;
