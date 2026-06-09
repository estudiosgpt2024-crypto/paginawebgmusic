import type { PathNodeData } from "../../../data/gmusic-path-types";
import type { LessonSessionStartResult } from "../../../services/gmusic-api/types";

export function canStartLessonFromNode(node: Pick<PathNodeData, "status"> | null): boolean {
  if (!node) return false;
  return node.status === "active" || node.status === "available";
}

export function abbreviateSessionId(sessionId: string): string {
  const trimmed = sessionId.trim();
  if (trimmed.length <= 12) return trimmed;
  return `${trimmed.slice(0, 8)}…${trimmed.slice(-4)}`;
}

export interface SessionReadyModalContent {
  title: string;
  subtitle: string;
  exerciseCountLabel: string;
  sessionIdLabel: string;
}

export function buildSessionReadyModalContent(
  result: LessonSessionStartResult
): SessionReadyModalContent {
  const count = result.session.exercises.length;
  return {
    title: "Sesión lista",
    subtitle:
      result.kind === "created"
        ? "Tu práctica está preparada."
        : "Retomamos tu sesión activa.",
    exerciseCountLabel: count === 1 ? "1 ejercicio" : `${count} ejercicios`,
    sessionIdLabel: abbreviateSessionId(result.session.sessionId),
  };
}
