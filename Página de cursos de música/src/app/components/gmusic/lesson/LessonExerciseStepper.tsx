import { useId } from "react";
import { GM_GOLD, GM_GOLD_MATT, GM_TEXT, GM_TEXT_SEC } from "../tokens";

export interface LessonExerciseStepperProps {
  currentIndex: number;
  total: number;
}

export interface NormalizedStepperValues {
  currentIndex: number;
  total: number;
  displayIndex: number;
  progressPercent: number;
}

export function normalizeStepperValues(
  currentIndex: number,
  total: number
): NormalizedStepperValues {
  const safeTotal =
    Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;

  if (safeTotal === 0) {
    return {
      currentIndex: 0,
      total: 0,
      displayIndex: 0,
      progressPercent: 0,
    };
  }

  const safeCurrent = Number.isFinite(currentIndex) ? Math.floor(currentIndex) : 0;
  const clampedIndex = Math.min(Math.max(0, safeCurrent), safeTotal - 1);
  const displayIndex = clampedIndex + 1;
  const progressPercent = Math.round((displayIndex / safeTotal) * 100);

  return {
    currentIndex: clampedIndex,
    total: safeTotal,
    displayIndex,
    progressPercent,
  };
}

export function LessonExerciseStepper({ currentIndex, total }: LessonExerciseStepperProps) {
  const labelId = useId();
  const progressId = useId();
  const { displayIndex, total: safeTotal, progressPercent } = normalizeStepperValues(
    currentIndex,
    total
  );

  const label =
    safeTotal === 0
      ? "Sin ejercicios"
      : `Ejercicio ${displayIndex} de ${safeTotal}`;

  return (
    <div className="w-full" aria-labelledby={labelId}>
      <div className="flex items-center justify-between gap-3 mb-2 min-h-[1.25rem]">
        <p
          id={labelId}
          className="text-xs font-medium tracking-wide"
          style={{ color: GM_TEXT_SEC }}
          aria-current={safeTotal > 0 ? "step" : undefined}
        >
          {label}
        </p>
        {safeTotal > 0 ? (
          <span className="text-xs tabular-nums" style={{ color: GM_GOLD }} aria-hidden="true">
            {progressPercent}%
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        id={progressId}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: GM_GOLD_MATT }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-200 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: GM_GOLD,
            minWidth: progressPercent > 0 ? "0.5rem" : 0,
          }}
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
