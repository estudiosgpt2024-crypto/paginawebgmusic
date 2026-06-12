import { useCallback, useMemo, useState } from "react";
import { GmusicInternalHeader, isLockedNav, LOCKED_NAV_MODAL } from "../components/gmusic/GmusicInternalHeader";
import { GmusicPlaceholderModal } from "../components/gmusic/GmusicPlaceholderModal";
import { DemoAcademyNav } from "../components/gmusic/DemoAcademyNav";
import { DemoPathCards } from "../components/gmusic/DemoPathCards";
import { PathPageIntro } from "../components/gmusic/path/PathPageIntro";
import { Button } from "../components/ui/button";
import { DEMO_LESSONS } from "../data/demo-lessons";
import { useDemoProgress } from "../hooks/useDemoProgress";
import type { PathModuleData, PathNodeData, PathLane } from "../data/gmusic-path-types";
import { countPathProgress } from "../data/gmusic-path-types";
import { GM_BG, GM_BORDER, GM_GOLD, GM_SURFACE, GM_TEXT, GM_TEXT_SEC } from "../components/gmusic/tokens";
import { navigateToHomeSection } from "../utils/public-home-navigation";

export const DEMO_PATH_NODE_ID = "demo-node-1";

const WHITE_WARM = "#F5F0E8";

const DEMO_BADGE = {
  instrument: "Guitarra",
  month: "Mes 1",
  level: "Fundamento",
} as const;

const DEMO_LANES: PathLane[] = ["center", "right", "center", "left", "center"];

export function buildDemoModules(completedLessons: number[]): PathModuleData[] {
  const nextLessonNumber = completedLessons.length + 1;

  const nodes: PathNodeData[] = DEMO_LESSONS.map((lesson, index) => {
    const { lessonNumber, title, videoDuration, objective } = lesson;
    const status =
      completedLessons.includes(lessonNumber)
        ? ("completed" as const)
        : lessonNumber === nextLessonNumber
        ? ("active" as const)
        : ("locked" as const);

    return {
      id: `demo-node-${lessonNumber}`,
      title,
      type: "video" as const,
      status,
      lane: DEMO_LANES[index] ?? "center",
      duration: videoDuration,
      typeLabel: `Lección · ${videoDuration}`,
      description: objective,
    };
  });

  return [
    {
      id: "demo-module-1",
      index: 1,
      title: "Mundo 1 — Fundamento",
      focus: "Las bases de la guitarra",
      nodes,
    },
  ];
}

interface LockedDemoNodePanelProps {
  compact?: boolean;
  title: string;
  onViewPlans: () => void;
}

function LockedDemoNodePanel({ compact, title, onViewPlans }: LockedDemoNodePanelProps) {
  return (
    <div
      className={`rounded-lg border p-5 md:p-6 ${compact ? "" : "lg:sticky lg:top-6"}`}
      style={{
        background: GM_SURFACE,
        borderColor: GM_BORDER,
        borderLeftWidth: 3,
        borderLeftColor: "rgba(201, 168, 76, 0.35)",
      }}
    >
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3"
        style={{ color: "rgba(212, 175, 55, 0.65)" }}
      >
        Clase bloqueada
      </p>
      <h2
        className={`font-medium mb-2 leading-snug ${compact ? "text-lg" : "text-xl"}`}
        style={{ color: GM_TEXT, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: GM_TEXT_SEC }}>
        Esta clase se desbloquea al completar las anteriores.
      </p>
      <Button
        onClick={onViewPlans}
        className="w-full font-medium min-h-[44px] tracking-wide"
        style={{ background: GM_GOLD, color: "#0A0A0A" }}
      >
        Ver planes
      </Button>
    </div>
  );
}

interface DemoFinishedPanelProps {
  compact?: boolean;
  onInscribirse: () => void;
}

