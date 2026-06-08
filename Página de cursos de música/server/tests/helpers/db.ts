import { SessionStatus } from "@prisma/client";
import assert from "node:assert/strict";
import { config } from "../../config.js";
import { prisma } from "../../lib/prisma.js";
import { loadPublishedCoursePath } from "../../services/coursePath.js";
import type { PathNodeStatus } from "../../lib/nodeStatus.js";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export interface UserProgressRowSnapshot {
  id: string;
  userId: string;
  nodeId: string;
  isCompleted: boolean;
  unlockedAt: Date;
  completedAt: Date | null;
}

export interface UserProgressSnapshot {
  existed: boolean;
  row: UserProgressRowSnapshot | null;
}

export async function getDevStudent() {
  return prisma.user.findUniqueOrThrow({
    where: { email: config.devStudentEmail },
  });
}

export async function getNodeIdsByStatus(studentId: string) {
  const { modules, statusByNodeId } = await loadPublishedCoursePath(
    config.defaultCourseSlug,
    studentId
  );

  const byStatus: Partial<Record<PathNodeStatus, string>> = {};

  for (const module of modules) {
    for (const node of module.nodes) {
      const status = statusByNodeId.get(node.id);
      if (status && !byStatus[status]) {
        byStatus[status] = node.id;
      }
    }
  }

  return byStatus;
}

export async function deleteStudentSessionsForNode(userId: string, nodeId: string) {
  await prisma.lessonSession.deleteMany({
    where: { userId, nodeId },
  });
}

export async function getSessionStatus(sessionId: string) {
  const session = await prisma.lessonSession.findUniqueOrThrow({
    where: { id: sessionId },
    select: { status: true, startedAt: true },
  });
  return session;
}

export async function setSessionStartedAt(sessionId: string, startedAt: Date) {
  await prisma.lessonSession.update({
    where: { id: sessionId },
    data: { startedAt },
  });
}

export async function captureUserProgressSnapshot(
  userId: string,
  nodeId: string
): Promise<UserProgressSnapshot> {
  const row = await prisma.userProgress.findUnique({
    where: { userId_nodeId: { userId, nodeId } },
  });

  if (!row) {
    return { existed: false, row: null };
  }

  return {
    existed: true,
    row: {
      id: row.id,
      userId: row.userId,
      nodeId: row.nodeId,
      isCompleted: row.isCompleted,
      unlockedAt: row.unlockedAt,
      completedAt: row.completedAt,
    },
  };
}

export async function restoreUserProgressSnapshot(
  userId: string,
  nodeId: string,
  snapshot: UserProgressSnapshot
): Promise<void> {
  if (!snapshot.existed) {
    await prisma.userProgress.deleteMany({
      where: { userId, nodeId },
    });
    return;
  }

  const row = snapshot.row!;

  await prisma.userProgress.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    update: {
      isCompleted: row.isCompleted,
      unlockedAt: row.unlockedAt,
      completedAt: row.completedAt,
    },
    create: {
      id: row.id,
      userId: row.userId,
      nodeId: row.nodeId,
      isCompleted: row.isCompleted,
      unlockedAt: row.unlockedAt,
      completedAt: row.completedAt,
    },
  });
}

export function assertUserProgressSnapshotsEqual(
  current: UserProgressSnapshot,
  expected: UserProgressSnapshot
): void {
  assert.equal(current.existed, expected.existed);

  if (!expected.existed) {
    assert.equal(current.row, null);
    return;
  }

  assert.ok(current.row);
  assert.ok(expected.row);
  assert.equal(current.row.isCompleted, expected.row.isCompleted);
  assert.equal(
    current.row.completedAt?.toISOString() ?? null,
    expected.row.completedAt?.toISOString() ?? null
  );
  assert.equal(current.row.unlockedAt.toISOString(), expected.row.unlockedAt.toISOString());
}

export async function markNodeCompleted(userId: string, nodeId: string) {
  await prisma.userProgress.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    update: { isCompleted: true, completedAt: new Date() },
    create: {
      userId,
      nodeId,
      isCompleted: true,
      completedAt: new Date(),
    },
  });
}

export async function countStartedSessions(userId: string, nodeId: string) {
  return prisma.lessonSession.count({
    where: {
      userId,
      nodeId,
      status: SessionStatus.STARTED,
    },
  });
}
