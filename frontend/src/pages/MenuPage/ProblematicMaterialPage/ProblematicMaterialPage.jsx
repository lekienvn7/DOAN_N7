import { motion } from "framer-motion";
import ProblematicCarousel from "./ProblematicCarousel";
import gradient from "../../../assets/images/gradient.png";

export default function ProblematicMaterialPage() {
  return (
    <section>
      <section
        className="relative flex flex-col pt-[65px] pb-[44px] overflow-hidden page-ambient"
        style={{ paddingInline: "var(--page-x)" }}
      >
        {/* AMBIENT STRIP */}

        {/* CONTENT */}
        <h1 className="relative z-10 text-[74px] font-bold font-googleSans text-[var(--text-tertiary)]">
          <span className="gradient-text">Vật Tư</span> Bị Hỏng
        </h1>

        <p className="relative z-10 text-[22px] font-semibold text-[var(--text-primary)]">
          Danh sách vật tư bị hỏng trong quá trình mượn.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <ProblematicCarousel />
      </motion.div>
    </section>
  );
}
