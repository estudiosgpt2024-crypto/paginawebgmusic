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
  MetricCard,
  QuoteCard,
  LockedFeatureCard,
} from "../components/gmusic/dashboard";
import { ACTIVE_NODE_PANEL } from "../data/gmusic-path-data";
import { GM_BG, GM_TEXT } from "../components/gmusic/tokens";
import {
  MOCK_USER,
  getStreakDaysLabel,
  getMonthlyProgressLabel,
  getUserLevelMonthLabel,
} from "../data/mock-user";

interface GmusicWelcomeProps {
  setPage: (page: string) => void;
}

type AudioState = "pending" | "granted" | "denied";

const DAILY_QUOTE =
  "La constancia le gana al talento cuando el talento no practica.";
const PRACTICE_WEEK_LINE = "Semana 3 · Ritmo y acordes base";
const RECOMMENDED_WEEKLY = 3;

export function GmusicWelcome({ setPage }: GmusicWelcomeProps) {
  const [audioState, setAudioState] = useState<AudioState>("pending");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [showLockedModal, setShowLockedModal] = useState(false);

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
        <DashboardSection className="mb-4 lg:mb-5">
          <WelcomeHeroCard
            userName={MOCK_USER.name}
            practiceWeekLine={PRACTICE_WEEK_LINE}
            streakLabel={getStreakDaysLabel()}
            audioLabel={audioLabel}
            audioState={audioState}
            isCheckingPermission={isCheckingPermission}
            onRequestAudio={handleRequestAudio}
          />
        </DashboardSection>

        <DashboardSection className="mb-6 lg:mb-7">
          <PracticeCard
            title={ACTIVE_NODE_PANEL.title}
            typeLabel={ACTIVE_NODE_PANEL.typeLabel}
            description={ACTIVE_NODE_PANEL.description}
            onContinue={goToCamino}
          />
        </DashboardSection>

        <DashboardGrid className="mb-6 lg:mb-7">
          <MetricCard
            variant="progress"
            icon={TrendingUp}
            eyebrow="Progreso del módulo"
            value={getMonthlyProgressLabel()}
            suffix="completado"
            progressPercent={MOCK_USER.monthlyProgress}
            nodeTitle={MOCK_USER.currentNodeTitle}
            phaseLabel={getUserLevelMonthLabel()}
          />
          <MetricCard
            variant="xp"
            icon={Activity}
            eyebrow="XP y constancia"
            xpTotal={MOCK_USER.xp}
            weeklyGain={180}
            consistencyStatus="En ritmo"
            exercisesUntilChest={Math.max(0, RECOMMENDED_WEEKLY - MOCK_USER.weeklyDone)}
          />
          <QuoteCard quote={DAILY_QUOTE} />
        </DashboardGrid>

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
