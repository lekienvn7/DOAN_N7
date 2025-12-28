import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";

import { useAuth } from "@/context/authContext";
import MechanicalEdit from "@/components/RepoPage/MechanicalWH/MechanicalEdit";
import cadivi from "@/assets/images/cadivi225.png";

const MechanicalDetail = ({ item, open, onClose, onReload }) => {
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
                    style={{ accentColor: "#e6eef2" }}
                  />
                  <span>Cần duyệt khi mượn</span>
                </label>

                <MechanicalEdit item={item} onReload={onReload} />
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

              <Spec label="Loại kim loại" value={item.metalType} />
              <Spec label="Độ cứng" value={item.hardness} />
              <Spec label="Độ bền kéo" value={item.tensileStrength} />
              <Spec label="Trọng lượng" value={item.weight} />
              <Spec label="Lớp phủ" value={item.coating} />
              <Spec label="Độ dày" value={item.thickness} />
              <Spec label="Kích thước" value={item.size} />
              <Spec label="Dung sai" value={item.tolerance} />
              <Spec label="Khả năng chịu tải" value={item.loadCapacity} />
              <Spec label="Chịu nhiệt" value={item.heatResistance} />
              <Spec label="Chống ăn mòn" value={item.corrosionResistance} />
              <Spec label="Độ nhẵn bề mặt" value={item.surfaceFinish} />
              <Spec label="Từ tính" value={item.magneticProperty} />
              <Spec label="Chịu va đập" value={item.impactResistance} />
              <Spec label="Độ dẻo" value={item.ductility} />
              <Spec label="Ghi chú" value={item.description} />
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
    <span className="text-[#e6eef2]">{label}</span>
    <span className="text-right">{value || "—"}</span>
  </div>
);

export default MechanicalDetail;