function DemoFinishedPanel({ compact, onInscribirse }: DemoFinishedPanelProps) {
  return (
    <div
      className={`rounded-lg border p-5 md:p-6 ${compact ? "" : "lg:sticky lg:top-6"}`}
      style={{
        background: GM_SURFACE,
        borderColor: GM_BORDER,
        borderLeftWidth: 3,
        borderLeftColor: "rgba(201, 168, 76, 0.5)",
      }}
    >
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3"
        style={{ color: "rgba(201, 168, 76, 0.7)" }}
      >
        Mundo 1 completado
      </p>
      <h2
        className={`font-medium mb-2 leading-snug ${compact ? "text-lg" : "text-xl"}`}
        style={{ color: GM_TEXT, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        ¡Completaste el Mundo 1!
      </h2>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: GM_TEXT_SEC }}>
        Has terminado las 5 clases gratuitas. Elige un plan para continuar con
        el camino completo de la academia.
      </p>
      <Button
        onClick={onInscribirse}
        className="w-full font-medium min-h-[44px] tracking-wide"
        style={{ background: GM_GOLD, color: "#0A0A0A" }}
      >
        Elegir mi plan
      </Button>
    </div>
  );
}

interface PathDemoPageProps {
  setPage: (page: string) => void;
}

type ModalKind = "locked" | null;

export function PathDemoPage({ setPage }: PathDemoPageProps) {
  const { completedLessons, demoFinished } = useDemoProgress();

  const [modal, setModal] = useState<ModalKind>(null);
  const [lockedTitle, setLockedTitle] = useState<string | null>(null);

  const demoModules = useMemo(
    () => buildDemoModules(completedLessons),
    [completedLessons]
  );
  const progress = useMemo(() => countPathProgress(demoModules), [demoModules]);
  const allNodes = useMemo(() => demoModules.flatMap((mod) => mod.nodes), [demoModules]);

  const openNavPlaceholder = useCallback((key: string) => {
    if (isLockedNav(key)) setModal("locked");
  }, []);

  const handleViewPlans = useCallback(() => {
    navigateToHomeSection(setPage, "planes");
  }, [setPage]);

  const modalProps = () => {
    switch (modal) {
      case "locked":
        return {
          title: LOCKED_NAV_MODAL.title,
          subtitle: LOCKED_NAV_MODAL.subtitle,
          footer: LOCKED_NAV_MODAL.footer,
        };
      default:
        return { title: "" };
    }
  };

  const mp = modalProps();

  return (
    <div className="min-h-screen" style={{ background: GM_BG, color: GM_TEXT }}>
      <GmusicInternalHeader
        activeNav="camino"
        userName="Clase gratuita"
        userSubtitle="Sin cuenta · Fundamento"
        setPage={setPage}
        onPlaceholder={openNavPlaceholder}
      />

      <DemoAcademyNav
        activeTab="mi-camino"
        completedCount={completedLessons.length}
        onTabChange={(tab) => {
          if (tab === "inicio") setPage("home");
          if (tab === "mi-estudio") setPage("inscripcion-gate");
        }}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-12">
        <PathPageIntro
          badge={DEMO_BADGE}
          completedSteps={progress.completed}
          totalSteps={progress.total}
          isLoading={false}
        />

        {demoFinished ? (
          <div className="max-w-[600px] mx-auto">
            <DemoFinishedPanel onInscribirse={() => setPage("inscripcion-gate")} />
          </div>
        ) : (
          <>
            <div
              style={{
                textAlign: "center",
                padding: "32px 20px 8px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "Inter,sans-serif",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 8,
                }}
              >
                Tu camino musical · Fundamento
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28,
                  color: WHITE_WARM,
                  fontWeight: 400,
                }}
              >
                Clase {Math.min(completedLessons.length + 1, 5)} de 5
              </div>
            </div>

            <DemoPathCards
              nodes={allNodes}
              allowLockedSelection
              onStartLesson={(n) => setPage(`demo-clase-${n}`)}
              onLockedClick={(title) => setLockedTitle(title)}
            />
            {lockedTitle && (
              <div className="max-w-[600px] mx-auto mt-6">
                <LockedDemoNodePanel
                  title={lockedTitle}
                  onViewPlans={handleViewPlans}
                />
              </div>
            )}
          </>
        )}
      </main>

      <GmusicPlaceholderModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={mp.title}
        subtitle={mp.subtitle}
        footer={mp.footer}
      />
    </div>
  );
}
