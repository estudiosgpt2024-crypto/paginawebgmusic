import type { Prisma } from "@prisma/client";

export function isAnswerCorrect(
  secureAnswer: Prisma.JsonValue,
  selectedAnswer: string
): boolean {
  if (!secureAnswer || typeof secureAnswer !== "object" || Array.isArray(secureAnswer)) {
    return false;
  }

  const correctOptionId = (secureAnswer as { correctOptionId?: unknown }).correctOptionId;
  return typeof correctOptionId === "string" && correctOptionId === selectedAnswer;
}
