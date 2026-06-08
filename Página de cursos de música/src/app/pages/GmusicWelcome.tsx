import { useState, useEffect } from "react";
import { Target, Dumbbell, TrendingUp, Activity } from "lucide-react";
import { GmusicInternalHeader, isLockedNav, LOCKED_NAV_MODAL } from "../components/gmusic/GmusicInternalHeader";
import { GmusicPlaceholderModal } from "../components/gmusic/GmusicPlaceholderModal";
import {
  DashboardGrid,
  DashboardSection,
  DashboardShell,
  WelcomeHeroCard,
  PracticeCard,
  CompletedPathCard,
  DashboardErrorBanner,
  MetricCard,
  QuoteCard,
  LockedFeatureCard,
} from "../components/gmusic/dashboard";
import { GM_BG, GM_TEXT } from "../components/gmusic/tokens";
import { useDashboard } from "../hooks/useDashboard";

interface GmusicWelcomeProps {
  setPage: (page: string) => void;
}

type AudioState = "pending" | "granted" | "denied";

const DAILY_QUOTE =
  "La constancia le gana al talento cuando el talento no practica.";
const PRACTICE_WEEK_LINE = "Semana 3 · Ritmo y acordes base";

export function GmusicWelcome({ setPage }: GmusicWelcomeProps) {
  const [audioState, setAudioState] = useState<AudioState>("pending");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const dashboard = useDashboard();

  const handleNavPlaceholder = (key: string) => {
    if (isLockedNav(key)) setShowLockedModal(true);
  };

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

  const goToCamino = () => setPage("mi-camino");

  const audioLabel = (() => {
    if (isCheckingPermission) return "Comprobando audio…";
    if (audioState === "granted") return "Audio listo";
    if (audioState === "denied") return "Micrófono bloqueado";
    return "Preparar estudio";
  })();

  const isLoading = dashboard.status === "loading";
  const viewModel = dashboard.status === "success" ? dashboard.viewModel : null;

  return (
    <div
      className="min-h-screen"
      style={{
        background: GM_BG,
        backgroundImage:
          "radial-gradient(ellipse 90% 60% at 85% -15%, rgba(212,175,55,0.07) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 10% 100%, rgba(212,175,55,0.04) 0%, transparent 45%)",
        color: GM_TEXT,
      }}
    >
      <GmusicInternalHeader
        activeNav="estudio"
        setPage={setPage}
        onPlaceholder={handleNavPlaceholder}
      />

      <DashboardShell>
        {dashboard.status === "error" && (
          <DashboardSection className="mb-4 lg:mb-5">
            <DashboardErrorBanner message={dashboard.message} onRetry={dashboard.retry} />
          </DashboardSection>
        )}

        <DashboardSection className="mb-4 lg:mb-5">
          <WelcomeHeroCard
            userName={isLoading ? "…" : (viewModel?.userName ?? "…")}
            practiceWeekLine={PRACTICE_WEEK_LINE}
            streakLabel={isLoading ? "…" : (viewModel?.streakLabel ?? "—")}
            audioLabel={audioLabel}
            audioState={audioState}
            isCheckingPermission={isCheckingPermission}
            onRequestAudio={handleRequestAudio}
          />
        </DashboardSection>

        {dashboard.status !== "error" && (
          <DashboardSection className="mb-6 lg:mb-7">
            {isLoading ? (
              <PracticeCard
                title="Cargando práctica…"
                typeLabel="Conectando con tu estudio"
                description="Estamos preparando tu próxima sesión."
                onContinue={goToCamino}
                isLoading
              />
            ) : viewModel?.pathComplete ? (
              <CompletedPathCard onViewPath={goToCamino} />
            ) : viewModel?.nextPractice ? (
              <PracticeCard
                title={viewModel.nextPractice.title}
                typeLabel={viewModel.nextPractice.typeLabel}
                description={viewModel.nextPractice.description}
                onContinue={goToCamino}
              />
            ) : null}
          </DashboardSection>
        )}

        {dashboard.status !== "error" && (
          <DashboardGrid className="mb-6 lg:mb-7">
            <MetricCard
              variant="progress"
              icon={TrendingUp}
              eyebrow="Progreso del módulo"
              value={isLoading ? "…" : (viewModel?.progressPercentLabel ?? "—")}
              suffix="completado"
              progressPercent={isLoading ? 0 : (viewModel?.progressPercent ?? 0)}
              nodeTitle={isLoading ? "…" : (viewModel?.currentNodeTitle ?? "—")}
              phaseLabel={isLoading ? "…" : (viewModel?.phaseLabel ?? "—")}
            />
            <MetricCard
              variant="xp"
              icon={Activity}
              eyebrow="XP y constancia"
              xpTotal={isLoading ? 0 : (viewModel?.xpTotal ?? 0)}
              weeklyGain={isLoading ? 0 : (viewModel?.weeklyGain ?? 0)}
              consistencyStatus={isLoading ? "…" : (viewModel?.consistencyStatus ?? "—")}
            />
            <QuoteCard quote={DAILY_QUOTE} />
          </DashboardGrid>
        )}

        <DashboardGrid>
          <div className="lg:col-span-6">
            <LockedFeatureCard
              icon={Target}
              eyebrow="Desafío del Día"
              description="Reto rápido diario para mantener tu racha sin presión de avance en el camino."
            />
          </div>
          <div className="lg:col-span-6">
            <LockedFeatureCard
              icon={Dumbbell}
              eyebrow="Laboratorio de Práctica"
              description="Repaso libre de oído, lectura y técnica — sin presión de avanzar en el camino."
            />
          </div>
        </DashboardGrid>
      </DashboardShell>

      <GmusicPlaceholderModal
        open={showLockedModal}
        onClose={() => setShowLockedModal(false)}
        title={LOCKED_NAV_MODAL.title}
        subtitle={LOCKED_NAV_MODAL.subtitle}
        footer={LOCKED_NAV_MODAL.footer}
      />
    </div>
  );
}
