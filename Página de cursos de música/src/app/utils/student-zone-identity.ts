import type { PathBadgeData } from "../data/gmusic-path-types";

export const NEUTRAL_STUDENT_NAME = "Alumno Gmusic";

export function resolveStudentDisplayName(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed || trimmed === "…") {
    return NEUTRAL_STUDENT_NAME;
  }

  return trimmed;
}

export function deriveStudentInitials(name: string): string {
  const displayName = resolveStudentDisplayName(name);
  if (displayName === NEUTRAL_STUDENT_NAME) {
    return "AG";
  }

  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}

export function deriveWelcomeHeaderSubtitle(
  phaseLabel: string | null | undefined,
  isLoading: boolean
): string {
  if (isLoading) {
    return "Conectando con tu estudio";
  }

  const trimmed = phaseLabel?.trim();
  return trimmed && trimmed !== "…" ? trimmed : "Tu progreso musical";
}

export function derivePathHeaderIdentity(
  badge: PathBadgeData | null | undefined,
  isLoading: boolean
): { userName: string; userSubtitle: string } {
  if (isLoading || !badge) {
    return {
      userName: NEUTRAL_STUDENT_NAME,
      userSubtitle: "Tu camino musical",
    };
  }

  const instrument = badge.instrument.trim();
  const level = badge.level.trim();
  const hasBadge = instrument !== "…" && level !== "…";

  return {
    userName: NEUTRAL_STUDENT_NAME,
    userSubtitle: hasBadge ? `${instrument} · ${level}` : "Tu camino musical",
  };
}
