import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ChemicalCarousel from "./ChemicalCarousel";

const STORAGE_KEY = "chemical_search_history";

const ChemicalList = ({ reload }) => {
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
      {/* ===== TITLE + SEARCH ===== */}
      <section
        className="flex justify-between items-center"
        style={{ paddingInline: "var(--page-x)" }}
      >
        <h2 className="text-[35px] font-semibold">Danh sách hóa chất</h2>

        {/* SEARCH */}
        <div ref={boxRef} className="relative w-[320px]">
          <div className="flex items-center gap-3 bg-[#1c1c1e] px-5 py-3 rounded-full">
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
              placeholder="Tìm hóa chất, dung môi, axit…"
              className="bg-transparent outline-none placeholder:text-textsec text-white w-full"
            />
          </div>

          {/* HISTORY */}
          {openHistory && history.length > 0 && (
            <div className="absolute top-[52px] w-full bg-[#1c1c1e] rounded-2xl p-3 shadow-xl z-20">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs text-[#a1a1a6]">
                  Lịch sử tìm kiếm
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-400 hover:text-red-300"
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
                    className="text-left px-3 py-2 rounded-lg text-sm text-textpri hover:bg-white/5"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== CAROUSEL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <ChemicalCarousel reload={reload} searchData={searchData} />
      </motion.div>
    </section>
  );
};

export default ChemicalList;
