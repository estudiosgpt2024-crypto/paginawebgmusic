import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ex1Cuerdas } from "./exercises/Ex1Cuerdas";
import { Ex2NotasAm } from "./exercises/Ex2NotasAm";
import { Ex3NotasEm } from "./exercises/Ex3NotasEm";
import { Ex4CalidadAcorde } from "./exercises/Ex4CalidadAcorde";
import { Ex5Secuencia } from "./exercises/Ex5Secuencia";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

const EXERCISES = [
  { id: 1, title: "Las 6 cuerdas", description: "Identifica cada cuerda por su nombre" },
  { id: 2, title: "Notas del Am", description: "Selecciona las notas que forman La menor" },
  { id: 3, title: "Notas del Em", description: "Selecciona las notas que forman Mi menor" },
  { id: 4, title: "Mayor o menor", description: "Clasifica el acorde según su calidad" },
  { id: 5, title: "Am → Em", description: "Toca la progresión al ritmo" },
];

interface ExerciseEngineProps {
  onAllComplete: () => void;
}

export function ExerciseEngine({ onAllComplete }: ExerciseEngineProps) {
  const [current, setCurrent] = useState(0); // 0-4
  const [completed, setCompleted] = useState<number[]>([]);

  const handleComplete = () => {
    const newCompleted = [...completed, current];
    setCompleted(newCompleted);
    if (current < EXERCISES.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 400);
    } else {
      setTimeout(onAllComplete, 600);
    }
  };

  const ex = EXERCISES[current];

  return (
    <div style={{
      background: "#111", border: `1px solid ${BORDER}`,
      borderRadius: 4, overflow: "hidden",
    }}>
      {/* Header del engine */}
      <div style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 16, height: 1, background: GOLD, opacity: 0.5 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>
            Ejercicios prácticos
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {EXERCISES.map((e, i) => (
            <div key={e.id} style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 4,
              background: completed.includes(i) ? GOLD : i === current ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
              transition: "all 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {completed.includes(i) && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#080808" }} />}
            </div>
          ))}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", marginLeft: 6 }}>
            {completed.length}/{EXERCISES.length}
          </span>
        </div>
      </div>

      {/* Exercise title */}
      <div style={{ padding: "16px 24px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {EXERCISES.map((e, i) => (
            <div
              key={e.id}
              style={{
                flex: 1, padding: "6px 0", textAlign: "center",
                borderBottom: `2px solid ${i === current ? GOLD : completed.includes(i) ? "rgba(201,168,76,0.3)" : "transparent"}`,
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ fontSize: 9, color: i === current ? GOLD : completed.includes(i) ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.15)", fontFamily: "Inter,sans-serif", letterSpacing: "0.5px" }}>
                {completed.includes(i) ? "✓" : `${i + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise content */}
      <div style={{ padding: "24px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {current === 0 && <Ex1Cuerdas onComplete={handleComplete} />}
            {current === 1 && <Ex2NotasAm onComplete={handleComplete} />}
            {current === 2 && <Ex3NotasEm onComplete={handleComplete} />}
            {current === 3 && <Ex4CalidadAcorde onComplete={handleComplete} />}
            {current === 4 && <Ex5Secuencia onComplete={handleComplete} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
