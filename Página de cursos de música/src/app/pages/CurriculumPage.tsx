import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PaywallModal } from "../components/dashboard/PaywallModal";
import { AmbientBackground } from "../components/dashboard/AmbientBackground";
import { GOLD, WHITE_WARM, BORDER } from "../components/marketing/tokens";

type NodeStatus = "done" | "current" | "premium" | "locked";

const CLASES_BASE = [
  { id: 1, title: "Las 6 cuerdas y tu primer acorde", subtitle: "Am · Em · Primera progresión", xp: 80, duration: "12 min", page: "lesson", type: "guitar", tip: "El punto de partida de todo guitarrista", requiresSubscription: false },
  { id: 2, title: "Rasgueo básico 1-2-3", subtitle: "Pulso · Corcheas · Patrón down-up", xp: 80, duration: "10 min", page: "lesson", type: "audio", tip: "El ritmo que da vida a los acordes", requiresSubscription: true },
  { id: 3, title: "El acorde G · Progresión Am-G", subtitle: "Sol mayor · 3 acordes · Cambio fluido", xp: 80, duration: "11 min", page: "lesson", type: "chord", tip: "Los 3 acordes más usados en guitarra pop", requiresSubscription: true },
  { id: 4, title: "Afinación y mantenimiento", subtitle: "Afinador · Cuerdas · Cuidado", xp: 60, duration: "8 min", page: "lesson", type: "tuner", tip: "Un guitarrista afinado suena 10 veces mejor", requiresSubscription: true },
  { id: 5, title: "Tu primera canción completa", subtitle: "Am · Em · G · Rasgueo · Tempo real", xp: 100, duration: "14 min", page: "lesson", type: "stand", tip: "Tocas una canción completa por primera vez", requiresSubscription: true },
  { id: 6, title: "Evaluación del mes · Cierre", subtitle: "Toca en vivo · Muestra tu avance", xp: 120, duration: "15 min", page: "lesson", type: "trophy", tip: "Demuestra todo lo que aprendiste este mes", requiresSubscription: true },
];

function deriveStatus(id: number, completedLessons: number[], userTier: "free" | "pro"): NodeStatus {
  if (completedLessons.includes(id)) return "done";
  const base = CLASES_BASE.find(c => c.id === id)!;
  const prevDone = id === 1 || completedLessons.includes(id - 1);
  if (!prevDone) return "locked";
  if (base.requiresSubscription && userTier === "free") return "premium";
  return "current";
}

const POSITIONS = ["center", "right", "center", "left", "center", "right"] as const;

// Node horizontal centers in px (within a 372px row = container 420px - 48px padding)
// Matches flex justify: center=186, right=338 (372-68/2=338), left=34 (68/2=34)
const NODE_X: Record<string, number> = { left: 34, center: 186, right: 338 };
const NODE_SIZE = 72;
const EVAL_SIZE = 84;

// ── Contextual SVG icons ──────────────────────────────────────────────────────

/** Clase 1: Guitar silhouette */
function IconGuitar({ dark }: { dark?: boolean }) {
  const c = dark ? "#080808" : WHITE_WARM;
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {/* Body */}
      <ellipse cx="20" cy="26" rx="10" ry="9" fill={c} opacity="0.9"/>
      <ellipse cx="20" cy="26" rx="6.5" ry="6" fill={dark ? "rgba(0,0,0,0.15)" : "rgba(201,168,76,0.15)"}/>
      {/* Waist */}
      <rect x="17" y="17" width="6" height="4" rx="1" fill={c} opacity="0.9"/>
      {/* Neck */}
      <rect x="18.5" y="6" width="3" height="12" rx="1.5" fill={c} opacity="0.9"/>
      {/* Head */}
      <rect x="17" y="4" width="6" height="4" rx="1.5" fill={c} opacity="0.9"/>
      {/* Tuning pegs */}
      <circle cx="16.5" cy="5" r="1.2" fill={c} opacity="0.7"/>
      <circle cx="23.5" cy="5" r="1.2" fill={c} opacity="0.7"/>
      {/* Sound hole */}
      <circle cx="20" cy="26" r="3" stroke={dark ? "rgba(0,0,0,0.3)" : "rgba(201,168,76,0.4)"} strokeWidth="1.5" fill="none"/>
      {/* Strings */}
      {[-1.5, -0.5, 0.5, 1.5].map((offset, i) => (
        <line key={i} x1={20 + offset} y1="8" x2={20 + offset} y2="32"
          stroke={dark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"} strokeWidth="0.6"/>
      ))}
    </svg>
  );
}

