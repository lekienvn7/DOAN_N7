import { useEffect, useRef, useState, useMemo } from "react";
import axiosClient from "@/api/axiosClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TechnologyCard from "./TechnologyCard";

const TechnologyCarousel = ({ reload, searchData }) => {
  const [data, setData] = useState([]);
  const [atStart, setAtStart] = useState(true);
  const scrollRef = useRef(null);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      axiosClient.get("/repository/material/technology").then((res) => {
        if (res.data?.success) {
          setData(res.data.materials || []);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [reload]);

  /* =========================
     FILTER DATA (SEARCH)
  ========================= */
  const filteredData = useMemo(() => {
    if (!searchData?.trim()) return data;
    const keyword = searchData.toLowerCase();
    return data.filter((item) => item.name?.toLowerCase().includes(keyword));
  }, [data, searchData]);

  /* =========================
     SCROLL HANDLERS
  ========================= */
  const handleScroll = () => {
    if (!scrollRef.current) return;
    setAtStart(scrollRef.current.scrollLeft <= 2);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left:
        dir === "left" ? -window.innerWidth * 0.85 : window.innerWidth * 0.85,
      behavior: "smooth",
    });
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="relative overflow-hidden">
      {/* LEFT BUTTON */}
      {!atStart && (
        <button
          onClick={() => scroll("left")}
          className="
            absolute left-6 top-1/2 -translate-y-1/2 z-10
            w-12 h-12 rounded-full
            bg-[var(--bg-subtle)]
            text-[var(--text-secondary)]
            border border-[var(--border-light)]
            shadow-[var(--shadow-sm)]
            hover:bg-[var(--bg-hover)]
            transition
          "
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* RIGHT BUTTON */}
      {filteredData.length > 0 && (
        <button
          onClick={() => scroll("right")}
          className="
            absolute right-6 top-1/2 -translate-y-1/2 z-10
            w-12 h-12 rounded-full
            bg-[var(--bg-subtle)]
            text-[var(--text-secondary)]
            border border-[var(--border-light)]
            shadow-[var(--shadow-sm)]
            hover:bg-[var(--bg-hover)]
            transition
          "
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* SCROLL AREA */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`
          flex gap-8 overflow-x-auto py-[25px]
          scrollbar-none
          transition-[padding] duration-300
          ${atStart ? "pl-[var(--page-x)]" : "pl-0"}
        `}
      >
        {filteredData.length === 0 ? (
          <p className="text-[var(--text-quaternary)] text-lg">
            Không tìm thấy vật tư phù hợp
          </p>
        ) : (
          filteredData.map((item) => (
            <div key={item._id} className="shrink-0">
              <TechnologyCard item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnologyCarousel;
