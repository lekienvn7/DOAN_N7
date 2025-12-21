import React from "react";

const QuickSectionNav = ({ sections }) => {
  return (
    <div className="sticky top-[56px] z-40 bg-bgmain/80 backdrop-blur border-b border-white/10">
      <div className="flex gap-[28px] px-[120px] py-[12px] text-[14px]">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              s.ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="relative text-gray-400 hover:text-white transition
              after:absolute after:left-0 after:-bottom-1 after:h-[2px]
              after:w-0 after:bg-white hover:after:w-full after:transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSectionNav;
