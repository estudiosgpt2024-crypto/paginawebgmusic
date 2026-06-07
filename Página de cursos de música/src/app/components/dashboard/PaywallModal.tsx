import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoosePlan: () => void;
  xp?: number;
  streak?: number;
}

const PLANES = [
  {
    id: "mensual",
    label: "Mensual",
    price: "$29",
    period: "/mes",
    hint: "Cancela cuando quieras",
    highlight: false,
  },
  {
    id: "semestral",
    label: "6 meses",
    price: "$19",
    period: "/mes",
    hint: "Ahorra un 34% · $114 total",
    highlight: true,
    badge: "MÁS POPULAR",
  },
  {
    id: "anual",
    label: "Anual",
    price: "$14",
    period: "/mes",
    hint: "Ahorra un 52% · $168 total",
    highlight: false,
  },
];

export function PaywallModal({ isOpen, onClose, onChoosePlan, xp = 80, streak = 12 }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("semestral");
  const [xpAnimated, setXpAnimated] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setXpAnimated(0);
    const step = xp / 40;
    let current = 0;
    const t = setInterval(() => {
      current += step;
      if (current >= xp) { setXpAnimated(xp); clearInterval(t); }
      else setXpAnimated(Math.floor(current));
    }, 20);
    return () => clearInterval(t);
  }, [isOpen, xp]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 500,
              background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", zIndex: 501,
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "min(540px, calc(100vw - 32px))",
              background: "#0C0C0C",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 6,
              boxShadow: "0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Gold top accent line */}
            <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, opacity: 0.6 }} />

            {/* Achievement header */}
            <div style={{
              padding: "28px 32px 20px",
              background: "linear-gradient(to bottom, rgba(201,168,76,0.05) 0%, transparent 100%)",
              borderBottom: `1px solid ${BORDER}`,
              textAlign: "center",
            }}>
              {/* Trophy icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                style={{
                  width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
                  background: "rgba(201,168,76,0.1)",
                  border: "2px solid rgba(201,168,76,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 3 L18.5 10.5 L26.5 10.5 L20 15.5 L22.5 23 L16 18 L9.5 23 L12 15.5 L5.5 10.5 L13.5 10.5 Z"
                    stroke={GOLD} strokeWidth="1.8" strokeLinejoin="round"
                    fill={GOLD} fillOpacity="0.25" />
                </svg>
              </motion.div>

              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", fontFamily: "Inter,sans-serif", marginBottom: 8 }}>
                Clase completada
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: WHITE_WARM, fontWeight: 400, margin: "0 0 8px", letterSpacing: "-0.4px" }}>
                Has completado tu primera clase
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif", margin: 0, lineHeight: 1.6, maxWidth: 380, marginInline: "auto" }}>
                Para mantener tu racha activa, asegurar tu Camino Potencial y desbloquear los 6 meses completos de Fundamento, elige tu plan.
              </p>

              {/* Achievement stats */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
                <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 2, textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", color: GOLD }}>{xpAnimated}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>XP ganados</div>
                </div>
                <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 2, textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", color: "#FF9B3B" }}>🔥 {streak}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Racha</div>
                </div>
                <div style={{ padding: "8px 16px", background: "rgba(76,175,80,0.06)", border: "1px solid rgba(76,175,80,0.2)", borderRadius: 2, textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", color: "#4CAF50" }}>1/6</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Clases</div>
                </div>
              </div>
            </div>

            {/* Plan selector */}
            <div style={{ padding: "20px 32px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", marginBottom: 12, textAlign: "center" }}>
                Elige tu plan
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {PLANES.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    style={{
                      flex: 1, padding: "12px 8px", borderRadius: 3, cursor: "pointer",
                      background: selectedPlan === plan.id
                        ? "rgba(201,168,76,0.08)"
                        : "rgba(255,255,255,0.02)",
                      border: `1.5px solid ${selectedPlan === plan.id ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.07)"}`,
                      position: "relative", transition: "all 0.15s",
                      textAlign: "center",
                    }}
                  >
                    {plan.badge && (
                      <div style={{
                        position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                        background: GOLD, color: "#080808", fontSize: 8, fontWeight: 800,
                        fontFamily: "Inter,sans-serif", letterSpacing: "1px", padding: "2px 8px", borderRadius: 2,
                        whiteSpace: "nowrap",
                      }}>
                        {plan.badge}
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: selectedPlan === plan.id ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", marginBottom: 4, letterSpacing: "0.5px" }}>
                      {plan.label}
                    </div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: selectedPlan === plan.id ? WHITE_WARM : "rgba(255,255,255,0.4)" }}>
                      {plan.price}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif" }}>{plan.period}</div>
                    <div style={{ fontSize: 9, color: selectedPlan === plan.id ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.15)", fontFamily: "Inter,sans-serif", marginTop: 4, lineHeight: 1.3 }}>
                      {plan.hint}
                    </div>
                  </button>
                ))}
              </div>

              {/* What's included */}
              <div style={{ marginBottom: 18, padding: "10px 14px", background: "rgba(255,255,255,0.015)", border: `1px solid ${BORDER}`, borderRadius: 3 }}>
                {[
                  "6 meses completos de Fundamento (6 clases/mes)",
                  "Racha activa · Camino Potencial 3x semana",
                  "Cofre Virtual mensual · +XP desbloqueados",
                  "Videollamada de mentoría mensual incluida",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ background: "rgba(201,168,76,0.9)", boxShadow: "0 8px 28px rgba(201,168,76,0.25)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onChoosePlan}
                style={{
                  width: "100%", height: 48, borderRadius: 3,
                  background: GOLD, color: "#080808",
                  fontSize: 13, fontWeight: 700, border: "none",
                  cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase",
                  fontFamily: "Inter,sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 20px rgba(201,168,76,0.2)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 3l14 9-14 9V3z"/></svg>
                Activar plan {PLANES.find(p => p.id === selectedPlan)?.label}
              </motion.button>

              <button
                onClick={onClose}
                style={{
                  width: "100%", marginTop: 8, background: "none", border: "none",
                  color: "rgba(255,255,255,0.18)", fontSize: 11, cursor: "pointer",
                  fontFamily: "Inter,sans-serif", padding: "8px 0",
                }}
              >
                Ver más tarde
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