/** Clase 2: Audio waveform bars (escuchar / rasgueo) */
function IconAudio({ dark }: { dark?: boolean }) {
  const c = dark ? "#080808" : WHITE_WARM;
  const bars = [10, 18, 26, 32, 24, 16, 28, 20, 12, 30, 22];
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {bars.map((h, i) => (
        <rect key={i}
          x={4 + i * 3.1} y={20 - h / 2} width="2.2" height={h}
          rx="1.1" fill={c} opacity={0.7 + (i % 3) * 0.1}
        />
      ))}
    </svg>
  );
}

/** Clase 3: Guitar chord fingering */
function IconChord({ dark }: { dark?: boolean }) {
  const c = dark ? "#080808" : WHITE_WARM;
  const dim = dark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)";
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {/* Nut */}
      <rect x="8" y="7" width="24" height="2.5" rx="1" fill={c} opacity="0.8"/>
      {/* Frets */}
      {[1,2,3].map(f => (
        <line key={f} x1="8" y1={7 + f*9} x2="32" y2={7 + f*9}
          stroke={c} strokeWidth="1" opacity="0.3"/>
      ))}
      {/* Strings */}
      {[0,1,2,3,4].map(s => (
        <line key={s} x1={8 + s*6} y1="9" x2={8 + s*6} y2="34"
          stroke={c} strokeWidth="1" opacity="0.3"/>
      ))}
      {/* Finger dots for G chord */}
      <circle cx="14" cy="16" r="3.5" fill={c} opacity="0.9"/>
      <circle cx="20" cy="25" r="3.5" fill={c} opacity="0.9"/>
      <circle cx="26" cy="25" r="3.5" fill={c} opacity="0.9"/>
    </svg>
  );
}

/** Clase 4: Tuning fork */
function IconTuner({ dark }: { dark?: boolean }) {
  const c = dark ? "#080808" : WHITE_WARM;
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {/* Fork prongs */}
      <path d="M16 8 L16 24 Q16 30 20 30 Q24 30 24 24 L24 8" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
      {/* Top arc */}
      <path d="M16 8 Q20 4 24 8" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
      {/* Handle */}
      <line x1="20" y1="30" x2="20" y2="37" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
      {/* Sound waves */}
      <path d="M10 18 Q8 20 10 22" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M7 16 Q4 20 7 24" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"/>
      <path d="M30 18 Q32 20 30 22" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M33 16 Q36 20 33 24" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"/>
    </svg>
  );
}

/** Clase 5: Music stand (atril) with score */
function IconStand({ dark }: { dark?: boolean }) {
  const c = dark ? "#080808" : WHITE_WARM;
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      {/* Stand base */}
      <path d="M20 32 L13 38 M20 32 L27 38" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      {/* Pole */}
      <line x1="20" y1="14" x2="20" y2="32" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      {/* Score page */}
      <rect x="9" y="7" width="22" height="16" rx="2" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.5" opacity="0.8"/>
      {/* Staff lines */}
      {[0,1,2,3,4].map(l => (
        <line key={l} x1="12" y1={11 + l * 2.2} x2="28" y2={11 + l * 2.2}
          stroke={c} strokeWidth="0.7" opacity="0.5"/>
      ))}
      {/* Notes */}
      <circle cx="15" cy="13.2" r="1.6" fill={c} opacity="0.8"/>
      <circle cx="20" cy="15.4" r="1.6" fill={c} opacity="0.8"/>
      <circle cx="25" cy="11" r="1.6" fill={c} opacity="0.8"/>
    </svg>
  );
}

