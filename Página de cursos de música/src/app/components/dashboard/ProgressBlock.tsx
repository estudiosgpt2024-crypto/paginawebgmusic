import { motion } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

interface Module {
  title: string;
  progress: number;
  done: boolean;
}

interface Student {
  modules: Module[];
  weeklyExercisesDone: number;
  weeklyExercisesTotal: number;
}

export function ProgressBlock({ student, onCofreOpen }: { student: Student; onCofreOpen: () => void }) {
  const allDone = student.weeklyExercisesDone === student.weeklyExercisesTotal;

  return (
    <div style={{
      background: "#111", border: `1px solid ${BORDER}`,
      borderRadius: 4, padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>
          Progreso del mes
        </span>
        {allDone && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCofreOpen}
            style={{
              background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 2, padding: "4px 12px", color: GOLD,
              fontSize: 11, fontFamily: "Inter,sans-serif", fontWeight: 600,
              letterSpacing: "0.5px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            🎁 Reclamar cofre
          </motion.button>
        )}
      </div>

      {/* Weekly exercises progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Inter,sans-serif" }}>Ejercicios esta semana</span>
          <span style={{ fontSize: 12, color: GOLD, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>
            {student.weeklyExercisesDone}/{student.weeklyExercisesTotal}
          </span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(student.weeklyExercisesDone / student.weeklyExercisesTotal) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ height: "100%", background: GOLD, borderRadius: 2 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {Array.from({ length: student.weeklyExercisesTotal }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 28, borderRadius: 2,
                background: i < student.weeklyExercisesDone ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${i < student.weeklyExercisesDone ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.05)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {i < student.weeklyExercisesDone && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Module list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {student.modules.map((mod, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{
                fontSize: 12, fontFamily: "Inter,sans-serif",
                color: mod.done ? "rgba(255,255,255,0.4)" : mod.progress > 0 ? WHITE_WARM : "rgba(255,255,255,0.25)",
                textDecoration: mod.done ? "line-through" : "none",
              }}>
                {mod.done && <span style={{ color: GOLD, marginRight: 6 }}>✓</span>}
                {mod.title}
              </span>
              <span style={{ fontSize: 11, color: mod.done ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif" }}>
                {mod.progress}%
              </span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mod.progress}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
                style={{
                  height: "100%", borderRadius: 1,
                  background: mod.done ? "rgba(201,168,76,0.3)" : mod.progress > 60 ? GOLD : "rgba(201,168,76,0.5)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
