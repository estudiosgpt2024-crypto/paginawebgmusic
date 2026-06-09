import { motion } from "motion/react";
import { InteractiveLevelSelector } from "../../music/InteractiveLevelSelector";
import { GOLD, WHITE_WARM, TEXT_SEC, fadeUp, vp } from "../tokens";

interface AcademiaSectionProps {
  setPage: (page: string) => void;
  setLevel: (level: string) => void;
}

export function AcademiaSection({ setPage, setLevel }: AcademiaSectionProps) {
  return (
    <section id="academia" style={{
      position: "relative", background: "#0D0D0D",
      padding: "120px 0", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 800, height: 600,
        background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 80px", position: "relative", zIndex: 2 }}>
        <motion.div initial="hidden" whileInView="show" viewport={vp}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.span variants={fadeUp} transition={{ duration: 0.5 }} style={{
            display: "inline-block", fontSize: 11, fontWeight: 500,
            letterSpacing: "3px", textTransform: "uppercase",
            color: GOLD, fontFamily: "Inter, sans-serif",
          }}>
            El programa
          </motion.span>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.6, delay: 0.05 }} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 400, letterSpacing: "-1.5px",
            lineHeight: 1.15, color: WHITE_WARM, margin: "16px 0 0",
          }}>
            Elige tu punto de partida.
          </motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.5, delay: 0.12 }} style={{
            color: TEXT_SEC, fontSize: 17, lineHeight: 1.7,
            maxWidth: 520, marginTop: 20, fontFamily: "Inter, sans-serif",
          }}>
            Cada etapa tiene su propio recorrido. Empieza donde estás.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={vp} transition={{ duration: 0.7, delay: 0.15 }}
          style={{ marginTop: 56 }}
        >
          <InteractiveLevelSelector setPage={setPage} setLevel={setLevel} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={vp} transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)",
            fontFamily: "Inter, sans-serif", letterSpacing: "0.3px",
          }}
        >
          Elige tu punto de partida dentro de la academia y comienza con la clase
          gratuita de Fundamento.
        </motion.p>
      </div>
    </section>
  );
}
