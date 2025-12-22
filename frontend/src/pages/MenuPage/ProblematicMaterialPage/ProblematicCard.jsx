import { Trash2 } from "lucide-react";

const ProblematicCard = ({ item, onDelete }) => {
  return (
    <div
      className="
        group relative flex flex-col justify-between
        min-w-[420px]
        min-h-[260px]
        bg-[var(--bg-panel)]
        text-[var(--text-primary)]
        border border-[var(--border-light)]
        rounded-[24px] p-6
        cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.02]
        hover:shadow-[var(--shadow-md)]
      "
    >
      {/* TITLE */}
      <h3 className="text-[18px] font-semibold ">{item.material.name}</h3>

      {/* INFO */}
      <div className="mt-4 space-y-2 text-sm text-[var(--text-tertiary)]">
        <p>
          Số lượng hỏng:{" "}
          <span className="text-highlightcl font-medium">
            {item.quantity} {item.material.unit}
          </span>
        </p>

        <p className="">Lý do: {item.reason || "Hỏng khi mượn"}</p>
      </div>

      {/* ACTION */}
      <button
        onClick={() => onDelete(item._id)}
        className="
          mt-6 inline-flex items-center justify-center gap-2
          px-4 py-2
          rounded-[12px]
          border border-[#424245]
          text-[var(--text-secondary)]
          hover:bg-[#424245]
          hover:text-textpri
          transition
        "
      >
        <Trash2 size={16} />
        Tiêu hủy
      </button>

      {/* OVERLAY */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-[24px]
          
          transition-opacity
        "
      />
    </div>
  );
};

export default ProblematicCard;
