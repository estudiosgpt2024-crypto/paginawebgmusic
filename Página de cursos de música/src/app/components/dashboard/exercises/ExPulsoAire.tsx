import { useState } from "react";
import { motion } from "motion/react";
import type { PulsoBeat } from "../../../data/demo-lessons";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

interface ExPulsoAireProps {
  headline: string;
  description: string;
  sequence: readonly PulsoBeat[];
  onComplete: () => void;
}

export function ExPulsoAire({ headline, description, sequence, onComplete }: ExPulsoAireProps) {
  const [step, setStep] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = sequence[step];
  const next = sequence[step + 1] ?? null;
  const progressPct = sequence.length > 0 ? (step / sequence.length) * 100 : 0;

  const handleTap = () => {
    if (completed || !current) return;
    setTapped(true);
    setTimeout(() => setTapped(false), 120);

    const newStep = step + 1;
    if (newStep >= sequence.length) {
      setCompleted(true);
      setTimeout(onComplete, 1000);
    } else {
      setStep(newStep);
    }
  };

  if (sequence.length === 0) return null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "Inter,sans-serif",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Pulso · cuerdas al aire
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 22,
            color: WHITE_WARM,
            margin: "0 0 8px",
            fontWeight: 400,
          }}
        >
          {headline}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "Inter,sans-serif",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 24,
        }}
      >
        {sequence.map((beat, i) => (
          <div
            key={`${i}-${beat.stringNumber}`}
            style={{
              minWidth: 36,
              padding: "8px 10px",
              borderRadius: 2,
              textAlign: "center",
              background:
                i === step
                  ? "rgba(201,168,76,0.1)"
                  : i < step
                  ? "rgba(76,175,80,0.08)"
                  : "rgba(255,255,255,0.02)",
              border: `1px solid ${
                i === step
                  ? "rgba(201,168,76,0.4)"
                  : i < step
                  ? "rgba(76,175,80,0.3)"
                  : BORDER
              }`,
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 16,
                color: i === step ? GOLD : i < step ? "#4CAF50" : "rgba(255,255,255,0.25)",
              }}
            >
              {beat.label}
            </div>
          </div>
        ))}
      </div>

      {!completed && current && (
        <div
          style={{
            background: "rgba(201,168,76,0.04)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: 3,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Inter,sans-serif",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: 6,
              }}
            >
              Toca ahora
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: GOLD }}>
              Cuerda {current.stringNumber}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "Inter,sans-serif",
                marginTop: 4,
              }}
            >
              {current.stringName}
            </div>
          </div>
          {next && (
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "Inter,sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: 6,
                }}
              >
                Siguiente
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 22,
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {next.label}
              </div>
            </div>
          )}
        </div>
      )}

      {!completed ? (
        <motion.button
          animate={
            tapped
              ? { scale: 0.94, background: "rgba(201,168,76,0.25)" }
              : { scale: 1, background: "rgba(201,168,76,0.1)" }
          }
          transition={{ duration: 0.1 }}
          onClick={handleTap}
          style={{
            width: "100%",
            height: 64,
            borderRadius: 2,
            border: "1px solid rgba(201,168,76,0.35)",
            color: GOLD,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontFamily: "Inter,sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>🎸</span>
          TAP · cuerda {current?.stringNumber}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "24px",
            background: "rgba(76,175,80,0.08)",
            border: "1px solid rgba(76,175,80,0.3)",
            borderRadius: 3,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: WHITE_WARM }}>
            ¡Secuencia completada!
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Inter,sans-serif",
              marginTop: 6,
            }}
          >
            Pulso manual · {sequence.length} golpes
          </div>
        </motion.div>
      )}

      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 1,
          overflow: "hidden",
          marginTop: 16,
        }}
      >
        <motion.div
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.15 }}
          style={{ height: "100%", background: GOLD, borderRadius: 1 }}
        />
      </div>
    </div>
  );
}
