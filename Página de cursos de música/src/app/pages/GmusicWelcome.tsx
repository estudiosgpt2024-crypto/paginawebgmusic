import { useState, useEffect } from "react";
import {
  Guitar,
  Mic,
  Map,
  Target,
  Dumbbell,
  ChevronRight,
  Lock,
  Flame,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { GmusicInternalHeader } from "../components/gmusic/GmusicInternalHeader";
import { GmusicPlaceholderModal } from "../components/gmusic/GmusicPlaceholderModal";
import { GM_BG, GM_GOLD, GM_TEXT, GM_TEXT_SEC } from "../components/gmusic/tokens";
import {
  MOCK_USER,
  getWelcomeGreeting,
  getStreakMessage,
  getStreakDaysLabel,
  getMonthlyProgressLabel,
  getCurrentNodeProgressLine,
} from "../data/mock-user";

interface GmusicWelcomeProps {
  setPage: (page: string) => void;
}

type AudioState = "pending" | "granted" | "denied";

const GOLD_BORDER = "rgba(212, 175, 55, 0.20)";
const GOLD_BORDER_HOVER = "rgba(212, 175, 55, 0.45)";
const SURFACE = "rgba(18, 18, 18, 0.85)";

export function GmusicWelcome({ setPage }: GmusicWelcomeProps) {
  const [audioState, setAudioState] = useState<AudioState>("pending");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [placeholderStage, setPlaceholderStage] = useState("");

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
        if (result.state === "granted") setAudioState("granted");
        else if (result.state === "denied") setAudioState("denied");
        else setAudioState("pending");
        result.onchange = () => {
          if (result.state === "granted") setAudioState("granted");
          else if (result.state === "denied") setAudioState("denied");
          else setAudioState("pending");
        };
      } catch {
        setAudioState("pending");
      } finally {
        setIsCheckingPermission(false);
      }
    };
    checkPermission();
  }, []);

  const handleRequestAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioState("granted");
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setAudioState("denied");
    }
  };

  const handlePlaceholder = (stage: string) => {
    setPlaceholderStage(stage);
    setShowPlaceholder(true);
    setTimeout(() => setShowPlaceholder(false), 2500);
  };

  const goToCamino = () => setPage("mi-camino");

  /* ─── Audio banner (minimal, fuera de las cards) ─── */
  const AudioBanner = () => {
    if (isCheckingPermission || audioState === "granted") return null;
    return (
      <div
        className="flex items-center gap-3 px-4 py-2.5 mb-6 rounded-sm"
        style={{
          background: "rgba(212,175,55,0.07)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <Mic className="w-3.5 h-3.5 shrink-0" style={{ color: GM_GOLD }} />
        <p className="text-xs" style={{ color: "rgba(212,175,55,0.85)" }}>
          {audioState === "denied"
            ? "Micrófono bloqueado — ve a Configuración del navegador para habilitarlo."
            : "Activa el micrófono para ejercicios interactivos de guitarra."}
        </p>
        {audioState === "pending" && (
          <button
            onClick={handleRequestAudio}
            className="ml-auto shrink-0 text-xs font-medium px-3 py-1 rounded-sm transition-all"
            style={{ background: GM_GOLD, color: "#0A0A0A" }}
          >
            Activar
          </button>
        )}
      </div>
    );
  };

  /* ─── Stat pill ─── */
  const StatPill = ({
    icon,
    label,
    value,
    accent = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent?: boolean;
  }) => (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-sm flex-1 min-w-[140px]"
      style={{
        background: SURFACE,
        border: `1px solid ${accent ? GOLD_BORDER : "rgba(255,255,255,0.05)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
        style={{
          background: accent ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${accent ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.06)"}`,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-[10px] uppercase tracking-[0.14em] mb-0.5"
          style={{ color: "rgba(160,160,165,0.6)" }}
        >
          {label}
        </p>
        <p className="text-sm font-semibold" style={{ color: accent ? GM_GOLD : GM_TEXT }}>
          {value}
        </p>
      </div>
    </div>
  );

  /* ─── Barra de progreso ─── */
  const ProgressBar = () => (
    <div
      className="flex flex-col gap-2 px-4 py-3 rounded-sm"
      style={{
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        flex: 2,
        minWidth: 200,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: GM_GOLD }} />
          <p
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "rgba(160,160,165,0.6)" }}
          >
            Progreso del mes
          </p>
        </div>
        <span className="text-sm font-bold" style={{ color: GM_GOLD }}>
          {getMonthlyProgressLabel()}
        </span>
      </div>
      <div className="w-full h-2 rounded-sm overflow-hidden" style={{ background: "#222" }}>
        <div
          className="h-full rounded-sm transition-all duration-700"
          style={{
            width: `${MOCK_USER.monthlyProgress}%`,
            background: `linear-gradient(90deg, ${GM_GOLD}, rgba(212,175,55,0.7))`,
            boxShadow: `0 0 8px rgba(212,175,55,0.4)`,
          }}
        />
      </div>
      <p className="text-[10px]" style={{ color: "rgba(160,160,165,0.5)" }}>
        {getCurrentNodeProgressLine()}
      </p>
    </div>
  );

  /* ─── Card principal Camino ─── */
  const CaminoFocus = () => (
    <div
      className="relative overflow-hidden cursor-pointer group transition-all duration-300 h-full flex flex-col"
      style={{
        borderRadius: 2,
        padding: "36px 40px",
        background:
          "linear-gradient(150deg, rgba(212,175,55,0.09) 0%, rgba(14,14,14,0.95) 50%, #0A0A0A 100%)",
        border: `1px solid ${GOLD_BORDER}`,
        boxShadow: "0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.04) inset",
        transition: "border-color 250ms, box-shadow 250ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = GOLD_BORDER_HOVER;
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1) inset";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = GOLD_BORDER;
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.04) inset";
      }}
      onClick={goToCamino}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToCamino()}
    >
      {/* línea superior dorada */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #D4AF37 40%, transparent 100%)",
        }}
      />

      {/* icono */}
      <div
        className="w-12 h-12 rounded-sm flex items-center justify-center mb-7"
        style={{
          background: "rgba(212,175,55,0.10)",
          border: "1px solid rgba(212,175,55,0.22)",
        }}
      >
        <Map className="w-5 h-5" style={{ color: GM_GOLD }} />
      </div>

      {/* eyebrow */}
      <p
        className="text-[10px] uppercase tracking-[0.22em] mb-3"
        style={{ color: "rgba(212,175,55,0.6)" }}
      >
        Tu camino · Guitarra 12 meses
      </p>

      <h2
        className="text-2xl font-semibold tracking-tight mb-3"
        style={{ color: GM_TEXT, fontFamily: "'Playfair Display', serif" }}
      >
        Continuar mi Camino
      </h2>

      <p className="text-sm leading-relaxed mb-auto" style={{ color: GM_TEXT_SEC, maxWidth: 420 }}>
        Retoma la misión donde quedaste ayer y sigue avanzando en tu ruta de guitarra.
      </p>

      <div className="mt-8">
        <button
          className="flex items-center gap-2 h-12 px-7 text-[14px] font-semibold transition-all duration-200"
          style={{
            background: GM_GOLD,
            color: "#0A0A0A",
            borderRadius: 2,
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "rgba(228,196,90,1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = GM_GOLD)
          }
        >
          Entrar al camino
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  /* ─── Card secundaria Desafío ─── */
  const DesafioCard = () => (
    <div
      className="h-full flex flex-col"
      style={{
        borderRadius: 2,
        padding: "28px",
        background: SURFACE,
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        opacity: 0.65,
        cursor: "not-allowed",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Target className="w-4 h-4" style={{ color: "#555" }} />
        </div>
        <Lock className="w-3.5 h-3.5" style={{ color: "#444" }} />
      </div>

      <p
        className="text-[10px] uppercase tracking-[0.18em] mb-2"
        style={{ color: "rgba(160,160,165,0.45)" }}
      >
        Desafío del Día
      </p>
      <h3 className="text-base font-medium mb-2 tracking-tight" style={{ color: "rgba(245,245,247,0.55)" }}>
        Próximamente
      </h3>
      <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(160,160,165,0.45)" }}>
        Completa el reto rápido del día para mantener tu racha y sumar XP extra.
      </p>
    </div>
  );

  /* ─── Fila Laboratorio ─── */
  const LaboratorioRow = () => (
    <button
      type="button"
      disabled
      className="w-full flex items-center gap-4 py-4 px-2 text-left cursor-not-allowed"
      style={{ opacity: 0.38 }}
    >
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Dumbbell className="w-4 h-4" style={{ color: "#555" }} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium block" style={{ color: GM_TEXT_SEC }}>
          Laboratorio de Práctica
        </span>
        <span className="text-xs block mt-0.5 truncate" style={{ color: "rgba(160,160,165,0.5)" }}>
          Repaso libre de oído, lectura y técnica — sin presión de avanzar
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(160,160,165,0.4)" }}>
          Pronto
        </span>
        <ChevronRight className="w-4 h-4 opacity-25" style={{ color: GM_TEXT_SEC }} />
      </div>
    </button>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: GM_BG,
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(212,175,55,0.06) 0%, transparent 55%)",
        color: GM_TEXT,
      }}
    >
      <GmusicInternalHeader
        activeNav="estudio"
        setPage={setPage}
        onPlaceholder={handlePlaceholder}
      />

      <main className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 pt-10 md:pt-14 pb-20 md:pb-28">

        {/* ── Saludo ── */}
        <section className="mb-8 md:mb-10">
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "rgba(212,175,55,0.55)" }}
          >
            Mi Estudio · {MOCK_USER.instrument}
          </p>
          <h1
            className="font-semibold tracking-tight leading-[1.12] mb-4"
            style={{
              fontSize: "clamp(1.85rem, 4vw, 3rem)",
              color: GM_TEXT,
              letterSpacing: "-0.02em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {getWelcomeGreeting()}
          </h1>
          <p className="text-sm" style={{ color: "rgba(212,175,55,0.75)" }}>
            🔥 {getStreakMessage()}
          </p>
        </section>

        {/* ── Banner audio ── */}
        <AudioBanner />

        {/* ── Stats strip ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <StatPill
            icon={<Flame className="w-4 h-4" style={{ color: GM_GOLD }} />}
            label="Racha actual"
            value={getStreakDaysLabel()}
            accent
          />
          <StatPill
            icon={<Guitar className="w-4 h-4" style={{ color: "#666" }} />}
            label="Nodo actual"
            value={MOCK_USER.currentNodeTitle}
          />
          <ProgressBar />
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden space-y-4">
          <CaminoFocus />
          <DesafioCard />
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 4 }}>
            <LaboratorioRow />
          </div>
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden md:block">
          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: "minmax(0, 7fr) minmax(0, 3fr)", minHeight: 300 }}
          >
            <CaminoFocus />
            <DesafioCard />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 4 }}>
            <LaboratorioRow />
          </div>
        </div>
      </main>

      <GmusicPlaceholderModal
        open={showPlaceholder}
        onClose={() => setShowPlaceholder(false)}
        title="Próximamente"
        stage={placeholderStage}
      />
    </div>
  );
}
