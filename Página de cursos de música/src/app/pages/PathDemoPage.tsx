import { useCallback, useMemo, useState } from "react";
import { GmusicInternalHeader, isLockedNav, LOCKED_NAV_MODAL } from "../components/gmusic/GmusicInternalHeader";
import { GmusicPlaceholderModal } from "../components/gmusic/GmusicPlaceholderModal";
import { PathPageIntro } from "../components/gmusic/path/PathPageIntro";
import { SerpentinePathMap } from "../components/gmusic/path/SerpentinePathMap";
import { ActiveNodePanel } from "../components/gmusic/path/ActiveNodePanel";
import { Button } from "../components/ui/button";
import { DEMO_LESSONS } from "../data/demo-lessons";
import { useDemoProgress } from "../hooks/useDemoProgress";
import type { PathModuleData, PathNodeData, PathLane } from "../data/gmusic-path-types";
import { countPathProgress } from "../data/gmusic-path-types";
import { GM_BG, GM_BORDER, GM_GOLD, GM_SURFACE, GM_TEXT, GM_TEXT_SEC } from "../components/gmusic/tokens";
import { navigateToHomeSection } from "../utils/public-home-navigation";

export const DEMO_PATH_NODE_ID = "demo-node-1";

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

function getLessonNumberFromNodeId(nodeId: string | null): number | null {
  if (!nodeId) return null;
  const match = /^demo-node-(\d)$/.exec(nodeId);
  return match && match[1] ? parseInt(match[1], 10) : null;
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

interface CompletedDemoNodePanelProps {
  compact?: boolean;
  lessonNumber: number;
  title: string;
  onGoToNext: () => void;
}

function CompletedDemoNodePanel({
  compact,
  lessonNumber,
  title,
  onGoToNext,
}: CompletedDemoNodePanelProps) {
  return (
    <div
      className={`rounded-lg border p-5 md:p-6 ${compact ? "" : "lg:sticky lg:top-6"}`}
      style={{
        background: GM_SURFACE,
        borderColor: GM_BORDER,
        borderLeftWidth: 3,
        borderLeftColor: "rgba(88, 204, 2, 0.35)",
      }}
    >
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3"
        style={{ color: "rgba(88, 204, 2, 0.65)" }}
      >
        Completada · Clase {lessonNumber} de 5
      </p>
      <h2
        className={`font-medium mb-2 leading-snug ${compact ? "text-lg" : "text-xl"}`}
        style={{ color: GM_TEXT, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: GM_TEXT_SEC }}>
        ¡Clase superada! Continúa con la siguiente para avanzar en tu camino.
      </p>
      <Button
        onClick={onGoToNext}
        className="w-full font-medium min-h-[44px] tracking-wide"
        style={{ background: GM_GOLD, color: "#0A0A0A" }}
      >
        Continuar al mapa
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

type ModalKind = "leveling" | "locked" | null;

export function PathDemoPage({ setPage }: PathDemoPageProps) {
  const { completedLessons, demoFinished, nextLessonNumber } = useDemoProgress();

  const activeNodeId = demoFinished ? null : `demo-node-${nextLessonNumber}`;
  const [modal, setModal] = useState<ModalKind>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => activeNodeId);

  const demoModules = useMemo(
    () => buildDemoModules(completedLessons),
    [completedLessons]
  );
  const progress = useMemo(() => countPathProgress(demoModules), [demoModules]);

  const selectedNode = useMemo((): PathNodeData | null => {
    if (!selectedNodeId) return null;
    for (const mod of demoModules) {
      const node = mod.nodes.find((n) => n.id === selectedNodeId);
      if (node) return node;
    }
    return null;
  }, [demoModules, selectedNodeId]);

  const openNavPlaceholder = useCallback((key: string) => {
    if (isLockedNav(key)) setModal("locked");
  }, []);

  const handleNodeSelect = useCallback((node: PathNodeData) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleViewPlans = useCallback(() => {
    navigateToHomeSection(setPage, "planes");
  }, [setPage]);

  const modalProps = () => {
    switch (modal) {
      case "leveling":
        return {
          title: "Próximamente — evaluación de módulo",
          subtitle: "Esta prueba estará disponible cuando activemos la validación interactiva.",
        };
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

  const renderSidePanel = (compact?: boolean) => {
    if (demoFinished) {
      return (
        <DemoFinishedPanel
          compact={compact}
          onInscribirse={() => setPage("inscripcion-gate")}
        />
      );
    }

    if (!selectedNode) {
      const firstLesson = DEMO_LESSONS[0];
      return (
        <ActiveNodePanel
          compact={compact}
          eyebrow="Clase gratuita · 1 de 5"
          title={firstLesson?.title ?? ""}
          typeLabel={`Lección · ${firstLesson?.videoDuration ?? ""}`}
          description={firstLesson?.objective ?? ""}
          onStartLesson={() => setPage("demo-clase-1")}
          startLessonDisabled={false}
        />
      );
    }

    const lessonNumber = getLessonNumberFromNodeId(selectedNode.id);
    const lesson = lessonNumber ? DEMO_LESSONS[lessonNumber - 1] : null;

    if (selectedNode.status === "completed" && lessonNumber) {
      return (
        <CompletedDemoNodePanel
          compact={compact}
          lessonNumber={lessonNumber}
          title={selectedNode.title}
          onGoToNext={() => setSelectedNodeId(activeNodeId)}
        />
      );
    }

    if (selectedNode.status === "active" && lessonNumber && lesson) {
      return (
        <ActiveNodePanel
          compact={compact}
          eyebrow={`Clase gratuita · ${lessonNumber} de 5`}
          title={lesson.title}
          typeLabel={`Lección · ${lesson.videoDuration}`}
          description={lesson.objective}
          onStartLesson={() => setPage(`demo-clase-${lessonNumber}`)}
          startLessonDisabled={false}
        />
      );
    }

    return (
      <LockedDemoNodePanel
        compact={compact}
        title={selectedNode.title}
        onViewPlans={handleViewPlans}
      />
    );
  };

  return (
    <div className="min-h-screen" style={{ background: GM_BG, color: GM_TEXT }}>
      <GmusicInternalHeader
        activeNav="camino"
        userName="Clase gratuita"
        userSubtitle="Sin cuenta · Fundamento"
        setPage={setPage}
        onPlaceholder={openNavPlaceholder}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-12">
        <PathPageIntro
          badge={DEMO_BADGE}
          completedSteps={progress.completed}
          totalSteps={progress.total}
          isLoading={false}
        />

        <div className="lg:hidden mb-6">{renderSidePanel(true)}</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <SerpentinePathMap
              modules={demoModules}
              activeNodeId={activeNodeId ?? ""}
              selectedNodeId={selectedNodeId ?? ""}
              onLevelingChallenge={() => setModal("leveling")}
              onNodeSelect={handleNodeSelect}
              allowLockedSelection
            />
          </div>

          <div className="hidden lg:block lg:col-span-5">{renderSidePanel()}</div>
        </div>
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
