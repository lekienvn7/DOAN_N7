import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ColorField({ label, name, setName, value, setValue }) {
  const [open, setOpen] = useState(false);

  const handleInput = (e) => {
    const value = e.target.value;

    // Validate HEX
    if (/^#([0-9A-F]{0,6})$/i.test(value)) {
      setValue(value);
    }
  };

  return (
    <div className="flex flex-col gap-[5px] relative">
      <div className="flex flex-col items-left gap-[5px]">
        {/* Ô preview màu */}
        <div className="flex flex-row gap-[10px] items-center">
          <p className="ml-[10px]">Màu sắc</p>
          <button
            onClick={() => setOpen(!open)}
            style={{ backgroundColor: value }}
            className="w-[50px] h-[20px] rounded-md border border-gray-600 cursor-pointer"
          ></button>
        </div>
        {/* Tên màu */}
        <input
          type="text"
          placeholder="VD: Xanh navy, hồng pastel..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[200px] px-[10px] py-[5px] bg-[#2c2c2e] text-pri border-[2px] border-[#3F3F46] rounded-[12px]
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   placeholder:text-gray-400 transition-all duration-200"
        />
      </div>

      {/* Popup chọn màu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-[30px] left-[150px] z-50 p-3 bg-[#111] border border-gray-700 rounded-xl shadow-xl"
          >
            <HexColorPicker color={value} onChange={setValue} />
            <input
              className="mt-2 px-3 py-2 bg-[#111] border border-gray-600 rounded-lg text-white outline-none"
              type="text"
              value={value}
              onChange={handleInput}
              maxLength={7}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
