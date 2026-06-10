import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getPlanById } from "../data/subscription-plans";
import type { PlanId } from "../data/subscription-plans";
import { GOLD, TEXT_SEC, WHITE_WARM } from "../components/marketing/tokens";

const SELECTED_PLAN_KEY = "gmusic:selected_plan_v1";

function readSelectedPlan(): PlanId {
  try {
    const raw = localStorage.getItem(SELECTED_PLAN_KEY);
    if (!raw) return "semester";
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "planId" in parsed &&
      (["monthly", "semester", "annual"] as unknown[]).includes(
        (parsed as { planId: unknown }).planId
      )
    ) {
      return (parsed as { planId: PlanId }).planId;
    }
    return "semester";
  } catch {
    return "semester";
  }
}

interface InscripcionRegistroPageProps {
  setPage: (page: string) => void;
}

export function InscripcionRegistroPage({ setPage }: InscripcionRegistroPageProps) {
  const [planId] = useState<PlanId>(() => readSelectedPlan());
  const plan = getPlanById(planId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: WHITE_WARM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 520 }}
      >
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.6)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Registro · Plan {plan.name}
        </p>

        <h1
          style={{
            margin: "0 0 16px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 4vw, 36px)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: WHITE_WARM,
          }}
        >
          Formulario de registro
        </h1>

        <p
          style={{
            margin: "0 0 12px",
            fontSize: 15,
            lineHeight: 1.7,
            color: TEXT_SEC,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Esta página estará disponible en Fase 4: formulario de registro, contraseña
          y vinculación con el plan {plan.name.toLowerCase()}.
        </p>

        <p
          style={{
            margin: "0 0 32px",
            fontSize: 12,
            color: "rgba(255,150,0,0.7)",
            fontFamily: "Inter, sans-serif",
            fontStyle: "italic",
          }}
        >
          Plan seleccionado guardado en localStorage: <strong>{plan.name}</strong>
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button
            type="button"
            whileHover={{ background: "rgba(201,168,76,0.82)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage("inscripcion-gate")}
            style={{
              height: 48,
              padding: "0 24px",
              borderRadius: 2,
              background: GOLD,
              color: "#080808",
              fontSize: 11,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ← Cambiar plan
          </motion.button>

          <button
            type="button"
            onClick={() => setPage("home")}
            style={{
              height: 48,
              padding: "0 24px",
              borderRadius: 2,
              background: "transparent",
              color: "rgba(255,255,255,0.45)",
              fontSize: 11,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Ir al inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
