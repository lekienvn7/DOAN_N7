import { useEffect, useState } from "react";

const AnimatedStat = ({ value = 0, color = "#fb923c", duration = 800 }) => {
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
      {/* số chạy */}
      <span className="font-semibold" style={{ color }}>
        {count}
      </span>

      {/* progress bar */}
      <div className="w-full h-[6px] bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* % */}
      <span className="text-[11px] text-gray-400">{percent}%</span>
    </div>
  );
};

export default AnimatedStat;
