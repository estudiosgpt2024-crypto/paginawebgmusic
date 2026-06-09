import type { SafeExerciseMedia } from "./lesson-runner-types";
import { GM_GOLD, GM_GOLD_MATT, GM_SURFACE_ALT, GM_TEXT, GM_TEXT_SEC } from "../tokens";

export interface ExerciseMediaBlockProps {
  media: SafeExerciseMedia;
}

export function isSafeExerciseMediaUrl(url: string | undefined): boolean {
  if (typeof url !== "string" || url.trim().length === 0) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ExerciseMediaBlock({ media }: ExerciseMediaBlockProps) {
  const hasAudio = isSafeExerciseMediaUrl(media.audioUrl);
  const hasImage = isSafeExerciseMediaUrl(media.imageUrl);
  const diagramLabel =
    typeof media.diagramLabel === "string" && media.diagramLabel.trim().length > 0
      ? media.diagramLabel.trim()
      : null;
  const patternBeats = Array.isArray(media.patternBeats)
    ? media.patternBeats.filter(
        (beat): beat is string => typeof beat === "string" && beat.trim().length > 0
      )
    : [];

  if (!hasAudio && !hasImage && !diagramLabel && patternBeats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {hasImage ? (
        <div
          className="w-full overflow-hidden rounded-lg border"
          style={{
            borderColor: GM_GOLD_MATT,
            background: GM_SURFACE_ALT,
            aspectRatio: "16 / 9",
            minHeight: "8rem",
          }}
        >
          <img
            src={media.imageUrl}
            alt="Ilustración del ejercicio"
            className="h-full w-full object-contain"
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      {hasAudio ? (
        <audio
          controls
          preload="none"
          className="w-full max-w-full"
          src={media.audioUrl}
        >
          Tu navegador no soporta reproducción de audio.
        </audio>
      ) : null}

      {diagramLabel ? (
        <p
          className="text-sm font-medium tracking-wide rounded-md px-3 py-2 border inline-block"
          style={{
            color: GM_GOLD,
            borderColor: GM_GOLD_MATT,
            background: GM_SURFACE_ALT,
          }}
        >
          {diagramLabel}
        </p>
      ) : null}

      {patternBeats.length > 0 ? (
        <div
          role="group"
          aria-label="Patrón rítmico"
          className="flex flex-wrap gap-2"
        >
          {patternBeats.map((beat, index) => (
            <span
              key={`${beat}-${index}`}
              className="inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-md border text-sm font-medium tabular-nums"
              style={{
                color: GM_TEXT,
                borderColor: GM_GOLD_MATT,
                background: GM_SURFACE_ALT,
              }}
            >
              {beat}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
