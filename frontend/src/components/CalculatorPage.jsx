import React, { useState } from "react";
import axiosClient from "@/api/axiosClient";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  ".",
  "0",
  "+",
  "=",
];

const CalculatorPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const highlight = ["/", "+", "-", "*", "="];

  /* ================= HANDLE CLICK ================= */
  const handleClick = async (value) => {
    if (value === "=") {
      if (!input) return;

      try {
        const url = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(
          input
        )}`;

        const res = await axiosClient.get(url, {
          responseType: "text",
        });

        setResult(res.data);
      } catch (err) {
        console.error(err);
        setResult("Lỗi");
      }
      return;
    }

    setInput((prev) => prev + value);
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[320px]">
        {/* ===== DISPLAY ===== */}
        <div className="bg-gray-100 rounded-lg p-3 mb-4 text-right">
          <div className="text-gray-500 text-sm min-h-[20px]">
            {input || "0"}
          </div>
          <div className="text-2xl font-bold min-h-[32px]">{result}</div>
        </div>

        {/* ===== BUTTONS ===== */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`
                w-14 h-14 rounded-full font-semibold
                ${
                  highlight.includes(btn)
                    ? "bg-[#f78f1a] text-[var(--text-primary)]"
                    : ""
                }
             
                ${
                  !highlight.includes(btn)
                    ? "bg-gray-200 hover:bg-gray-300"
                    : ""
                }
              `}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
