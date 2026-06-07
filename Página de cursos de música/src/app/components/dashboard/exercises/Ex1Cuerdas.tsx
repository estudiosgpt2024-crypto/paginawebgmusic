import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

// Las 6 cuerdas de guitarra en orden de más grave a más aguda
const STRINGS = [
  { number: 6, name: "E", label: "Mi grave", color: "rgba(201,168,76,0.8)" },
  { number: 5, name: "A", label: "La", color: "rgba(201,168,76,0.65)" },
  { number: 4, name: "D", label: "Re", color: "rgba(201,168,76,0.5)" },
  { number: 3, name: "G", label: "Sol", color: "rgba(201,168,76,0.4)" },
  { number: 2, name: "B", label: "Si", color: "rgba(201,168,76,0.3)" },
  { number: 1, name: "e", label: "Mi agudo", color: "rgba(201,168,76,0.25)" },
];

const OPTIONS = ["E", "A", "D", "G", "B", "e", "C", "F"];

interface Ex1Props {
  onComplete: () => void;
}

export function Ex1Cuerdas({ onComplete }: Ex1Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [wrongCount, setWrongCount] = useState(0);

  const question = STRINGS[current];

  // Shuffle options deterministically per question
  const shuffled = [...OPTIONS].sort((a, b) => {
    const seed = question.number * 7;
    return ((a.charCodeAt(0) * seed) % 11) - ((b.charCodeAt(0) * seed) % 11);
  }).slice(0, 6);
  if (!shuffled.includes(question.name)) {
    shuffled[0] = question.name;
  }

  const handleSelect = (opt: string) => {
    if (result) return;
    setSelected(opt);
    if (opt === question.name) {
      setResult("correct");
      setTimeout(() => {
        if (current < STRINGS.length - 1) {
          setCurrent(c => c + 1);
          setSelected(null);
          setResult(null);
        } else {
          onComplete();
        }
      }, 700);
    } else {
      setResult("wrong");
      setWrongCount(w => w + 1);
      setTimeout(() => { setSelected(null); setResult(null); }, 600);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
          Cuerda {question.number} de 6
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: WHITE_WARM, margin: "0 0 8px", fontWeight: 400 }}>
          ¿Cómo se llama la cuerda <span style={{ color: GOLD }}>#{question.number}</span>?
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif", margin: 0 }}>
          Contando desde la más {question.number === 6 ? "grave (más gruesa)" : question.number === 1 ? "aguda (más fina)" : `intermedia`}
        </p>
      </div>

      {/* Visual: mástil simplificado */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`,
        borderRadius: 3, padding: "16px 20px", marginBottom: 24,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        {STRINGS.map((s, i) => (
          <div key={s.number} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", width: 14, textAlign: "right" }}>{s.number}</span>
            <div style={{
              flex: 1, height: s.number === 6 ? 4 : s.number === 5 ? 3 : s.number === 4 ? 2.5 : s.number === 3 ? 2 : 1.5,
              background: s.number === question.number ? GOLD : "rgba(255,255,255,0.1)",
              borderRadius: 1,
              transition: "background 0.2s",
              boxShadow: s.number === question.number ? `0 0 8px rgba(201,168,76,0.4)` : "none",
            }} />
            <span style={{ fontSize: 10, color: s.number === question.number ? GOLD : "rgba(255,255,255,0.15)", fontFamily: "Inter,sans-serif", width: 50 }}>
              {s.number === question.number ? "← esta" : ""}
            </span>
          </div>
        ))}
      </div>

      {/* Opciones */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {shuffled.map(opt => {
          const isSelected = selected === opt;
          const isCorrect = isSelected && result === "correct";
          const isWrong = isSelected && result === "wrong";
          return (
            <motion.button
              key={opt}
              whileHover={!result ? { scale: 1.03 } : {}}
              whileTap={!result ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt)}
              style={{
                height: 48, borderRadius: 2,
                background: isCorrect ? "rgba(76,175,80,0.15)" : isWrong ? "rgba(232,100,100,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isCorrect ? "rgba(76,175,80,0.5)" : isWrong ? "rgba(232,100,100,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: isCorrect ? "#4CAF50" : isWrong ? "#E86464" : WHITE_WARM,
                fontSize: 18, fontFamily: "'Playfair Display',serif",
                cursor: result ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 20, justifyContent: "center" }}>
        {STRINGS.map((_, i) => (
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
