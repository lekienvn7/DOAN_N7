import { useEffect, useState } from "react";

const AnimatedStat = ({
  value = 0,
  color = "var(--text-primary)",
  duration = 800,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = null;
    let rafId;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const elapsed = time - startTime;
      const p = Math.min(elapsed / duration, 1);

      setProgress(p);

      if (p < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  const percent = Math.round(progress * 100);
  const count = Math.round(progress * value);

  return (
    <div className="flex flex-col items-end gap-[6px] min-w-[120px]">
      {/* ===== SỐ ===== */}
      <span
        className="
          text-[15px]
          font-semibold
          tracking-[-0.01em]
        "
        style={{ color }}
      >
        {count}
      </span>

      {/* ===== PROGRESS BAR ===== */}
      <div
        className="
          w-full
          h-[6px]
          rounded-full
          overflow-hidden
        "
        style={{
          backgroundColor: "var(--border-light)",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            transition: "width 0.15s ease-out",
          }}
        />
      </div>

      {/* ===== % ===== */}
      <span
        className="
          text-[12px]
          font-medium
          tracking-[-0.01em]
        "
        style={{ color: "var(--text-secondary)" }}
      >
        {percent}%
      </span>
    </div>
  );
};

export default AnimatedStat;
