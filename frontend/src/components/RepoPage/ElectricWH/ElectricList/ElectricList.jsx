import ElectricCarousel from "./ElectricCarousel";
import { motion } from "framer-motion";

const ElectricList = ({ reload, searchData }) => {
  return (
    <section>
      <section style={{ paddingInline: "var(--page-x)" }}>
        <h2 className="text-[35px] font-semibold">Danh sách vật tư</h2>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <ElectricCarousel reload={reload} searchData={searchData} />
      </motion.div>
    </section>
  );
};

export default ElectricList;
