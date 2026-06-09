import { AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";
import { GM_GOLD, GM_GOLD_MATT, GM_TEXT, GM_TEXT_SEC } from "../tokens";

export interface UnsupportedExercisePanelProps {
  reason?: string;
  exerciseId?: string;
  onExit: () => void;
}

export function UnsupportedExercisePanel({
  reason,
  exerciseId,
  onExit,
}: UnsupportedExercisePanelProps) {
  const message =
    typeof reason === "string" && reason.trim().length > 0
      ? reason.trim()
      : "Este ejercicio no es compatible con el formato actual.";

  return (
    <div
      className="rounded-lg border p-6 text-center"
      role="alert"
      style={{
        borderColor: GM_GOLD_MATT,
        background: "rgba(212, 175, 55, 0.06)",
      }}
    >
      <AlertTriangle
        className="w-10 h-10 mx-auto mb-4"
        aria-hidden="true"
        style={{ color: GM_GOLD }}
      />
      <h3 className="text-lg font-medium mb-2" style={{ color: GM_TEXT }}>
        Ejercicio no disponible
      </h3>
      <p className="text-sm mb-2" style={{ color: GM_TEXT_SEC }}>
        {message}
      </p>
      {exerciseId ? (
        <p className="text-xs font-mono mb-6 tracking-wide" style={{ color: GM_TEXT_SEC }}>
          Ref. {exerciseId}
        </p>
      ) : (
        <div className="mb-6" />
      )}
      <Button
        type="button"
        onClick={onExit}
        className="w-full font-medium min-h-[44px] tracking-wide"
        style={{ background: GM_GOLD, color: "#0A0A0A" }}
      >
        Salir
      </Button>
    </div>
  );
}
