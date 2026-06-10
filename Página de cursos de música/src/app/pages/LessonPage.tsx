import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DisciplinePhrase } from "../components/dashboard/DisciplinePhrase";
import { ExerciseEngine } from "../components/dashboard/ExerciseEngine";
import { CofreVirtual } from "../components/dashboard/CofreVirtual";
import { VideoPlayerLesson } from "../components/dashboard/VideoPlayerLesson";
import { GOLD, WHITE_WARM, BORDER } from "../components/marketing/tokens";

interface LessonPageProps {
  setPage: (page: string) => void;
  onComplete?: () => void;
}

export function LessonPage({ setPage, onComplete }: LessonPageProps) {
  const [cofreOpen, setCofreOpen] = useState(false);
  const [lessonDone, setLessonDone] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, []);

  const handleAllExercisesComplete = () => {
    setLessonDone(true);
    setCofreOpen(true);
  };

  const handleCofreClose = () => {
    setCofreOpen(false);
    onComplete?.();
    setPage("curriculum");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: WHITE_WARM }}>
      {/* Top bar — Focus Mode */}
      <div style={{
        height: 52, borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,8,8,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setPage("curriculum")}
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontFamily: "Inter,sans-serif",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Mi academia
          </button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "1px" }}>
            Nivel 1 · Mes 1 · Clase 1
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lessonDone && (
            <span style={{ fontSize: 11, color: "#4CAF50", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              Clase completada
            </span>
          )}
          <span style={{ fontSize: 11, color: "rgba(201,168,76,0.5)", fontFamily: "Inter,sans-serif", letterSpacing: "0.5px" }}>
            Guitarra · Fundamento
          </span>
        </div>
      </div>

      <div style={{ maxWidth: cinemaMode ? "100%" : 1200, margin: "0 auto", padding: cinemaMode ? "24px 32px 80px" : "32px 32px 80px", transition: "max-width 0.3s ease" }}>
        {/* Lesson header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 20, height: 1, background: GOLD, opacity: 0.5 }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontFamily: "Inter,sans-serif" }}>
              Clase 1
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px, 3vw, 34px)", color: WHITE_WARM, margin: "0 0 8px", fontWeight: 400, letterSpacing: "-0.8px" }}>
            Las 6 cuerdas y tu primer acorde
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif", margin: 0 }}>
            Las 6 cuerdas · Acordes Am y Em · Primera progresión
          </p>
        </motion.div>

        {/* Main layout — cinema collapses right column */}
        <div style={{
          display: "grid",
          gridTemplateColumns: cinemaMode ? "1fr" : "1.4fr 1fr",
          gap: 20,
          transition: "grid-template-columns 0.3s ease",
        }}>
          {/* Left: Video + Theory + Exercises */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <VideoPlayerLesson
              title="Clase 1 — Las 6 cuerdas y tu primer acorde"
              subtitle="Am · Em · Primera progresión · 12 min"
              duration="12:00"
              lessonLabel="Fundamento · Clase 1"
              cinemaMode={cinemaMode}
              onCinemaToggle={() => setCinemaMode(m => !m)}
            />

            {/* Theory summary */}
            <div style={{
              background: "#111", border: `1px solid ${BORDER}`,
              borderRadius: 4, padding: "16px 20px",
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                Teoría de la clase · Tonal.js
              </div>
              <div style={{ display: "grid", gridTemplateColumns: cinemaMode ? "repeat(4,1fr)" : "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Acorde Am", value: "A · C · E", sub: "La menor" },
                  { label: "Acorde Em", value: "E · G · B", sub: "Mi menor" },
                  { label: "Progresión", value: "Am → Em", sub: "4/4 · 2 barras" },
                  { label: "Cuerdas", value: "E A D G B e", sub: "Grave → agudo" },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: "10px 12px", borderRadius: 2,
                    background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`,
                  }}>
                    <div style={{ fontSize: 10, color: "rgba(201,168,76,0.5)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 500 }}>{item.value}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", marginTop: 2 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise engine */}
            <ExerciseEngine onAllComplete={handleAllExercisesComplete} />
          </div>

          {/* Right column — hidden in cinema mode */}
          <AnimatePresence>
            {!cinemaMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <DisciplinePhrase />

                {/* Lesson checklist */}
                <div style={{
                  background: "#111", border: `1px solid ${BORDER}`,
                  borderRadius: 4, padding: "20px 22px",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", marginBottom: 16 }}>
                    Objetivos de la clase
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Conocer las 6 cuerdas y sus nombres",
                      "Tocar el acorde Am correctamente",
                      "Tocar el acorde Em correctamente",
                      "Identificar acordes mayores y menores",
                      "Cambiar entre Am y Em al ritmo",
                    ].map((obj, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: 1, flexShrink: 0, marginTop: 1,
                          background: lessonDone ? "rgba(76,175,80,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${lessonDone ? "rgba(76,175,80,0.4)" : "rgba(255,255,255,0.08)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.3s",
                        }}>
                          {lessonDone && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next class preview */}
                <div style={{
                  background: "rgba(255,255,255,0.01)", border: `1px solid ${BORDER}`,
                  borderRadius: 4, padding: "16px 20px",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", marginBottom: 10 }}>
                    Próxima clase
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "'Playfair Display',serif" }}>Clase 2 — Rasgueo básico 1-2-3</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", marginTop: 6 }}>
                    Completa los ejercicios de hoy para desbloquear
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {cofreOpen && <CofreVirtual onClose={handleCofreClose} xp={80} />}
      </AnimatePresence>
    </div>
  );
}
