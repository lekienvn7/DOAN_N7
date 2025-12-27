import { motion } from "framer-motion";
import ProblematicCarousel from "./ProblematicCarousel";
import gradient from "../../../assets/images/gradient.png";
import InfoPage from "@/pages/InfoPage";

export default function ProblematicMaterialPage() {
  const revealUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section>
      <div>
        <section
          className="relative flex flex-col pt-[65px] pb-[44px] overflow-hidden"
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProblematicCarousel />
        </motion.div>
      </div>

      <div>
        <section
          className="relative flex flex-col pt-[65px] pb-[44px] overflow-hidden"
          style={{ paddingInline: "var(--page-x)" }}
        >
          {/* AMBIENT STRIP */}

          {/* CONTENT */}
          <h1 className="relative z-10 text-[74px] font-bold font-googleSans text-[var(--text-tertiary)]">
            <span className="gradient-text">Vật Tư</span> Đến Hạn Thanh Lý
          </h1>

          <p className="relative z-10 text-[22px] font-semibold text-[var(--text-primary)]">
            Danh sách vật tư đến hạn cần thanh lý.
          </p>
        </section>

        <motion.div variants={revealUp} initial="hidden" whileInView="visible">
          <p className="ml-[120px] z-10 text-[22px] font-semibold text-[var(--text-tertiary)]">
            Không có vật tư cần thanh lý.
          </p>
        </motion.div>
      </div>

      <InfoPage />
    </section>
  );
}
