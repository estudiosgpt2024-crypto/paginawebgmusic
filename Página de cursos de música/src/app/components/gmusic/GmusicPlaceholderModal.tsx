import { Lock } from "lucide-react";
import { GM_GOLD, GM_TEXT, GM_TEXT_SEC } from "./tokens";

interface GmusicPlaceholderModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  stage?: string;
  footer?: string;
}

export function GmusicPlaceholderModal({
  open,
  onClose,
  title,
  subtitle,
  stage,
  footer = "Continúa en tu camino actual mientras trabajamos en nuevas funcionalidades.",
}: GmusicPlaceholderModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="rounded-lg p-8 border-2 max-w-md mx-4 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
          borderColor: GM_GOLD,
          backdropFilter: "blur(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <Lock className="w-12 h-12 mx-auto" style={{ color: GM_GOLD }} />
        </div>
        <h3 className="text-2xl font-semibold mb-2" style={{ color: GM_GOLD }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm mb-4" style={{ color: GM_TEXT_SEC }}>
            {subtitle}
          </p>
        )}
        {stage && !subtitle && (
          <>
            <p className="text-sm mb-1" style={{ color: GM_TEXT_SEC }}>
              Esta funcionalidad estará disponible en:
            </p>
            <p className="text-lg font-medium mb-6" style={{ color: GM_TEXT }}>
              {stage}
            </p>
          </>
        )}
        {stage && subtitle && (
          <p className="text-lg font-medium mb-6" style={{ color: GM_TEXT }}>
            {stage}
          </p>
        )}
        {!stage && !subtitle && <div className="mb-4" />}
        <p className="text-xs italic" style={{ color: "#777" }}>
          {footer}
        </p>
      </div>
    </div>
  );
}
