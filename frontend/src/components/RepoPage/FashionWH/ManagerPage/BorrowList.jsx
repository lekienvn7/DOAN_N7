import axiosClient from "@/api/axiosClient";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

window.socket = io("http://localhost:5001");

const BorrowList = ({ repositoryId, onBellChange = () => {}, reload }) => {
  const [request, setRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/borrow-requests/pending");
      const filtered = (res.data || []).filter(
        (r) => r.repository === repositoryId
      );

      setRequest(filtered);
      onBellChange(filtered.length);
    } catch {
      toast.error("Lỗi tải phiếu mượn!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    loadData();

    window.socket.on("new-borrow-request", () => {
      loadData();
      toast.info("Có phiếu mượn mới!");
    });

    return () => window.socket.off("new-borrow-request");
  }, [reload]);

  /* ================= SCROLL ================= */
  const handleScroll = () => {
    if (!scrollRef.current) return;
    setAtStart(scrollRef.current.scrollLeft <= 2);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -window.innerWidth * 0.6 : window.innerWidth * 0.6,
      behavior: "smooth",
    });
  };

  /* ================= ACTIONS ================= */
  const handleApprove = async (id) => {
    try {
      await axiosClient.patch("/borrow-requests/approve", {
        id,
        managerId: user.userID,
        repoID: repositoryId,
      });

      setRequest((prev) => {
        const updated = prev.filter((r) => r._id !== id);
        onBellChange(updated.length);
        return updated;
      });

      toast.success("Duyệt phiếu thành công!");
    } catch {
      toast.error("Lỗi duyệt phiếu!");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosClient.patch("/borrow-requests/reject", {
        id,
        managerId: user.userID,
        repoID: repositoryId,
      });

      setRequest((prev) => {
        const updated = prev.filter((r) => r._id !== id);
        onBellChange(updated.length);
        return updated;
      });

      toast.success("Đã từ chối!");
    } catch {
      toast.error("Lỗi từ chối phiếu!");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="relative">
      <p className="text-[35px] font-bold font-googleSans text-[var(--text-tertiary)] mb-[50px]">
        <span className="gradient-text">Phiếu mượn</span> cần duyệt
      </p>

      {/* SCROLL BUTTON LEFT */}
      {!atStart && (
        <button
          onClick={() => scroll("left")}
          className="
            absolute left-4 top-1/2 -translate-y-1/2 z-10
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

      {/* SCROLL BUTTON RIGHT */}
      {request.length > 0 && (
        <button
          onClick={() => scroll("right")}
          className="
            absolute right-4 top-1/2 -translate-y-1/2 z-10
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

      {/* CARD LIST */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex gap-6 overflow-x-auto pb-[10px]
          scrollbar-none
        "
      >
        {request.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="
              group relative flex flex-col justify-between
          min-w-[450px] max-w-[320px]
          min-h-[500px]
          bg-[var(--bg-panel)]
          text-[var(--text-primary)]
          border border-[var(--border-light)]
          rounded-[24px] p-8
          cursor-pointer
          transition-all duration-300 ease-out
          hover:scale-[1.02]
            "
          >
            {/* HEADER */}
            <p className="text-[var(--text-primary)] font-bold text-[20px]">
              Phiếu BR-{(item._id.slice(-5)).toUpperCase()}
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--accent-blue)] font-semibold">
                GV:
              </span>{" "}
              {item.teacher?.fullName}
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--accent-blue)] font-semibold">
                Ghi chú:
              </span>{" "}
              {item.note ? item.note : "Mượn vật tư"}
            </p>

            {/* ITEMS – SCROLL */}
            <div
              className="
                mt-3 flex-1 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa93e]/50 hover:scrollbar-thumb-[#f9d65c]/60
              "
            >
              {item.items.map((it, i) => (
                <div
                  key={i}
                  className="
                    flex justify-between 
                    bg-[var(--bg-subtle)]
                    border border-[var(--border-light)]
                    p-2 rounded-[12px]
                    text-sm
                  "
                >
                  <span className="truncate text-[var(--text-secondary)]">
                    {it.material?.name}
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    x{it.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleApprove(item._id)}
                className="
                  flex-1
                  
                  rounded-[12px] py-2
                  border border-[var(--success)]
                  text-[var(--success)]
                  hover:bg-[var(--success)]
                  hover:text-textpri
                  transition
                "
              >
                Duyệt
              </button>
              <button
                onClick={() => handleReject(item._id)}
                className="
                  flex-1
                  rounded-[12px] py-2
                  border border-[var(--danger)]
                  text-[var(--danger)]
                  hover:bg-[var(--danger)]
                  hover:text-textpri
                  transition
                "
              >
                Từ chối
              </button>
            </div>
          </motion.div>
        ))}

        {request.length === 0 && (
          <div
            className="
              shrink-0 w-[360px] h-[200px]
              flex items-center justify-center
              text-[var(--text-quaternary)]
              bg-[var(--bg-subtle)]
              rounded-xl
              border border-[var(--border-light)]
            "
          >
            Không có phiếu nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowList;
