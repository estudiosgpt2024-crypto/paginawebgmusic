import { SessionStatus, type User } from "@prisma/client";
import { isAnswerCorrect } from "../lib/answerValidation.js";
import {
  acquireSessionCompleteAdvisoryLock,
} from "../lib/advisoryLock.js";
import { ApiError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { isSessionExpired } from "../lib/sessionTtl.js";
import {
  formatDateInTimezone,
  getYesterdayDateInTimezone,
} from "../lib/timezone.js";
import {
  parseCompleteSessionBody,
  parseSessionIdParam,
  type CompleteAttemptInput,
} from "../lib/validation.js";

export interface AttemptSummary {
  microExerciseId: string;
  isCorrect: boolean;
  selectedAnswer: string;
}

export interface CompleteLessonSessionResponse {
  sessionId: string;
  status: "COMPLETED";
  alreadyProcessed: boolean;
  accuracy: number;
  xpEarned: number;
  streakUpdated: boolean;
  currentStreak: number;
  nodeCompleted: boolean;
  completedAt: string;
  attemptsSummary?: AttemptSummary[];
}

type TransactionResult =
  | { kind: "completed"; response: CompleteLessonSessionResponse }
  | { kind: "expired" }
  | { kind: "not_startable" };

export async function completeLessonSession(
  student: User,
  sessionIdParam: string,
  body: unknown
): Promise<CompleteLessonSessionResponse> {
  const sessionId = parseSessionIdParam(sessionIdParam);
  const attempts = parseCompleteSessionBody(body);

  const preliminary = await prisma.lessonSession.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true },
  });

  if (!preliminary) {
    throw new ApiError(404, "SESSION_NOT_FOUND", "Sesión no encontrada.");
  }

  if (preliminary.userId !== student.id) {
    throw new ApiError(403, "FORBIDDEN", "No puedes cerrar una sesión de otro alumno.");
  }

  const result = await prisma.$transaction(async (tx) => {
    await acquireSessionCompleteAdvisoryLock(tx, sessionId);

    const session = await tx.lessonSession.findUnique({
      where: { id: sessionId },
      include: {
        attempts: {
          select: {
            microExerciseId: true,
            isCorrect: true,
            selectedAnswer: true,
          },
        },
        node: {
          include: {
            exercises: {
              select: {
                id: true,
                secureAnswer: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new ApiError(404, "SESSION_NOT_FOUND", "Sesión no encontrada.");
    }

    if (session.userId !== student.id) {
      throw new ApiError(403, "FORBIDDEN", "No puedes cerrar una sesión de otro alumno.");
    }

    if (session.status === SessionStatus.COMPLETED) {
      const response = await buildCompletedResponse(
        tx,
        session,
        student,
        true,
        session.attempts.map((attempt) => ({
          microExerciseId: attempt.microExerciseId,
          isCorrect: attempt.isCorrect,
          selectedAnswer: attempt.selectedAnswer,
        }))
      );
      return { kind: "completed" as const, response: stripAttemptsSummaryWhenProcessed(response, true) };
    }

    if (session.status !== SessionStatus.STARTED) {
      return { kind: "not_startable" as const };
    }

    if (isSessionExpired(session.startedAt)) {
      await tx.lessonSession.update({
        where: { id: sessionId },
        data: { status: SessionStatus.ABANDONED },
      });
      return { kind: "expired" as const };
    }

    const exerciseById = new Map(
      session.node.exercises.map((exercise) => [exercise.id, exercise])
    );

    for (const attempt of attempts) {
      if (!exerciseById.has(attempt.microExerciseId)) {
        throw new ApiError(
          400,
          "INVALID_ATTEMPT",
          "El ejercicio no pertenece al nodo de la sesión."
        );
      }
    }

    const totalExercises = session.node.exercises.length;
    if (totalExercises === 0) {
      throw new ApiError(
        400,
        "INVALID_ATTEMPT",
        "El nodo no tiene ejercicios configurados."
      );
    }

    const attemptsSummary = attempts.map((attempt) => {
      const exercise = exerciseById.get(attempt.microExerciseId)!;
      const isCorrect = isAnswerCorrect(exercise.secureAnswer, attempt.selectedAnswer);
      return {
        microExerciseId: attempt.microExerciseId,
        isCorrect,
        selectedAnswer: attempt.selectedAnswer,
      };
    });

    const correctCount = attemptsSummary.filter((attempt) => attempt.isCorrect).length;
    const accuracy = correctCount / totalExercises;
    const xpEarned = Math.round(accuracy * 100);
    const nodeCompleted = accuracy >= 0.7;
    const completedAt = new Date();

    await tx.exerciseAttempt.createMany({
      data: attempts.map((attempt) => {
        const summary = attemptsSummary.find(
          (item) => item.microExerciseId === attempt.microExerciseId
        )!;
        return {
          sessionId,
          microExerciseId: attempt.microExerciseId,
          isCorrect: summary.isCorrect,
          selectedAnswer: attempt.selectedAnswer,
          responseTimeMs: attempt.responseTimeMs,
        };
      }),
    });

    if (nodeCompleted) {
      await tx.userProgress.upsert({
        where: {
          userId_nodeId: {
            userId: student.id,
            nodeId: session.nodeId,
          },
        },
        update: {
          isCompleted: true,
          completedAt,
        },
        create: {
          userId: student.id,
          nodeId: session.nodeId,
          isCompleted: true,
          completedAt,
        },
      });
    }

    let streakUpdated = false;
    if (nodeCompleted) {
      streakUpdated = await upsertStreakForToday(tx, student);
    }

    if (xpEarned > 0) {
      await tx.xpEvent.create({
        data: {
          userId: student.id,
          sessionId,
          amount: xpEarned,
          reason: "SESSION_COMPLETED",
        },
      });
    }

    const updatedSession = await tx.lessonSession.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.COMPLETED,
        accuracy,
        xpEarned,
        streakUpdated,
        completedAt,
      },
    });

    const response = await buildCompletedResponse(
      tx,
      { ...updatedSession, nodeId: session.nodeId },
      student,
      false,
      attemptsSummary
    );

    return { kind: "completed" as const, response };
  });

  return finalizeTransactionResult(result);
}

async function upsertStreakForToday(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  student: User
): Promise<boolean> {
  const today = formatDateInTimezone(new Date(), student.timezone);

  const existingToday = await tx.streakEvent.findUnique({
    where: {
      userId_eventDate: {
        userId: student.id,
        eventDate: today,
      },
    },
  });

  if (existingToday) {
    return false;
  }

  const yesterday = getYesterdayDateInTimezone(student.timezone);
  const existingYesterday = await tx.streakEvent.findUnique({
    where: {
      userId_eventDate: {
        userId: student.id,
        eventDate: yesterday,
      },
    },
  });

  const nextStreak = existingYesterday ? existingYesterday.currentStreak + 1 : 1;

  await tx.streakEvent.create({
    data: {
      userId: student.id,
      currentStreak: nextStreak,
      eventDate: today,
    },
  });

  return true;
}

async function buildCompletedResponse(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  session: {
    id: string;
    nodeId: string;
    accuracy: number | null;
    xpEarned: number;
    streakUpdated: boolean;
    completedAt: Date | null;
  },
  student: User,
  alreadyProcessed: boolean,
  attemptsSummary: AttemptSummary[]
): Promise<CompleteLessonSessionResponse> {
  const latestStreak = await tx.streakEvent.findFirst({
    where: { userId: student.id },
    orderBy: { eventDate: "desc" },
  });

  const progress = await tx.userProgress.findUnique({
    where: {
      userId_nodeId: {
        userId: student.id,
        nodeId: session.nodeId,
      },
    },
  });

  return {
    sessionId: session.id,
    status: "COMPLETED",
    alreadyProcessed,
    accuracy: session.accuracy ?? 0,
    xpEarned: session.xpEarned,
    streakUpdated: session.streakUpdated,
    currentStreak: latestStreak?.currentStreak ?? 0,
    nodeCompleted: progress?.isCompleted ?? false,
    completedAt: session.completedAt?.toISOString() ?? new Date().toISOString(),
    ...(alreadyProcessed ? {} : { attemptsSummary }),
  };
}

function stripAttemptsSummaryWhenProcessed(
  response: CompleteLessonSessionResponse,
  alreadyProcessed: boolean
): CompleteLessonSessionResponse {
  if (!alreadyProcessed) {
    return response;
  }

  const { attemptsSummary: _ignored, ...rest } = response;
  return rest;
}

function finalizeTransactionResult(result: TransactionResult): CompleteLessonSessionResponse {
  if (result.kind === "expired") {
    throw new ApiError(
      410,
      "SESSION_EXPIRED",
      "La sesión superó la ventana de 3 horas y fue marcada como ABANDONED."
    );
  }

  if (result.kind === "not_startable") {
    throw new ApiError(
      422,
      "SESSION_NOT_STARTABLE",
      "La sesión no está en estado STARTED."
    );
  }

  return result.response;
}
