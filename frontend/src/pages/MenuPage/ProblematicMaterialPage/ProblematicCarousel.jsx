import { useEffect, useRef, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProblematicCard from "./ProblematicCard";

const ProblematicCarousel = () => {
  const [data, setData] = useState([]);
  const [atStart, setAtStart] = useState(true);
  const scrollRef = useRef(null);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    axiosClient.get("/material-problem").then((res) => {
      if (res.data?.success) {
        setData(res.data.data || []);
      }
    });
  }, []);

  /* =========================
     SCROLL
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
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    await axiosClient.delete(`/material-problem/${id}`);
    setData((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div className="relative overflow-hidden">
      {/* LEFT */}
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

      {/* RIGHT */}
      {data.length > 0 && (
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

      {/* LIST */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex gap-8 overflow-x-auto py-[25px]
          scrollbar-none
          pl-[var(--page-x)]
        "
      >
        {data.length === 0 ? (
          <p className="text-[var(--text-quaternary)] text-lg">
            Không có vật tư hỏng
          </p>
        ) : (
          data.map((item) => (
            <div key={item._id} className="shrink-0">
              <ProblematicCard item={item} onDelete={handleDelete} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblematicCarousel;
