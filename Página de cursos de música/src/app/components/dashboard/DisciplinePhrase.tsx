import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

// Frases rotativas semanales — los textos específicos se definen más adelante
const PHRASES = [
  { text: "La disciplina es el puente entre la meta y el logro.", author: "Jim Rohn" },
  { text: "No tienes que ser grande para empezar, pero tienes que empezar para ser grande.", author: "Zig Ziglar" },
  { text: "El músico que practica hoy es el músico que admiran mañana.", author: "Gmusic" },
  { text: "Cada acorde que tocas hoy es una versión mejor de ti mismo.", author: "Gmusic" },
  { text: "La constancia no es un talento. Es una decisión.", author: "Gmusic" },
];

export function DisciplinePhrase() {
  const [index, setIndex] = useState(() => {
    const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return week % PHRASES.length;
  });
  const [visible, setVisible] = useState(true);

  const cyclePhrase = () => {
    setVisible(false);
    setTimeout(() => {
      setIndex(i => (i + 1) % PHRASES.length);
      setVisible(true);
    }, 350);
  };

  const phrase = PHRASES[index];

  return (
    <div style={{
      background: "rgba(201,168,76,0.03)",
      border: "1px solid rgba(201,168,76,0.15)",
      borderRadius: 4, padding: "24px 28px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
      minHeight: 180,
    }}>
      {/* Decorative quote mark */}
      <div style={{
        position: "absolute", top: 12, right: 20,
        fontSize: 80, color: "rgba(201,168,76,0.06)",
        fontFamily: "'Playfair Display',serif", lineHeight: 1,
        pointerEvents: "none", userSelect: "none",
      }}>
        "
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 16, height: 1, background: GOLD, opacity: 0.5 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontFamily: "Inter,sans-serif" }}>
            Frase de la semana
          </span>
        </div>

        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <p style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(15px, 1.4vw, 18px)",
                fontWeight: 400, lineHeight: 1.55,
                color: WHITE_WARM, margin: "0 0 12px",
                letterSpacing: "-0.3px",
              }}>
                "{phrase.text}"
              </p>
              <span style={{ fontSize: 12, color: "rgba(201,168,76,0.5)", fontFamily: "Inter,sans-serif" }}>
                — {phrase.author}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={cyclePhrase}
        style={{
          marginTop: 20, background: "none", border: "none",
          color: "rgba(201,168,76,0.35)", cursor: "pointer",
          fontSize: 11, fontFamily: "Inter,sans-serif", letterSpacing: "1px",
          textTransform: "uppercase", textAlign: "left", padding: 0,
          display: "flex", alignItems: "center", gap: 6,
        }}
        onMouseEnter={e => e.currentTarget.style.color = GOLD}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(201,168,76,0.35)"}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
        Otra frase
      </button>
    </div>
  );
}
