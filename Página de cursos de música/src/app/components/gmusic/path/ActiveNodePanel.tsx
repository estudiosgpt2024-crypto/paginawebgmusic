import { RefreshCw } from "lucide-react";
import { Button } from "../../ui/button";
import { GM_GOLD, GM_TEXT, GM_TEXT_SEC, GM_SURFACE, GM_BORDER } from "../tokens";

export interface ActiveNodePanelProps {
  compact?: boolean;
  eyebrow: string;
  title: string;
  typeLabel: string;
  description: string;
  onStartLesson: () => void;
  isLoading?: boolean;
  isStartingLesson?: boolean;
  startLessonDisabled?: boolean;
  sessionError?: string | null;
  onRetrySession?: () => void;
}

export function ActiveNodePanel({
  compact,
  eyebrow,
  title,
  typeLabel,
  description,
  onStartLesson,
  isLoading = false,
  isStartingLesson = false,
  startLessonDisabled = false,
  sessionError = null,
  onRetrySession,
}: ActiveNodePanelProps) {
  const buttonDisabled = isLoading || isStartingLesson || startLessonDisabled;
  const buttonLabel = isStartingLesson
    ? "Conectando…"
    : isLoading
      ? "Cargando…"
      : "Iniciar lección";
  return (
    <div
      className={`rounded-lg border p-5 md:p-6 ${compact ? "" : "lg:sticky lg:top-6"}`}
      style={{
        background: GM_SURFACE,
        borderColor: GM_BORDER,
        borderLeftWidth: 3,
        borderLeftColor: GM_GOLD,
      }}
    >
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3"
        style={{ color: "rgba(212, 175, 55, 0.65)" }}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-medium mb-2 leading-snug ${compact ? "text-lg" : "text-xl"}`}
        style={{ color: GM_TEXT, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      <p className="text-xs mb-4 tracking-wide" style={{ color: GM_GOLD }}>
        {typeLabel}
      </p>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: GM_TEXT_SEC }}>
        {description}
      </p>
      {sessionError && onRetrySession && (
        <div
          className="mb-4 rounded-lg border px-3 py-3 flex flex-col gap-2"
          style={{
            borderColor: "rgba(248, 113, 113, 0.25)",
            background: "rgba(40, 18, 18, 0.55)",
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: GM_TEXT_SEC }}>
            {sessionError}
          </p>
          <button
            type="button"
            onClick={onRetrySession}
            className="inline-flex items-center justify-center gap-1.5 self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#C9A84C]/20 cursor-pointer"
            style={{
              color: GM_GOLD,
              border: "1px solid rgba(201, 168, 76, 0.35)",
              background: "rgba(201, 168, 76, 0.08)",
            }}
          >
            <RefreshCw className="w-3 h-3" />
            Reintentar
          </button>
        </div>
      )}
      <Button
        onClick={onStartLesson}
        disabled={buttonDisabled}
        className="w-full font-medium min-h-[44px] tracking-wide disabled:opacity-55"
        style={{ background: GM_GOLD, color: "#0A0A0A" }}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
