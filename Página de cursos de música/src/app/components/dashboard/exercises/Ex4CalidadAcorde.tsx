import { useState } from "react";
import { motion } from "motion/react";
import { Chord } from "tonal";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";

// Tonal.js como juez
const CHORDS_TO_QUIZ = [
  { symbol: "Am", display: "Am", question: "¿La menor (Am) es un acorde...?" },
  { symbol: "C", display: "C",  question: "¿Do mayor (C) es un acorde...?" },
  { symbol: "Em", display: "Em", question: "¿Mi menor (Em) es un acorde...?" },
];

const QUALITY_LABELS: Record<string, string> = {
  Minor: "Menor",
  Major: "Mayor",
  Diminished: "Disminuido",
  Augmented: "Aumentado",
};

interface Ex4Props {
  onComplete: () => void;
}

export function Ex4CalidadAcorde({ onComplete }: Ex4Props) {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const item = CHORDS_TO_QUIZ[current];
  const chord = Chord.get(item.symbol);
  const correctQuality = chord.quality; // "Minor" | "Major" | etc.

  const options = ["Major", "Minor", "Diminished", "Augmented"];

  const handleSelect = (opt: string) => {
    if (result) return;
    const correct = opt === correctQuality;
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      setTimeout(() => {
        if (current < CHORDS_TO_QUIZ.length - 1) {
          setCurrent(c => c + 1);
          setResult(null);
        } else {
          onComplete();
        }
      }, 800);
    } else {
      setTimeout(() => setResult(null), 700);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
          Calidad del acorde · {current + 1} de {CHORDS_TO_QUIZ.length}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: WHITE_WARM, margin: "0 0 8px", fontWeight: 400 }}>
          {item.question}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif", margin: 0 }}>
          Notas: {chord.notes.join(" · ")} — Intervalo: {chord.intervals.join(" · ")}
        </p>
      </div>

      {/* Símbolo grande del acorde */}
      <div style={{
        textAlign: "center", padding: "28px 0", marginBottom: 24,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 3,
      }}>
        <div style={{
          fontFamily: "'Playfair Display',serif", fontSize: 64,
          color: GOLD, lineHeight: 1, letterSpacing: "-2px",
        }}>
          {item.display}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", marginTop: 8, letterSpacing: "2px", textTransform: "uppercase" }}>
          {chord.tonic} — {chord.type}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {options.map(opt => {
          const isCorrect = opt === correctQuality && result === "correct";
          const isWrong = opt === correctQuality && result === "wrong";
          return (
            <motion.button
              key={opt}
              whileHover={!result ? { scale: 1.02 } : {}}
              whileTap={!result ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(opt)}
              style={{
                height: 52, borderRadius: 2,
                background: isCorrect ? "rgba(76,175,80,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isCorrect ? "rgba(76,175,80,0.45)" : isWrong ? "rgba(232,100,100,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: isCorrect ? "#4CAF50" : WHITE_WARM,
                fontSize: 14, fontFamily: "Inter,sans-serif", fontWeight: 500,
                cursor: result ? "default" : "pointer",
                transition: "all 0.15s",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
              }}
            >
              <span>{QUALITY_LABELS[opt] || opt}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", letterSpacing: "0.5px" }}>{opt}</span>
            </motion.button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 20, justifyContent: "center" }}>
        {CHORDS_TO_QUIZ.map((_, i) => (
          <div key={i} style={{
            width: i === current ? 16 : 6, height: 6, borderRadius: 3,
            background: i < current ? GOLD : i === current ? GOLD : "rgba(255,255,255,0.1)",
            opacity: i < current ? 0.5 : 1,
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}
