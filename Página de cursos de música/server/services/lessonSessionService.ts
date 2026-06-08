import { SessionStatus, type User } from "@prisma/client";
import { config } from "../config.js";
import {
  PUBLIC_EXERCISE_SELECT,
  toPublicExercise,
} from "../lib/exercisePublic.js";
import { ApiError } from "../lib/errors.js";
import { acquireLessonSessionAdvisoryLock } from "../lib/advisoryLock.js";
import type { PathNodeStatus } from "../lib/nodeStatus.js";
import { prisma } from "../lib/prisma.js";
import { isSessionExpired, sessionExpiresAt } from "../lib/sessionTtl.js";
import { parseLessonSessionBody } from "../lib/validation.js";
import { loadPublishedCoursePath } from "./coursePath.js";

export interface LessonSessionResponse {
  sessionId: string;
  nodeId: string;
  status: "STARTED";
  startedAt: string;
  expiresAt: string;
  exercises: ReturnType<typeof toPublicExercise>[];
}

export async function createOrReuseLessonSession(
  student: User,
  body: unknown
): Promise<{ payload: LessonSessionResponse; created: boolean }> {
  const { nodeId } = parseLessonSessionBody(body);

  const { modules, statusByNodeId } = await loadPublishedCoursePath(
    config.defaultCourseSlug,
    student.id
  );

  const nodeStatus = resolvePublishedNodeStatus(nodeId, modules, statusByNodeId);

  if (!nodeStatus || nodeStatus === "locked" || nodeStatus === "completed") {
    throw new ApiError(
      400,
      "INVALID_NODE",
      "El nodo no está disponible para iniciar una sesión de práctica."
    );
  }

  const { session, created } = await prisma.$transaction(async (tx) => {
    await acquireLessonSessionAdvisoryLock(tx, student.id, nodeId);

    const startedSessions = await tx.lessonSession.findMany({
      where: {
        userId: student.id,
        nodeId,
        status: SessionStatus.STARTED,
      },
      orderBy: { startedAt: "desc" },
    });

    const now = new Date();
    let reusableSession: (typeof startedSessions)[number] | null = null;

    for (const existing of startedSessions) {
      if (isSessionExpired(existing.startedAt, now)) {
        await tx.lessonSession.update({
          where: { id: existing.id },
          data: { status: SessionStatus.ABANDONED },
        });
      } else if (!reusableSession) {
        reusableSession = existing;
      }
    }

    if (reusableSession) {
      return { session: reusableSession, created: false };
    }

    const createdSession = await tx.lessonSession.create({
      data: {
        userId: student.id,
        nodeId,
        status: SessionStatus.STARTED,
      },
    });

    return { session: createdSession, created: true };
  });

  const exercises = await prisma.microExercise.findMany({
    where: { nodeId },
    select: PUBLIC_EXERCISE_SELECT,
    orderBy: { order: "asc" },
  });

  const payload: LessonSessionResponse = {
    sessionId: session.id,
    nodeId: session.nodeId,
    status: "STARTED",
    startedAt: session.startedAt.toISOString(),
    expiresAt: sessionExpiresAt(session.startedAt).toISOString(),
    exercises: exercises.map(toPublicExercise),
  };

  return { payload, created };
}

function resolvePublishedNodeStatus(
  nodeId: string,
  modules: Array<{ nodes: Array<{ id: string }> }>,
  statusByNodeId: Map<string, PathNodeStatus>
): PathNodeStatus | null {
  for (const module of modules) {
    for (const node of module.nodes) {
      if (node.id === nodeId) {
        return statusByNodeId.get(node.id) ?? null;
      }
    }
  }
  return null;
}
