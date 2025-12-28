import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";

import { useAuth } from "@/context/authContext";
import FashionEdit from "@/components/RepoPage/FashionWH/FashionEdit";
import cadivi from "@/assets/images/cadivi225.png";

const FashionDetail = ({ item, open, onClose, onReload }) => {
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
    } catch {
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
        className="rounded-[24px] p-0 !max-w-none w-[900px] max-h-[90vh]"
        style={{
          background: "var(--bg-panel)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div className="flex gap-[48px] p-[40px]">
          {/* ================= LEFT ================= */}
          <div className="flex-shrink-0 flex flex-col gap-4">
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

            {canManage && (
              <div className="flex items-center justify-between gap-3 px-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={borrowType === "approval"}
                    onChange={(e) =>
                      setBorrowType(e.target.checked ? "approval" : "free")
                    }
                    style={{ accentColor: "#f472b6" }}
                  />
                  <span>Cần duyệt khi mượn</span>
                </label>

                <FashionEdit item={item} onReload={onReload} />
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col flex-1">
            <h1 className="text-[36px] font-semibold">{item.name}</h1>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {item.materialID} • {item.quantity} {item.unit}
              {item.maintenanceCycle ? ` • ${item.maintenanceCycle} tháng` : ""}
            </p>

            <div className="my-6 h-px bg-[var(--border-light)]" />

            {/* ================= SPECS ================= */}
            <div className="max-h-[260px] overflow-y-auto pr-4 space-y-3">
              <Spec label="Thêm bởi" value={item.createdBy?.fullName} />
              <Spec label="Email" value={item.createdBy?.email} />

              <Spec label="Loại vải" value={item.fabricType} />
              <Spec label="Màu sắc" value={item.color} />
              <Spec label="Kích cỡ" value={item.size} />
              <Spec label="Họa tiết" value={item.pattern} />
              <Spec label="Độ co giãn" value={item.elasticity} />
              <Spec label="Xuất xứ" value={item.origin} />
              <Spec label="Hướng dẫn giặt" value={item.washInstruction} />
              <Spec label="Độ bền" value={item.durability} />
              <Spec label="Độ thoáng khí" value={item.breathability} />
              <Spec label="Độ dày vải" value={item.fabricThickness} />
              <Spec label="Giữ màu" value={item.colorfastness} />
              <Spec label="Chống nhăn" value={item.wrinkleResistance} />
              <Spec label="Tốc độ khâu (SPM)" value={item.SPM} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ================= SPEC ROW ================= */
const Spec = ({ label, value }) => (
  <div className="flex justify-between gap-6 text-sm">
    <span className="text-[#f472b6]">{label}</span>
    <span className="text-right">{value || "—"}</span>
  </div>
);

export default FashionDetail;
