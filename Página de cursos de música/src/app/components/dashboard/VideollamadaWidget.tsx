import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

interface Student {
  highScore: boolean;
  criticalDrop: boolean;
  streak: number;
  name: string;
}

export function VideollamadaWidget({ student }: { student: Student }) {
  const [requested, setRequested] = useState(false);
  const [slots, setSlots] = useState<string | null>(null);

  const isHighScore = student.highScore || student.streak >= 10;
  const isCritical = student.criticalDrop || student.streak < 3;

  const type = isHighScore ? "premio" : isCritical ? "salvavidas" : null;

  const handleRequest = () => {
    setRequested(true);
    setSlots("Martes 10:00 · Jueves 16:00 · Sábado 11:00");
  };

  return (
    <div style={{
      background: "#111", border: `1px solid ${type ? "rgba(201,168,76,0.25)" : BORDER}`,
      borderRadius: 4, padding: "24px 28px",
      position: "relative", overflow: "hidden",
    }}>
      {type && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: type === "premio"
            ? "linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)"
            : "linear-gradient(to right, transparent, rgba(232,131,106,0.5), transparent)",
        }} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 16, height: 1, background: GOLD, opacity: 0.5 }} />
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>
          Videollamada con el profesor
        </span>
      </div>

      {!type && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎓</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif", lineHeight: 1.6, margin: 0 }}>
            Las videollamadas se desbloquean al mantener una racha de <span style={{ color: GOLD }}>10+ días</span> o al alcanzar puntaje alto.
          </p>
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 3, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif" }}>
              🔥 Racha actual: <span style={{ color: student.streak >= 7 ? GOLD : "rgba(255,255,255,0.4)" }}>{student.streak} días</span>
            </span>
          </div>
        </div>
      )}

      {type === "premio" && !requested && (
        <div>
          <div style={{
            background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 3, padding: "14px 16px", marginBottom: 16,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🏆</span>
            <div>
              <div style={{ fontSize: 13, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 4 }}>
                ¡Ganaste una videollamada!
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif", margin: 0, lineHeight: 1.6 }}>
                Tu racha de <strong style={{ color: GOLD }}>{student.streak} días</strong> y tu puntaje te hacen acreedor a una sesión personal con el profesor.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ background: "rgba(201,168,76,0.85)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRequest}
            style={{
              width: "100%", height: 44, borderRadius: 2,
              background: GOLD, color: "#080808",
              fontSize: 13, fontWeight: 700, border: "none",
              cursor: "pointer", letterSpacing: "0.5px", fontFamily: "Inter,sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            Agendar mi videollamada
          </motion.button>
        </div>
      )}

      {type === "salvavidas" && !requested && (
        <div>
          <div style={{
            background: "rgba(232,131,106,0.06)", border: "1px solid rgba(232,131,106,0.2)",
            borderRadius: 3, padding: "14px 16px", marginBottom: 16,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
            <div>
              <div style={{ fontSize: 13, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 4 }}>
                Te notamos ausente
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif", margin: 0, lineHeight: 1.6 }}>
                Llevas varios días sin practicar. Hay una videollamada disponible para ayudarte a retomar el ritmo.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ background: "rgba(232,131,106,0.12)", borderColor: "rgba(232,131,106,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRequest}
            style={{
              width: "100%", height: 44, borderRadius: 2,
              background: "rgba(0,0,0,0)", border: "1px solid rgba(232,131,106,0.25)",
              color: "#E8836A", fontSize: 13, fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.5px", fontFamily: "Inter,sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            Quiero retomar el rumbo
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {requested && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 4 }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>✅</span>
              <div style={{ fontSize: 14, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 600, marginTop: 8 }}>
                ¡Solicitud enviada!
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif", marginTop: 4 }}>
                Elige un horario disponible:
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(slots || "").split(" · ").map((slot, i) => (
                <button
                  key={i}
                  style={{
                    width: "100%", height: 38, borderRadius: 2,
                    background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)",
                    color: GOLD, fontSize: 12, fontFamily: "Inter,sans-serif",
                    cursor: "pointer", letterSpacing: "0.3px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.10)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(201,168,76,0.04)"}
                >
                  {slot}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
