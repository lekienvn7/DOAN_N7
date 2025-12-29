import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import cadivi from "@/assets/images/cadivi225.png";

const ChemicalDetail = ({ item, open, onClose }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
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

            {/* SAFETY NOTE */}
            {item.safetyNote && (
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                <span className="text-[#c7a7ff] font-medium">
                  Hướng dẫn an toàn:
                </span>{" "}
                {item.safetyNote}
              </p>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col flex-1">
            {/* TITLE */}
            <h1 className="text-[36px] font-semibold leading-tight">
              {item.name}
            </h1>

            {/* META */}
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
              {item.materialID} • {item.quantity} {item.unit}
              {item.expiryDate ? ` • HSD: ${item.expiryDate}` : ""}
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
              {/* ===== NGUỒN GỐC ===== */}
              <Spec label="Thêm bởi" value={item.createdBy?.fullName} />
              <Spec label="Email" value={item.createdBy?.email} />

              {/* ===== HÓA HỌC ===== */}
              <Spec label="Công thức hóa học" value={item.chemicalFormula} />
              <Spec
                label="Nồng độ"
                value={item.concentration && `${item.concentration}%`}
              />
              <Spec label="Độ pH" value={item.phLevel} />
              <Spec label="Số CAS" value={item.casNumber} />

              <Spec
                label="Điểm sôi"
                value={item.boilingPoint && `${item.boilingPoint} °C`}
              />
              <Spec
                label="Điểm nóng chảy"
                value={item.meltingPoint && `${item.meltingPoint} °C`}
              />
              <Spec
                label="Khối lượng mol"
                value={item.molarMass && `${item.molarMass} g/mol`}
              />

              {/* ===== AN TOÀN ===== */}
              <Spec label="Nhiệt độ bảo quản" value={item.storageTemperature} />
              <Spec label="Mức độ nguy hiểm" value={item.hazardLevel} />
              <Spec label="Tính dễ cháy" value={item.flammability} />
              <Spec label="Độc tính" value={item.toxicity} />
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
    <span className="text-[#c7a7ff]">{label}</span>
    <span className="text-right text-[var(--text-primary)]">
      {value || "—"}
    </span>
  </div>
);

export default ChemicalDetail;
