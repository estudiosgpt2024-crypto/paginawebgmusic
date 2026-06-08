import type { CompleteAttemptInput } from "../../lib/validation.js";

export function buildAttemptsPayload(
  exercises: Array<{ id: string; secureAnswer: unknown }>,
  mode: "all-correct" | "all-wrong" | "partial-pass"
): CompleteAttemptInput[] {
  if (mode === "all-wrong") {
    return exercises.map((exercise) => ({
      microExerciseId: exercise.id,
      selectedAnswer: "__wrong__",
      responseTimeMs: 1000,
    }));
  }

  if (mode === "partial-pass" && exercises.length >= 2) {
    return exercises.map((exercise, index) => {
      const secureAnswer = exercise.secureAnswer as { correctOptionId?: string };
      const correct = secureAnswer.correctOptionId ?? "";
      return {
        microExerciseId: exercise.id,
        selectedAnswer: index === 0 ? correct : "__wrong__",
        responseTimeMs: 1000,
      };
    });
  }

  return exercises.map((exercise) => {
    const secureAnswer = exercise.secureAnswer as { correctOptionId?: string };
    return {
      microExerciseId: exercise.id,
      selectedAnswer: secureAnswer.correctOptionId ?? "",
      responseTimeMs: 1000,
    };
  });
}
