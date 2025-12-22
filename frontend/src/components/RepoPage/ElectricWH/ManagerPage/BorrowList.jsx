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
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="relative">
      <p className="text-[30px] font-semibold text-textpri mb-[25px]">
        Phiếu mượn cần duyệt
      </p>

      {/* SCROLL BUTTON LEFT */}
      {!atStart && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                     w-12 h-12 rounded-full bg-textsec text-textpri shadow-lg"
        >
          <ChevronLeft />
        </button>
      )}

      {/* SCROLL BUTTON RIGHT */}
      {request.length > 0 && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                     w-12 h-12 rounded-full bg-textsec text-textpri shadow-lg"
        >
          <ChevronRight />
        </button>
      )}

      {/* CARD LIST */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex gap-6 overflow-x-auto pb-[10px]
          scrollbar-thin scrollbar-thumb-[#fdd700]/40
          hover:scrollbar-thumb-[#fdd700]
        "
      >
        {request.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="
              shrink-0 w-[360px] h-[420px]
              bg-[#2c2c2e] rounded-xl p-4
              border border-[#3f3f46]
              flex flex-col
            "
          >
            {/* HEADER */}
            <p className="text-yellow-400 font-bold">
              Phiếu #{item._id.slice(-5)}
            </p>

            <p className="mt-2 text-sm">
              <span className="text-yellow-400">GV:</span>{" "}
              {item.teacher?.fullName}
            </p>

            {/* ITEMS – SCROLL */}
            <div
              className="
                mt-3 flex-1 space-y-2 overflow-y-auto pr-1
                scrollbar-thin scrollbar-thumb-[#fdd700]/30
                hover:scrollbar-thumb-[#fdd700]/60
              "
            >
              {item.items.map((it, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-[#1f1f1f] p-2 rounded"
                >
                  <span className="truncate">{it.material?.name}</span>
                  <span className="text-yellow-400">x{it.quantity}</span>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleApprove(item._id)}
                className="flex-1 bg-green-600 rounded py-2 hover:bg-green-500 transition"
              >
                Duyệt
              </button>
              <button
                onClick={() => handleReject(item._id)}
                className="flex-1 bg-red-600 rounded py-2 hover:bg-red-500 transition"
              >
                Từ chối
              </button>
            </div>
          </motion.div>
        ))}

        {request.length === 0 && (
          <div className="shrink-0 w-[360px] h-[200px] flex items-center justify-center text-gray-400 bg-[#2c2c2e] rounded-xl border border-[#3f3f46]">
            Không có phiếu nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowList;
