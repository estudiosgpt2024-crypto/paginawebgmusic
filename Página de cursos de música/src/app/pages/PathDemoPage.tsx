import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
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
const EDU_SUCCESS = "var(--edu-success)";

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
  title: string;
  onViewPlans: () => void;
}

function LockedDemoNodePanel({ title, onViewPlans }: LockedDemoNodePanelProps) {
  return (
    <div
      className="rounded-lg border p-5 md:p-6"
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
        className="text-xl font-medium mb-2 leading-snug"
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

interface DemoFinishedCelebrationProps {
  onInscribirse: () => void;
}

function DemoFinishedCelebration({ onInscribirse }: DemoFinishedCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 36px", padding: "0 12px" }}
    >
      <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2px solid ${EDU_SUCCESS}`,
            background: "rgba(88,204,2,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <CheckCircle size={28} color={EDU_SUCCESS} strokeWidth={2} />
        </div>
      </div>

      <p
        style={{
          margin: "0 0 10px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: EDU_SUCCESS,
          fontFamily: "Inter, sans-serif",
        }}
      >
        5 de 5 · Camino completado
      </p>

      <h1
        style={{
          margin: "0 0 12px",
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 5vw, 36px)",
          fontWeight: 400,
          lineHeight: 1.15,
          color: WHITE_WARM,
        }}
      >
        Completaste tu primer camino en Gmusic
      </h1>

      <p
        style={{
          margin: "0 0 24px",
          fontSize: 15,
          lineHeight: 1.65,
          color: GM_TEXT_SEC,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Terminaste el Mundo 1: Fundamentos de la guitarra. Elige un plan para continuar con el
        camino completo de la academia.
      </p>

      <Button
        onClick={onInscribirse}
        className="font-medium min-h-[48px] tracking-wide px-8"
        style={{
          background: GM_GOLD,
          color: "#0A0A0A",
          fontSize: 12,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Elegir mi plan
      </Button>
    </motion.div>
  );
}

interface PathDemoPageProps {
  setPage: (page: string) => void;
}

export function PathDemoPage({ setPage }: PathDemoPageProps) {
  const { completedLessons, demoFinished } = useDemoProgress();

  const [lockedTitle, setLockedTitle] = useState<string | null>(null);

  const demoModules = useMemo(
    () => buildDemoModules(completedLessons),
    [completedLessons]
  );
  const progress = useMemo(() => countPathProgress(demoModules), [demoModules]);
  const allNodes = useMemo(() => demoModules.flatMap((mod) => mod.nodes), [demoModules]);

  const handleViewPlans = useCallback(() => {
    navigateToHomeSection(setPage, "planes");
  }, [setPage]);

  const handleTabChange = useCallback(
    (tab: "inicio" | "mi-camino" | "mi-estudio" | "mi-progreso") => {
      if (tab === "inicio") setPage("home");
      if (tab === "mi-estudio") setPage("inscripcion-gate");
    },
    [setPage]
  );

  return (
    <div className="min-h-screen" style={{ background: GM_BG, color: GM_TEXT }}>
      <DemoAcademyNav
        activeTab="mi-camino"
        completedCount={completedLessons.length}
        onTabChange={handleTabChange}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-10">
        {demoFinished ? (
          <>
            <DemoFinishedCelebration onInscribirse={() => setPage("inscripcion-gate")} />

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Tu recorrido completado
              </p>
            </div>

            <DemoPathCards
              nodes={allNodes}
              allowLockedSelection={false}
              onStartLesson={(n) => setPage(`demo-clase-${n}`)}
              onLockedClick={() => {}}
            />
          </>
        ) : (
          <>
            <PathPageIntro
              badge={DEMO_BADGE}
              completedSteps={progress.completed}
              totalSteps={progress.total}
              isLoading={false}
            />

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
                <LockedDemoNodePanel title={lockedTitle} onViewPlans={handleViewPlans} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
