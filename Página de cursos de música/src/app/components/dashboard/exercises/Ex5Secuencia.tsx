import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Chord } from "tonal";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

// La progresión Am → Em es la más común en guitarra para principiantes
const SEQUENCE = ["Am", "Em", "Am", "Em"];
const BEATS_PER_CHORD = 4;

interface Ex5Props {
  onComplete: () => void;
}

export function Ex5Secuencia({ onComplete }: Ex5Props) {
  const [step, setStep] = useState(0); // which chord in the sequence
  const [beat, setBeat] = useState(0); // 0-3 beats per chord
  const [tapped, setTapped] = useState(false);
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentChord = SEQUENCE[step];
  const nextChord = SEQUENCE[step + 1] || null;
  const chord = Chord.get(currentChord);

  const handleTap = () => {
    if (completed) return;
    setTapped(true);
    setTimeout(() => setTapped(false), 120);

    const newBeat = beat + 1;
    if (newBeat >= BEATS_PER_CHORD) {
      setBeat(0);
      const newStep = step + 1;
      if (newStep >= SEQUENCE.length) {
        setCompleted(true);
        setTimeout(onComplete, 1000);
      } else {
        setStep(newStep);
      }
    } else {
      setBeat(newBeat);
    }
  };

  const progressPct = ((step * BEATS_PER_CHORD + beat) / (SEQUENCE.length * BEATS_PER_CHORD)) * 100;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
          Cambio de acordes · Secuencia rítmica
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: WHITE_WARM, margin: "0 0 8px", fontWeight: 400 }}>
          Toca la progresión <span style={{ color: GOLD }}>Am → Em</span>
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif", margin: 0 }}>
          Presiona el botón al ritmo de 4 tiempos por acorde. Completa las 4 barras.
        </p>
      </div>

      {/* Secuencia visual */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {SEQUENCE.map((ch, i) => (
          <div key={i} style={{
            flex: 1, padding: "12px 0", borderRadius: 2, textAlign: "center",
            background: i === step ? "rgba(201,168,76,0.1)" : i < step ? "rgba(76,175,80,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${i === step ? "rgba(201,168,76,0.4)" : i < step ? "rgba(76,175,80,0.3)" : BORDER}`,
            transition: "all 0.2s",
          }}>
            <div style={{
              fontFamily: "'Playfair Display',serif", fontSize: 20,
              color: i === step ? GOLD : i < step ? "#4CAF50" : "rgba(255,255,255,0.25)",
            }}>{ch}</div>
            {i < step && <div style={{ fontSize: 11, color: "#4CAF50", marginTop: 2 }}>✓</div>}
          </div>
        ))}
      </div>

      {/* Acorde actual + info tonal */}
      {!completed && (
        <div style={{
          background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: 3, padding: "16px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Tocando ahora</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: GOLD }}>{currentChord}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", marginTop: 4 }}>
              {chord.notes.join(" · ")}
            </div>
          </div>
          {nextChord && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Siguiente</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "rgba(255,255,255,0.3)" }}>{nextChord}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "Inter,sans-serif", marginTop: 4 }}>
                Prepara el cambio en {BEATS_PER_CHORD - beat} {BEATS_PER_CHORD - beat === 1 ? "tiempo" : "tiempos"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Beats visuales */}
      {!completed && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {Array.from({ length: BEATS_PER_CHORD }).map((_, i) => (
            <motion.div
              key={i}
              animate={i === beat && tapped ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.12 }}
              style={{
                flex: 1, height: 8, borderRadius: 2,
                background: i < beat ? GOLD : i === beat ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${i <= beat ? "rgba(201,168,76,0.3)" : "transparent"}`,
                transition: "background 0.1s",
              }}
            />
          ))}
        </div>
      )}

      {/* Tap button */}
      {!completed ? (
        <motion.button
          animate={tapped ? { scale: 0.94, background: "rgba(201,168,76,0.25)" } : { scale: 1, background: "rgba(201,168,76,0.1)" }}
          transition={{ duration: 0.1 }}
          onClick={handleTap}
          style={{
            width: "100%", height: 64, borderRadius: 2,
            border: "1px solid rgba(201,168,76,0.35)",
            color: GOLD, fontSize: 15, fontWeight: 600,
            cursor: "pointer", letterSpacing: "2px", textTransform: "uppercase",
            fontFamily: "Inter,sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>🎸</span>
          TAP · {currentChord}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center", padding: "24px",
            background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: 3,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: WHITE_WARM }}>
            ¡Progresión completada!
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif", marginTop: 6 }}>
            Am → Em → Am → Em en tempo constante
          </div>
        </motion.div>
      )}

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden", marginTop: 16 }}>
        <motion.div
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.15 }}
          style={{ height: "100%", background: GOLD, borderRadius: 1 }}
        />
      </div>
    </div>
  );
}
