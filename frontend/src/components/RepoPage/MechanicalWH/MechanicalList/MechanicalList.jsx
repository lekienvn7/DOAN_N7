import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import MechanicalCarousel from "./MechanicalCarousel";

const STORAGE_KEY = "mechanical_search_history";

const MechanicalList = ({ reload }) => {
  const [searchData, setSearchData] = useState("");
  const [history, setHistory] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const boxRef = useRef(null);

  /* =========================
     LOAD HISTORY
  ========================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setHistory(saved);
  }, []);

  /* =========================
     SAVE HISTORY
  ========================= */
  const saveHistory = (value) => {
    if (!value.trim()) return;

    const newHistory = [value, ...history.filter((h) => h !== value)].slice(
      0,
      6
    );

    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  /* =========================
     CLEAR HISTORY
  ========================= */
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* =========================
     CLICK OUTSIDE
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpenHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section>
      {/* TITLE + SEARCH */}
      <section
        className="flex justify-between items-center"
        style={{ paddingInline: "var(--page-x)" }}
      >
        <h2 className="text-[35px] font-bold font-googleSans text-[var(--text-tertiary)]">
          <span className="gradient-text">Danh sách</span> vật tư
        </h2>

        {/* SEARCH */}
        <div ref={boxRef} className="relative w-[320px]">
          <div
            className="
              flex items-center gap-3
              bg-[var(--bg-subtle)]
              px-5 py-3
              rounded-full
              border border-[var(--border-light)]
              focus-within:border-[var(--accent-silver)]
              transition
            "
          >
            <input
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              onFocus={() => setOpenHistory(true)}
              onBlur={() => saveHistory(searchData)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveHistory(searchData);
                  setOpenHistory(false);
                  e.currentTarget.blur();
                }
              }}
              placeholder="Tìm bulong, trục, bánh răng…"
              className="
                bg-transparent outline-none w-full
                text-[15px]
                text-[var(--text-primary)]
                placeholder:text-[var(--text-tertiary)]
              "
            />
          </div>

          {/* HISTORY */}
          {openHistory && history.length > 0 && (
            <div
              className="
                absolute top-[56px] w-full z-20
                bg-[var(--bg-panel)]
                rounded-[20px]
                p-3
                border border-[var(--border-light)]
                shadow-[0_12px_32px_rgba(0,0,0,0.08)]
              "
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs text-[var(--text-tertiary)]">
                  Lịch sử tìm kiếm
                </span>
                <button
                  onClick={clearHistory}
                  className="
                    text-xs
                    text-[var(--accent-silver)]
                    hover:underline
                  "
                >
                  Xóa
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => {
                      setSearchData(item);
                      setOpenHistory(false);
                    }}
                    className="
                      text-left px-3 py-2 rounded-[12px]
                      text-[14px]
                      text-[var(--text-primary)]
                      hover:bg-[var(--bg-hover)]
                      transition
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LIST */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <MechanicalCarousel reload={reload} searchData={searchData} />
      </motion.div>
    </section>
  );
};

export default MechanicalList;
