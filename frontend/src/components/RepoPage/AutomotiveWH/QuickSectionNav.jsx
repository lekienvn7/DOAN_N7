import React from "react";

const QuickSectionNav = ({ sections }) => {
  return (
    <div
      className="
        sticky top-[56px] z-40
        bg-[var(--bg-page)]/80
        backdrop-blur-[18px]
      "
    >
      <div className="flex gap-[28px] px-[120px] py-[14px] text-[14px]">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              s.ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="
              relative
              font-medium
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              transition-colors duration-200

              after:absolute
              after:left-0
              after:-bottom-[7px]
              after:h-[2px]
              after:w-0
              after:rounded-full
              after:bg-[var(--accent-blue)]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSectionNav;
