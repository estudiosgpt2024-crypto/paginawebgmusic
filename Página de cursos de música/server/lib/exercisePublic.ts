import type { ExerciseType, Prisma } from "@prisma/client";

/** Campos públicos de MicroExercise — nunca incluir secureAnswer. */
export const PUBLIC_EXERCISE_SELECT = {
  id: true,
  type: true,
  difficulty: true,
  instruction: true,
  contentPayload: true,
  order: true,
} as const satisfies Prisma.MicroExerciseSelect;

export type PublicExerciseRow = {
  id: string;
  type: ExerciseType;
  difficulty: number;
  instruction: string;
  contentPayload: Prisma.JsonValue;
  order: number;
};

const FORBIDDEN_PAYLOAD_KEYS = new Set(["correctOptionId", "explanationAfterAnswer"]);

export function sanitizeContentPayload(payload: Prisma.JsonValue): Prisma.JsonValue {
  if (payload === null || typeof payload !== "object") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeContentPayload(item));
  }

  const source = payload as Record<string, Prisma.JsonValue>;
  const sanitized: Record<string, Prisma.JsonValue> = {};

  for (const [key, value] of Object.entries(source)) {
    if (FORBIDDEN_PAYLOAD_KEYS.has(key)) {
      continue;
    }

    sanitized[key] =
      value !== null && typeof value === "object"
        ? sanitizeContentPayload(value)
        : value;
  }

  return sanitized;
}

export function toPublicExercise(exercise: PublicExerciseRow) {
  return {
    id: exercise.id,
    type: exercise.type,
    difficulty: exercise.difficulty,
    instruction: exercise.instruction,
    contentPayload: sanitizeContentPayload(exercise.contentPayload),
  };
}

export function assertResponseHasNoSecrets(payload: unknown): void {
  const json = JSON.stringify(payload);
  if (
    json.includes("secureAnswer") ||
    json.includes("correctOptionId") ||
    json.includes("explanationAfterAnswer")
  ) {
    throw new Error("La respuesta contiene campos secretos.");
  }
}
