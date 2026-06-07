import { useState } from "react";
import { motion } from "motion/react";
import { Chord } from "tonal";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";

// Tonal.js valida dinámicamente
const AM = Chord.get("Am");
const CORRECT_NOTES = AM.notes; // ["A", "C", "E"]

const ALL_OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "A#", "C#", "F#"];
const OPTIONS = ALL_OPTIONS.filter((_, i) => i < 8);

const NOTE_NAMES: Record<string, string> = {
  A: "La", B: "Si", C: "Do", D: "Re",
  E: "Mi", F: "Fa", G: "Sol", "A#": "La#", "C#": "Do#", "F#": "Fa#",
};

interface Ex2Props {
  onComplete: () => void;
}

export function Ex2NotasAm({ onComplete }: Ex2Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const toggle = (note: string) => {
    if (submitted) return;
    setSelected(s =>
      s.includes(note) ? s.filter(n => n !== note) : s.length < 3 ? [...s, note] : s
    );
  };

  const handleSubmit = () => {
    if (selected.length !== 3) return;
    setSubmitted(true);
    const correct = CORRECT_NOTES.every(n => selected.includes(n)) && selected.length === CORRECT_NOTES.length;
    setResult(correct ? "correct" : "wrong");
    if (correct) setTimeout(onComplete, 900);
    else setTimeout(() => { setSelected([]); setSubmitted(false); setResult(null); }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
          Acorde · La menor (Am)
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: WHITE_WARM, margin: "0 0 8px", fontWeight: 400 }}>
          Selecciona las <span style={{ color: GOLD }}>3 notas</span> del acorde Am
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif", margin: 0 }}>
          Am = {AM.name} — {AM.aliases[0] || "La menor"}
        </p>
      </div>

      {/* Diagrama visual Am */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px 0", marginBottom: 20,
      }}>
        <ChordDiagram chord="Am" positions={[[-1,0,2,2,1,0]]} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {OPTIONS.map(note => {
          const isSel = selected.includes(note);
          const isCorrectNote = CORRECT_NOTES.includes(note);
          const showResult = submitted;
          return (
            <motion.button
              key={note}
              whileHover={!submitted ? { scale: 1.04 } : {}}
              whileTap={!submitted ? { scale: 0.96 } : {}}
              onClick={() => toggle(note)}
              style={{
                height: 52, borderRadius: 2, cursor: submitted ? "default" : "pointer",
                background: showResult && isSel && isCorrectNote ? "rgba(76,175,80,0.15)"
                  : showResult && isSel && !isCorrectNote ? "rgba(232,100,100,0.12)"
                  : isSel ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${showResult && isSel && isCorrectNote ? "rgba(76,175,80,0.5)"
                  : showResult && isSel && !isCorrectNote ? "rgba(232,100,100,0.4)"
                  : isSel ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.07)"}`,
                transition: "all 0.15s",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
              }}
            >
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: isSel ? GOLD : WHITE_WARM }}>{note}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "0.5px" }}>{NOTE_NAMES[note]}</span>
            </motion.button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif" }}>
          {selected.length}/3 seleccionadas
        </span>
        <motion.button
          whileHover={selected.length === 3 ? { scale: 1.03 } : {}}
          whileTap={selected.length === 3 ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={selected.length !== 3 || submitted}
          style={{
            height: 42, padding: "0 28px", borderRadius: 2,
            background: selected.length === 3 ? GOLD : "rgba(255,255,255,0.05)",
            color: selected.length === 3 ? "#080808" : "rgba(255,255,255,0.2)",
            fontSize: 13, fontWeight: 700, border: "none",
            cursor: selected.length === 3 ? "pointer" : "default",
            letterSpacing: "0.5px", fontFamily: "Inter,sans-serif",
            transition: "all 0.2s",
          }}
        >
          {result === "correct" ? "✓ Correcto" : result === "wrong" ? "✗ Intenta de nuevo" : "Confirmar"}
        </motion.button>
      </div>
    </div>
  );
}

// Diagrama de acorde simplificado
function ChordDiagram({ chord, positions }: { chord: string; positions: number[][] }) {
  const GOLD = "#C9A84C";
  const fingers = positions[0]; // [-1, 0, 2, 2, 1, 0] = Am
  const frets = 4;
  const strings = 6;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>{chord}</div>
      <svg width={140} height={110} viewBox="0 0 140 110">
        {/* Nut */}
        <rect x={20} y={14} width={100} height={4} fill="rgba(255,255,255,0.2)" rx={1} />
        {/* Fret lines */}
        {Array.from({ length: frets }).map((_, f) => (
          <line key={f} x1={20} y1={18 + (f + 1) * 20} x2={120} y2={18 + (f + 1) * 20} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        ))}
        {/* String lines */}
        {Array.from({ length: strings }).map((_, s) => (
          <line key={s} x1={20 + s * 20} y1={14} x2={20 + s * 20} y2={98} stroke="rgba(255,255,255,0.15)" strokeWidth={s === 0 || s === 5 ? 1.5 : 1} />
        ))}
        {/* Finger positions */}
        {fingers.map((fret, s) => {
          if (fret <= 0) return null;
          return (
            <circle
              key={s}
              cx={20 + s * 20}
              cy={18 + fret * 20 - 10}
              r={7}
              fill={GOLD}
              fillOpacity={0.9}
            />
          );
        })}
        {/* Open/muted strings */}
        {fingers.map((fret, s) => {
          if (fret === 0) return <text key={s} x={20 + s * 20} y={10} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)">○</text>;
          if (fret === -1) return <text key={s} x={20 + s * 20} y={10} textAnchor="middle" fontSize={9} fill="rgba(255,100,100,0.5)">✕</text>;
          return null;
        })}
      </svg>
    </div>
  );
}
