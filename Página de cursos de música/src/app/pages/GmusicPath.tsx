import { useState, useCallback } from "react";
import { GmusicInternalHeader, isLockedNav, LOCKED_NAV_MODAL } from "../components/gmusic/GmusicInternalHeader";
import { GmusicPlaceholderModal } from "../components/gmusic/GmusicPlaceholderModal";
import { PathPageIntro } from "../components/gmusic/path/PathPageIntro";
import { SerpentinePathMap } from "../components/gmusic/path/SerpentinePathMap";
import { ActiveNodePanel } from "../components/gmusic/path/ActiveNodePanel";
import { GM_BG, GM_TEXT } from "../components/gmusic/tokens";

interface GmusicPathProps {
  setPage: (page: string) => void;
}

type ModalKind = "lesson" | "leveling" | "locked" | null;

export function GmusicPath({ setPage }: GmusicPathProps) {
  const [modal, setModal] = useState<ModalKind>(null);

  const openNavPlaceholder = useCallback((key: string) => {
    if (isLockedNav(key)) setModal("locked");
  }, []);

  const modalProps = () => {
    switch (modal) {
      case "lesson":
        return {
          title: "Próximamente — lección interactiva",
          subtitle: "Esta lección estará disponible en la siguiente fase del camino.",
        };
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

  return (
    <div className="min-h-screen" style={{ background: GM_BG, color: GM_TEXT }}>
      <GmusicInternalHeader
        activeNav="camino"
        setPage={setPage}
        onPlaceholder={openNavPlaceholder}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-12">
        <PathPageIntro />

        {/* Mobile: panel activo antes del mapa */}
        <div className="lg:hidden mb-6">
          <ActiveNodePanel compact onStartLesson={() => setModal("lesson")} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <SerpentinePathMap
              onLevelingChallenge={() => setModal("leveling")}
              onNodeSelect={(node) => {
                if (node.status === "completed") return;
              }}
            />
          </div>

          <div className="hidden lg:block lg:col-span-5">
            <ActiveNodePanel onStartLesson={() => setModal("lesson")} />
          </div>
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
