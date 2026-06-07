import { useState } from "react";
import { motion } from "motion/react";
import { DisciplinePhrase } from "./DisciplinePhrase";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

const LESSONS = [
  { id: 1, title: "Postura y agarre correcto", duration: "7 min", done: true },
  { id: 2, title: "Tu primer acorde: La menor", duration: "9 min", done: true },
  { id: 3, title: "Cambio Am → Em", duration: "11 min", done: false, current: true },
  { id: 4, title: "Rasgueo 1-2-3", duration: "8 min", done: false },
  { id: 5, title: "Primera canción completa", duration: "14 min", done: false },
];

interface VideoPlayerProps {
  setPage?: (page: string) => void;
}

export function VideoPlayer({ setPage }: VideoPlayerProps) {
  const [activeLesson, setActiveLesson] = useState(2);

  const lesson = LESSONS[activeLesson];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Video area */}
      <div style={{
        background: "#111", border: `1px solid ${BORDER}`,
        borderRadius: 4, overflow: "hidden",
      }}>
        {/* 16:9 placeholder */}
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#0A0A0A" }}>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage && setPage("curriculum")}
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={GOLD}><path d="M5 3l14 9-14 9V3z" /></svg>
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 500 }}>{lesson.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", marginTop: 4 }}>{lesson.duration}</div>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>
              Video · Próximamente
            </div>
          </div>
        </div>

        {/* Lesson selector */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
            Lecciones del módulo
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {LESSONS.map((l, i) => (
              <div
                key={l.id}
                onClick={() => setActiveLesson(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 10px", borderRadius: 2, cursor: "pointer",
                  background: i === activeLesson ? "rgba(201,168,76,0.06)" : "transparent",
                  border: `1px solid ${i === activeLesson ? "rgba(201,168,76,0.2)" : "transparent"}`,
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 1, flexShrink: 0,
                  background: l.done ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${l.done ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {l.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                  {l.current && !l.done && <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD }} />}
                </div>
                <span style={{
                  fontSize: 12, fontFamily: "Inter,sans-serif", flex: 1,
                  color: l.done ? "rgba(255,255,255,0.3)" : i === activeLesson ? WHITE_WARM : "rgba(255,255,255,0.5)",
                  textDecoration: l.done ? "line-through" : "none",
                }}>{l.title}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif" }}>{l.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discipline phrase alongside player */}
      <DisciplinePhrase />
    </div>
  );
}
