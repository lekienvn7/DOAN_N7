import { useEffect, useRef, useState, useMemo } from "react";
import axiosClient from "@/api/axiosClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChemicalCard from "./ChemicalCard";

const ChemicalCarousel = ({ reload, searchData }) => {
  const [data, setData] = useState([]);
  const [atStart, setAtStart] = useState(true);
  const scrollRef = useRef(null);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      axiosClient.get("/repository/material/chemical").then((res) => {
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
      {!atStart && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10
                     w-12 h-12 rounded-full bg-textsec text-textpri shadow-lg"
        >
          <ChevronLeft />
        </button>
      )}

      {filteredData.length > 0 && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10
                     w-12 h-12 rounded-full bg-textsec text-textpri shadow-lg"
        >
          <ChevronRight />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`
          flex gap-8 overflow-x-auto py-[25px]
          scrollbar-thin scrollbar-thumb-[#c7a7ff]/50 hover:scrollbar-thumb-[#e8d6ff]/60
          transition-[padding] duration-300
          ${atStart ? "pl-[var(--page-x)]" : "pl-0"}
        `}
      >
        {filteredData.length === 0 ? (
          <p className="text-[#a1a1a6] text-lg">
            Không tìm thấy hóa chất phù hợp!
          </p>
        ) : (
          filteredData.map((item) => (
            <div key={item._id} className="shrink-0">
              <ChemicalCard item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChemicalCarousel;
