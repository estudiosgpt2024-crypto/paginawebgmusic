import { findForbiddenLessonSessionKey } from "../../../services/gmusic-api/assert-safe-lesson-session";
import { GmusicApiError } from "../../../services/gmusic-api/client";
import type { LessonSessionResponse } from "../../../services/gmusic-api/types";
import { parsePublicExercise } from "./parse-exercise-payload";
import type { ParsedExerciseView } from "./lesson-runner-types";

export type PrepareLessonRunnerResult =
  | { kind: "supported"; exercises: ParsedExerciseView[] }
  | { kind: "incompatible"; exerciseId: string; reason: string };

function assertExerciseIsSafe(exercise: LessonSessionResponse["exercises"][number]): void {
  const forbiddenKey = findForbiddenLessonSessionKey(exercise);
  if (forbiddenKey) {
    throw new GmusicApiError(
      `El ejercicio contiene el campo prohibido "${forbiddenKey}".`,
      200,
      "UNSAFE_API_RESPONSE"
    );
  }
}

export function prepareLessonRunner(
  session: LessonSessionResponse
): PrepareLessonRunnerResult {
  for (const exercise of session.exercises) {
    assertExerciseIsSafe(exercise);
  }

  const parsedExercises: ParsedExerciseView[] = [];
  let firstIncompatible: { exerciseId: string; reason: string } | null = null;

  for (const exercise of session.exercises) {
    const result = parsePublicExercise(exercise);

    if (result.kind === "incompatible") {
      firstIncompatible ??= {
        exerciseId: result.exerciseId,
        reason: result.reason,
      };
      continue;
    }

    parsedExercises.push(result.exercise);
  }

  if (firstIncompatible) {
    return {
      kind: "incompatible",
      exerciseId: firstIncompatible.exerciseId,
      reason: firstIncompatible.reason,
    };
  }

  return {
    kind: "supported",
    exercises: parsedExercises,
  };
}
