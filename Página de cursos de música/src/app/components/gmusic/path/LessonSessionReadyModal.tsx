import { useEffect, useId } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/button";
import { GM_GOLD, GM_TEXT, GM_TEXT_SEC } from "../tokens";
import type { SessionReadyModalContent } from "./path-lesson-start";

export interface LessonSessionReadyModalProps {
  open: boolean;
  onClose: () => void;
  content: SessionReadyModalContent;
}

export function LessonSessionReadyModal({
  open,
  onClose,
  content,
}: LessonSessionReadyModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="rounded-lg p-8 border-2 max-w-md mx-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
          borderColor: GM_GOLD,
          backdropFilter: "blur(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <CheckCircle2 className="w-12 h-12 mx-auto" aria-hidden="true" style={{ color: GM_GOLD }} />
        </div>
        <h3 id={titleId} className="text-2xl font-semibold mb-2" style={{ color: GM_GOLD }}>
          {content.title}
        </h3>
        <p className="text-sm mb-4" style={{ color: GM_TEXT_SEC }}>
          {content.subtitle}
        </p>
        <p className="text-base font-medium mb-2" style={{ color: GM_TEXT }}>
          {content.exerciseCountLabel}
        </p>
        <p className="text-xs mb-6 font-mono tracking-wide" style={{ color: GM_TEXT_SEC }}>
          Sesión {content.sessionIdLabel}
        </p>
        <Button
          type="button"
          onClick={onClose}
          className="w-full font-medium min-h-[44px] tracking-wide"
          style={{ background: GM_GOLD, color: "#0A0A0A" }}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