/** Clase 6: Trophy */
function IconTrophy({ dark }: { dark?: boolean }) {
  const c = dark ? "#080808" : WHITE_WARM;
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <path d="M20 4 L22.5 11.5 L30.5 11.5 L24 16.5 L26.5 24 L20 19 L13.5 24 L16 16.5 L9.5 11.5 L17.5 11.5 Z"
        fill={c} opacity="0.9" stroke={c} strokeWidth="0.5" strokeLinejoin="round"/>
      {/* Base */}
      <rect x="15" y="28" width="10" height="3" rx="1" fill={c} opacity="0.7"/>
      <rect x="13" y="31" width="14" height="2.5" rx="1" fill={c} opacity="0.5"/>
    </svg>
  );
}

function IconLockSmall() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function NodeIcon({ type, dark }: { type: string; dark?: boolean }) {
  switch (type) {
    case "guitar":  return <IconGuitar dark={dark} />;
    case "audio":   return <IconAudio dark={dark} />;
    case "chord":   return <IconChord dark={dark} />;
    case "tuner":   return <IconTuner dark={dark} />;
    case "stand":   return <IconStand dark={dark} />;
    case "trophy":  return <IconTrophy dark={dark} />;
    default:        return null;
  }
}

// ── Node fill colors by status ────────────────────────────────────────────────
function nodeFill(status: NodeStatus, isEval: boolean) {
  if (status === "done")    return { bg: GOLD, border: GOLD, shadow: "0 0 28px rgba(201,168,76,0.5)" };
  if (status === "current") return { bg: GOLD, border: GOLD, shadow: "0 0 36px rgba(201,168,76,0.45)" };
  if (status === "premium") return { bg: "rgba(201,168,76,0.18)", border: "rgba(201,168,76,0.5)", shadow: "0 0 18px rgba(201,168,76,0.1)" };
  // locked
  return { bg: "rgba(40,40,40,0.9)", border: "rgba(255,255,255,0.1)", shadow: "none" };
}

