import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";

export function CofreVirtual({ onClose, xp }: { onClose: () => void; xp: number }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 300);
    const t2 = setTimeout(() => setPhase("open"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#111", border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: 4, padding: "48px 56px", textAlign: "center",
          maxWidth: 380, width: "90%",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.06)",
        }}
      >
        {/* Cofre animado */}
        <div style={{ position: "relative", marginBottom: 24, display: "inline-block" }}>
          <AnimatePresence mode="wait">
            {phase === "closed" && (
              <motion.div key="closed" exit={{ opacity: 0, scale: 1.2 }} style={{ fontSize: 64 }}>🎁</motion.div>
            )}
            {phase === "opening" && (
              <motion.div
                key="opening"
                animate={{ rotate: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: 64 }}
              >🎁</motion.div>
            )}
            {phase === "open" && (
              <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: 64 }}>
                🏆
              </motion.div>
            )}
          </AnimatePresence>

          {/* Partículas */}
          {phase === "open" && (
            <>
              {["⭐", "✨", "🌟", "💫", "⭐"].map((star, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    x: [0, (i - 2) * 40],
                    y: [0, -50 - i * 10],
                  }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ position: "absolute", top: "50%", left: "50%", fontSize: 16, pointerEvents: "none" }}
                >
                  {star}
                </motion.div>
              ))}
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: phase === "open" ? 1 : 0, y: phase === "open" ? 0 : 12 }}
          transition={{ duration: 0.4 }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: 26,
            color: WHITE_WARM, margin: "0 0 8px", fontWeight: 400,
          }}>
            ¡Semana completada!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "Inter,sans-serif", margin: "0 0 24px", lineHeight: 1.6 }}>
            Terminaste los 5 ejercicios de esta semana.<br />La disciplina tiene recompensa.
          </p>

          <div style={{
            background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: 3, padding: "14px 20px", marginBottom: 24,
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: GOLD }}>+{xp} XP</div>
              <div style={{ fontSize: 11, color: "rgba(201,168,76,0.5)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Puntos ganados</div>
            </div>
          </div>

          <motion.button
            whileHover={{ background: "rgba(201,168,76,0.85)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              width: "100%", height: 46, borderRadius: 2,
              background: GOLD, color: "#080808",
              fontSize: 13, fontWeight: 700, border: "none",
              cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase",
              fontFamily: "Inter,sans-serif",
            }}
          >
            Seguir practicando
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
