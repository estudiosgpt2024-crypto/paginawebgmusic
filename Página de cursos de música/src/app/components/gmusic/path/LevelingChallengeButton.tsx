import { GM_TEXT_SEC, GM_BORDER } from "../tokens";

interface LevelingChallengeButtonProps {
  onClick: () => void;
}

export function LevelingChallengeButton({ onClick }: LevelingChallengeButtonProps) {
  return (
    <div className="mt-10 pt-8 border-t" style={{ borderColor: GM_BORDER }}>
      <p className="text-xs mb-3 leading-relaxed text-center max-w-sm mx-auto" style={{ color: GM_TEXT_SEC }}>
        Cuando completes el módulo, podrás evaluar si estás listo para avanzar con mayor exigencia.
      </p>
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-lg border px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 min-h-[44px] tracking-wide"
        style={{
          borderColor: "rgba(212, 175, 55, 0.25)",
          color: "rgba(212, 175, 55, 0.85)",
          background: "transparent",
        }}
      >
        Evaluar dominio del módulo
      </button>
    </div>
  );
}