// ── Lesson Popup ──────────────────────────────────────────────────────────────
function LessonPopup({ clase, status, onStart, onClose }: {
  clase: typeof CLASES_BASE[0]; status: NodeStatus; onStart: () => void; onClose: () => void;
}) {
  const isEval = clase.type === "trophy";
  const isPremium = status === "premium";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "absolute", zIndex: 10,
        left: "50%", transform: "translateX(-50%)",
        width: 272,
        background: "rgba(14,14,14,0.99)", backdropFilter: "blur(24px)",
        border: `1px solid ${isPremium ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.28)"}`,
        borderRadius: 4, padding: "20px 20px 14px",
        boxShadow: "0 24px 56px rgba(0,0,0,0.9)",
      }}
    >
      <div style={{ position: "absolute", top: -7, left: "50%", width: 12, height: 12, background: "rgba(14,14,14,0.99)", border: "1px solid rgba(201,168,76,0.28)", borderBottom: "none", borderRight: "none", transform: "translateX(-50%) rotate(45deg)" }} />

      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <NodeIcon type={clase.type} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", fontFamily: "Inter,sans-serif", marginBottom: 2 }}>
            {isPremium ? "Premium" : isEval ? "Evaluación" : `Clase ${clase.id}`}
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: WHITE_WARM, fontWeight: 400, lineHeight: 1.3 }}>
            {clase.title}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "rgba(201,168,76,0.5)", fontFamily: "Inter,sans-serif", fontStyle: "italic", marginBottom: 14, lineHeight: 1.5, paddingLeft: 2 }}>
        "{clase.tip}"
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <span style={{ fontSize: 10, color: "rgba(201,168,76,0.7)", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 2, padding: "2px 8px", fontFamily: "Inter,sans-serif", fontWeight: 600 }}>+{clase.xp} XP</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 2, padding: "2px 8px", fontFamily: "Inter,sans-serif" }}>{clase.duration}</span>
      </div>

      <motion.button
        whileHover={{ background: "rgba(201,168,76,0.88)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        style={{ width: "100%", height: 42, borderRadius: 2, background: GOLD, color: "#080808", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "1.2px", textTransform: "uppercase", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        {isPremium
          ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>Activar plan</>
          : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 3l14 9-14 9V3z"/></svg>Empezar {isEval ? "evaluación" : "clase"}</>
        }
      </motion.button>
      <button onClick={onClose} style={{ width: "100%", marginTop: 6, background: "none", border: "none", color: "rgba(255,255,255,0.18)", fontSize: 10, cursor: "pointer", fontFamily: "Inter,sans-serif", padding: "6px 0" }}>Cerrar</button>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface CurriculumPageProps {
  setPage: (page: string) => void;
  xp?: number;
  streak?: number;
  completedLessons?: number[];
  userTier?: "free" | "pro";
}

export function CurriculumPage({ setPage, xp = 220, streak = 11, completedLessons = [], userTier = "free" }: CurriculumPageProps) {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [achievementId, setAchievementId] = useState<number | null>(null);
  const prevCompletedRef = useRef<number[]>([]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, []);

  useEffect(() => {
    const prev = prevCompletedRef.current;
    const newlyDone = completedLessons.filter(id => !prev.includes(id));
    if (newlyDone.length > 0) {
      setAchievementId(newlyDone[newlyDone.length - 1]);
      const t = setTimeout(() => setAchievementId(null), 3000);
      prevCompletedRef.current = completedLessons;
      return () => clearTimeout(t);
    }
    prevCompletedRef.current = completedLessons;
  }, [completedLessons]);

  const totalXp = 1000;
  const progressPct = Math.min((xp / totalXp) * 100, 100);
  const stages = ["Comprensión", "Hábito", "Manifestación"];
  const currentStage = xp < 333 ? 0 : xp < 666 ? 1 : 2;
  const currentClase = CLASES_BASE.find(c => deriveStatus(c.id, completedLessons, userTier) === "current");

  const handleNodeClick = (i: number) => {
    const status = deriveStatus(CLASES_BASE[i].id, completedLessons, userTier);
    if (status === "locked") return;
    setActiveNode(activeNode === i ? null : i);
  };

  const handleNodeStart = (clase: typeof CLASES_BASE[0]) => {
    const status = deriveStatus(clase.id, completedLessons, userTier);
    setActiveNode(null);
    if (status === "premium") { setPaywallOpen(true); }
    else if (clase.page) { setPage(clase.page); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: WHITE_WARM, position: "relative", overflow: "hidden" }}>

      <AmbientBackground />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Top bar ── */}
        <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,8,0.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${BORDER}` }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "Inter,sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Inicio
          </button>
          <div style={{ height: 32, padding: "0 14px", borderRadius: 20, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: GOLD, fontFamily: "Inter,sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>Guitarra</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FF9B3B", fontFamily: "Inter,sans-serif" }}>{streak}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={GOLD}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: GOLD, fontFamily: "Inter,sans-serif" }}>{xp.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Active lesson banner ── */}
        {currentClase && (
          <div style={{ margin: "14px 28px 0", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#080808"><path d="M5 3l14 9-14 9V3z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", fontFamily: "Inter,sans-serif", marginBottom: 2 }}>MES 1 · SECCIÓN {currentClase.id}</div>
                <div style={{ fontSize: 13, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 500 }}>{currentClase.title}</div>
              </div>
            </div>
            <motion.button whileHover={{ background: "rgba(201,168,76,0.85)" }} whileTap={{ scale: 0.96 }} onClick={() => setPage("lesson")}
              style={{ height: 32, padding: "0 16px", borderRadius: 2, background: GOLD, color: "#080808", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "Inter,sans-serif", flexShrink: 0 }}>
              Continuar
            </motion.button>
          </div>
        )}

        {/* ── Resonancia Total ── */}
        <div style={{ padding: "18px 28px 0", maxWidth: 500, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", fontFamily: "Inter,sans-serif" }}>Resonancia Total</span>
            <span style={{ fontSize: 10, color: "rgba(201,168,76,0.38)", fontFamily: "Inter,sans-serif" }}>{xp} / {totalXp} XP</span>
          </div>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ height: "100%", background: `linear-gradient(to right, rgba(201,168,76,0.4), ${GOLD})`, borderRadius: 2 }} />
            </div>
            {stages.map((_, i) => {
              const pct = ((i + 1) / 3) * 100;
              const reached = xp >= ((i + 1) / 3) * totalXp;
              return (
                <div key={i} style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)" }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: reached ? GOLD : "rgba(255,255,255,0.07)", border: `2px solid ${reached ? GOLD : "rgba(255,255,255,0.1)"}` }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {stages.map((s, i) => (
              <span key={s} style={{ fontSize: 8, fontFamily: "Inter,sans-serif", letterSpacing: "1.5px", textTransform: "uppercase", color: i <= currentStage ? "rgba(201,168,76,0.42)" : "rgba(255,255,255,0.1)" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── Mes label ── */}
        <div style={{ textAlign: "center", padding: "22px 0 4px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 16px", borderRadius: 20, background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
            <div style={{ width: 1, height: 9, background: GOLD, opacity: 0.4 }} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", fontFamily: "Inter,sans-serif" }}>Mes 1 · Fundamento</span>
            <div style={{ width: 1, height: 9, background: GOLD, opacity: 0.4 }} />
          </div>
        </div>

        {/* ── PATH ── */}
        {/* Container: maxWidth 420, padding 24px sides → inner = 372px  */}
        <div style={{ position: "relative", maxWidth: 420, margin: "0 auto", padding: "16px 24px 100px" }}>
          {CLASES_BASE.map((clase, i) => {
            const pos = POSITIONS[i];
            const status = deriveStatus(clase.id, completedLessons, userTier);
            const isDone = status === "done";
            const isCurrent = status === "current";
            const isPremium = status === "premium";
            const isLocked = status === "locked";
            const isEval = clase.type === "trophy";
            const isOpen = activeNode === i;
            const isAchievement = achievementId === clase.id;
            const nSize = isEval ? EVAL_SIZE : NODE_SIZE;
            const fill = nodeFill(status, isEval);
            const iconDark = isCurrent || isDone; // icon is dark when circle is gold

            // Next node position for connector
            const nextPos = i < CLASES_BASE.length - 1 ? POSITIONS[i + 1] : null;
            const nextStatus = i < CLASES_BASE.length - 1 ? deriveStatus(CLASES_BASE[i + 1].id, completedLessons, userTier) : null;
            const connectorLit = isDone;

            return (
              <div key={clase.id} style={{ position: "relative", marginBottom: isEval ? 20 : 52 }}>

                {/* ── Connector SVG ── */}
                {nextPos && (
                  <svg
                    viewBox={`0 0 372 60`}
                    style={{ position: "absolute", top: nSize / 2 + 2, left: 0, width: "100%", height: 60, zIndex: 0, pointerEvents: "none" }}
                    preserveAspectRatio="none"
                  >
                    {/* Dashed base track */}
                    <path d={buildPath(pos, nextPos)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round"/>
                    {/* Lit overlay when done */}
                    {connectorLit && (
                      <motion.path
                        d={buildPath(pos, nextPos)}
                        fill="none"
                        stroke={isPremium || nextStatus === "premium" ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.55)"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.0, ease: "easeInOut", delay: isAchievement ? 0.4 : 0 }}
                      />
                    )}
                  </svg>
                )}

                {/* ── Node row ── */}
                <div style={{ display: "flex", justifyContent: pos === "left" ? "flex-start" : pos === "right" ? "flex-end" : "center" }}>
                  <div style={{ position: "relative" }}>

                    {/* Achievement burst */}
                    <AnimatePresence>
                      {isAchievement && (
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0.7 }}
                          animate={{ scale: 2.8, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(201,168,76,0.35)", zIndex: 1, pointerEvents: "none" }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Node button */}
                    <motion.button
                      whileHover={!isLocked ? { scale: 1.07 } : {}}
                      whileTap={!isLocked ? { scale: 0.93 } : {}}
                      animate={isCurrent ? { boxShadow: ["0 0 0 0 rgba(201,168,76,0.6)", "0 0 0 16px rgba(201,168,76,0)", "0 0 0 0 rgba(201,168,76,0)"] } : isAchievement ? { scale: [1, 1.12, 1] } : {}}
                      transition={isCurrent ? { repeat: Infinity, duration: 2.2 } : { duration: 0.5 }}
                      onClick={() => handleNodeClick(i)}
                      style={{
                        width: nSize, height: nSize, borderRadius: "50%",
                        background: fill.bg,
                        border: `3px solid ${fill.border}`,
                        boxShadow: fill.shadow,
                        cursor: isLocked ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", zIndex: 2,
                        transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
                      }}
                    >
                      {isLocked
                        ? <IconLockSmall />
                        : isPremium
                          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.85)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          : <NodeIcon type={clase.type} dark={iconDark} />
                      }
                    </motion.button>

                    {/* Done checkmark badge */}
                    {isDone && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: isAchievement ? 0.3 : 0 }}
                        style={{
                          position: "absolute", top: -4, right: -4,
                          width: 22, height: 22, borderRadius: "50%",
                          background: "#4CAF50", border: "2px solid #080808",
                          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      </motion.div>
                    )}

                    {/* XP pill below node */}
                    {(isCurrent || isDone) && (
                      <div style={{
                        position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
                        background: isDone ? "rgba(76,175,80,0.15)" : "rgba(201,168,76,0.15)",
                        border: `1px solid ${isDone ? "rgba(76,175,80,0.35)" : "rgba(201,168,76,0.35)"}`,
                        borderRadius: 10, padding: "1px 8px",
                        fontSize: 9, fontFamily: "Inter,sans-serif", fontWeight: 700,
                        color: isDone ? "#4CAF50" : GOLD, whiteSpace: "nowrap",
                      }}>
                        {isDone ? "✓" : `+${clase.xp} XP`}
                      </div>
                    )}

                    {/* Stars for evaluation node */}
                    {isEval && (
                      <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 3 }}>
                        {[0,1,2].map(s => (
                          <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                              stroke="rgba(201,168,76,0.28)" strokeWidth="1.5" fill="rgba(201,168,76,0.05)" />
                          </svg>
                        ))}
                      </div>
                    )}

                    {/* Popup */}
                    <AnimatePresence>
                      {isOpen && (
                        <div style={{ position: "absolute", top: nSize + 16, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
                          <LessonPopup clase={clase} status={status} onStart={() => handleNodeStart(clase)} onClose={() => setActiveNode(null)} />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── Side label (only for current/done, no locked/premium labels) ── */}
                {(isCurrent || isDone) && (
                  <div style={{
                    position: "absolute", top: nSize / 2 - 12,
                    ...(pos === "right" ? { right: `calc(100% - ${nSize - 6}px)`, paddingRight: 14, textAlign: "right" }
                      : pos === "left" ? { left: `calc(100% - ${nSize - 6}px)`, paddingLeft: 14 }
                      : { left: `calc(50% + ${nSize / 2 + 10}px)`, paddingLeft: 12 }),
                    maxWidth: 145,
                  }}>
                    <div style={{ fontSize: 11, color: isCurrent ? WHITE_WARM : "rgba(255,255,255,0.45)", fontFamily: "Inter,sans-serif", fontWeight: isCurrent ? 600 : 400, lineHeight: 1.4 }}>
                      {clase.title}
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize: 9, color: "rgba(201,168,76,0.55)", fontFamily: "Inter,sans-serif", marginTop: 3, letterSpacing: "0.5px" }}>
                        → Toca para empezar
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* End marker */}
          <div style={{ textAlign: "center", paddingTop: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.01)", border: "2px dashed rgba(255,255,255,0.06)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16, opacity: 0.15 }}>✦</span>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.1)", fontFamily: "Inter,sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>Mes 2 · Próximamente</div>
          </div>
        </div>
      </div>

      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} onChoosePlan={() => { setPaywallOpen(false); setPage("planes"); }} xp={xp} streak={streak} />
    </div>
  );
}

// Connector path: from/to positions in 372px coordinate space
function buildPath(from: string, to: string): string {
  const x = NODE_X;
  const x1 = x[from], x2 = x[to];
  // Start at bottom of current node, end at top of next node
  return `M ${x1} 0 C ${x1} 30, ${x2} 30, ${x2} 60`;
}
