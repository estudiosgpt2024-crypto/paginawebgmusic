import { useCallback, useMemo, useState } from "react";
import { GmusicInternalHeader, isLockedNav, LOCKED_NAV_MODAL } from "../components/gmusic/GmusicInternalHeader";
import { GmusicPlaceholderModal } from "../components/gmusic/GmusicPlaceholderModal";
import { PathPageIntro } from "../components/gmusic/path/PathPageIntro";
import { SerpentinePathMap } from "../components/gmusic/path/SerpentinePathMap";
import { ActiveNodePanel } from "../components/gmusic/path/ActiveNodePanel";
import { Button } from "../components/ui/button";
import { PATH_MODULES } from "../data/gmusic-path-data";
import type { NodeStatus, PathModuleData, PathNodeData } from "../data/gmusic-path-types";
import { countPathProgress } from "../data/gmusic-path-types";
import { GM_BG, GM_BORDER, GM_GOLD, GM_SURFACE, GM_TEXT, GM_TEXT_SEC } from "../components/gmusic/tokens";
import { navigateToHomeSection } from "../utils/public-home-navigation";
import { PUBLIC_FREE_LESSON_PAGE } from "../utils/academia-track-matrix";

export const DEMO_PATH_NODE_ID = "demo-n1";

const DEMO_BADGE = {
  instrument: "Guitarra",
  month: "Mes 1",
  level: "Fundamento",
} as const;

export function buildDemoModules(source: PathModuleData[]): PathModuleData[] {
  let firstNodeSeen = false;

  return source.map((mod) => ({
    ...mod,
    nodes: mod.nodes.map((node) => {
      if (!firstNodeSeen) {
        firstNodeSeen = true;
        return {
          ...node,
          id: DEMO_PATH_NODE_ID,
          status: "active" as NodeStatus,
          title: "Tu guitarra y postura",
          typeLabel: "Lección · 7 min",
          description:
            "Aprende la postura correcta y el primer contacto con la guitarra. Sin requisitos previos.",
        };
      }

      return { ...node, status: "locked" as NodeStatus };
    }),
  }));
}

function findDemoNodeById(modules: PathModuleData[], nodeId: string | null): PathNodeData | null {
  if (!nodeId) return null;

  for (const mod of modules) {
    const node = mod.nodes.find((entry) => entry.id === nodeId);
    if (node) return node;
  }

  return null;
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
        Esta clase está disponible con el plan Semestral de Gmusic Estudio.
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

interface PathDemoPageProps {
  setPage: (page: string) => void;
}

type ModalKind = "leveling" | "locked" | null;

export function PathDemoPage({ setPage }: PathDemoPageProps) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(DEMO_PATH_NODE_ID);

  const demoModules = useMemo(() => buildDemoModules(PATH_MODULES), []);
  const progress = useMemo(() => countPathProgress(demoModules), [demoModules]);
  const selectedNode = findDemoNodeById(demoModules, selectedNodeId);
  const isDemoNode = selectedNode?.id === DEMO_PATH_NODE_ID;

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
    if (!selectedNode) {
      return (
        <ActiveNodePanel
          compact={compact}
          eyebrow="Clase gratuita"
          title="Tu guitarra y postura"
          typeLabel="Lección · 7 min"
          description="Aprende la postura correcta y el primer contacto con la guitarra."
          onStartLesson={() => setPage(PUBLIC_FREE_LESSON_PAGE)}
          startLessonDisabled={false}
        />
      );
    }

    if (isDemoNode) {
      return (
        <ActiveNodePanel
          compact={compact}
          eyebrow="Clase gratuita"
          title="Tu guitarra y postura"
          typeLabel="Lección · 7 min"
          description="Aprende la postura correcta y el primer contacto con la guitarra."
          onStartLesson={() => setPage(PUBLIC_FREE_LESSON_PAGE)}
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
          completedSteps={0}
          totalSteps={progress.total}
          isLoading={false}
        />

        <div className="lg:hidden mb-6">{renderSidePanel(true)}</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <SerpentinePathMap
              modules={demoModules}
              activeNodeId={DEMO_PATH_NODE_ID}
              selectedNodeId={selectedNodeId}
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
