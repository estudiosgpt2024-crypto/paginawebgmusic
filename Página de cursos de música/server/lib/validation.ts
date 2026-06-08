import { ApiError } from "./errors.js";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const FORBIDDEN_COMPLETE_KEYS = ["isCorrect", "accuracy", "xpEarned"] as const;

export interface CompleteAttemptInput {
  microExerciseId: string;
  selectedAnswer: string;
  responseTimeMs: number;
}

export function parseSessionIdParam(sessionId: string): string {
  if (!UUID_RE.test(sessionId)) {
    throw new ApiError(400, "VALIDATION_ERROR", "sessionId debe ser un UUID válido.");
  }
  return sessionId;
}

export function parseLessonSessionBody(body: unknown): { nodeId: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "nodeId es requerido.");
  }

  const nodeId = (body as { nodeId?: unknown }).nodeId;

  if (typeof nodeId !== "string" || !UUID_RE.test(nodeId)) {
    throw new ApiError(400, "VALIDATION_ERROR", "nodeId debe ser un UUID válido.");
  }

  return { nodeId };
}

function rejectForbiddenFields(record: Record<string, unknown>, scope: string): void {
  for (const key of FORBIDDEN_COMPLETE_KEYS) {
    if (key in record) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        `Campo prohibido${scope}: ${key}.`
      );
    }
  }
}

export function parseCompleteSessionBody(body: unknown): CompleteAttemptInput[] {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Body inválido.");
  }

  const record = body as Record<string, unknown>;
  rejectForbiddenFields(record, "");

  const { attempts } = record;

  if (!Array.isArray(attempts) || attempts.length === 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "attempts debe ser un array no vacío.");
  }

  const seenExerciseIds = new Set<string>();
  const parsed: CompleteAttemptInput[] = [];

  for (const item of attempts) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Cada intento debe ser un objeto.");
    }

    const attempt = item as Record<string, unknown>;
    rejectForbiddenFields(attempt, " en intento");

    const microExerciseId = attempt.microExerciseId;
    const selectedAnswer = attempt.selectedAnswer;
    const responseTimeMs = attempt.responseTimeMs;

    if (typeof microExerciseId !== "string" || !UUID_RE.test(microExerciseId)) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "microExerciseId debe ser un UUID válido."
      );
    }

    if (typeof selectedAnswer !== "string" || selectedAnswer.trim().length === 0) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "selectedAnswer debe ser un string no vacío."
      );
    }

    if (
      typeof responseTimeMs !== "number" ||
      !Number.isInteger(responseTimeMs) ||
      responseTimeMs < 0
    ) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "responseTimeMs debe ser un entero mayor o igual a 0."
      );
    }

    if (seenExerciseIds.has(microExerciseId)) {
      throw new ApiError(400, "VALIDATION_ERROR", "microExerciseId duplicado en attempts.");
    }

    seenExerciseIds.add(microExerciseId);
    parsed.push({ microExerciseId, selectedAnswer, responseTimeMs });
  }

  return parsed;
}
