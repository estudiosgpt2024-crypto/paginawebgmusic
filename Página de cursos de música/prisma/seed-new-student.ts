import {
  PrismaClient,
  Role,
  SubscriptionStatus,
} from "@prisma/client";
import { addCalendarMonths } from "./add-calendar-months.js";

const prisma = new PrismaClient();

const JUAN = {
  email: "juan@gmusic.academy",
  name: "Juan Lizama",
  role: Role.STUDENT,
  timezone: "America/Santiago",
} as const;

const CARLOS_EMAIL = "carlos@gmusic.academy";
const PLAN_ID = "gmusic-semester-6-months";
const SUBSCRIPTION_MONTHS = 6;

async function upsertJuan() {
  return prisma.user.upsert({
    where: { email: JUAN.email },
    update: {
      name: JUAN.name,
      role: JUAN.role,
      timezone: JUAN.timezone,
    },
    create: {
      email: JUAN.email,
      name: JUAN.name,
      role: JUAN.role,
      timezone: JUAN.timezone,
    },
  });
}

interface JuanActivityCounts {
  userProgress: number;
  lessonSessions: number;
  exerciseAttempts: number;
  xpEvents: number;
  streakEvents: number;
  subscriptions: number;
}

async function getJuanActivityCounts(userId: string): Promise<JuanActivityCounts> {
  const [userProgress, lessonSessions, exerciseAttempts, xpEvents, streakEvents, subscriptions] =
    await Promise.all([
      prisma.userProgress.count({ where: { userId } }),
      prisma.lessonSession.count({ where: { userId } }),
      prisma.exerciseAttempt.count({
        where: { session: { userId } },
      }),
      prisma.xpEvent.count({ where: { userId } }),
      prisma.streakEvent.count({ where: { userId } }),
      prisma.subscription.count({ where: { userId } }),
    ]);

  return {
    userProgress,
    lessonSessions,
    exerciseAttempts,
    xpEvents,
    streakEvents,
    subscriptions,
  };
}

interface OtherUserSnapshot {
  email: string;
  userProgress: number;
  lessonSessions: number;
  exerciseAttempts: number;
  xpEvents: number;
  streakEvents: number;
  subscriptions: number;
}

async function captureOtherUsersSnapshot(): Promise<OtherUserSnapshot[]> {
  const others = await prisma.user.findMany({
    where: { email: { not: JUAN.email } },
    select: { id: true, email: true },
    orderBy: { email: "asc" },
  });

  return Promise.all(
    others.map(async (user) => {
      const counts = await getJuanActivityCounts(user.id);
      return {
        email: user.email,
        ...counts,
      };
    })
  );
}

function assertSnapshotsEqual(
  before: OtherUserSnapshot[],
  after: OtherUserSnapshot[]
): void {
  if (before.length !== after.length) {
    throw new Error(
      `Cambió el número de usuarios distintos a Juan (${before.length} → ${after.length}).`
    );
  }

  for (const previous of before) {
    const current = after.find((snapshot) => snapshot.email === previous.email);
    if (!current) {
      throw new Error(`Desapareció el usuario ${previous.email} tras el seed.`);
    }

    const fields: (keyof Omit<OtherUserSnapshot, "email">)[] = [
      "userProgress",
      "lessonSessions",
      "exerciseAttempts",
      "xpEvents",
      "streakEvents",
      "subscriptions",
    ];

    for (const field of fields) {
      if (current[field] !== previous[field]) {
        throw new Error(
          `Se modificó ${field} de ${previous.email} (${previous[field]} → ${current[field]}).`
        );
      }
    }
  }
}

async function resetJuanScenario(userId: string, endsAt: Date) {
  return prisma.$transaction(async (tx) => {
    const sessions = await tx.lessonSession.findMany({
      where: { userId },
      select: { id: true },
    });
    const sessionIds = sessions.map((session) => session.id);

    const deletedAttempts =
      sessionIds.length > 0
        ? await tx.exerciseAttempt.deleteMany({
            where: { sessionId: { in: sessionIds } },
          })
        : { count: 0 };

    const deletedXpEvents = await tx.xpEvent.deleteMany({
      where: { userId },
    });

    const deletedSessions = await tx.lessonSession.deleteMany({
      where: { userId },
    });

    const deletedProgress = await tx.userProgress.deleteMany({
      where: { userId },
    });

    const deletedStreakEvents = await tx.streakEvent.deleteMany({
      where: { userId },
    });

    const deletedSubscriptions = await tx.subscription.deleteMany({
      where: { userId },
    });

    const subscription = await tx.subscription.create({
      data: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        planId: PLAN_ID,
        endsAt,
      },
    });

    return {
      deletedAttempts: deletedAttempts.count,
      deletedXpEvents: deletedXpEvents.count,
      deletedSessions: deletedSessions.count,
      deletedProgress: deletedProgress.count,
      deletedStreakEvents: deletedStreakEvents.count,
      deletedSubscriptions: deletedSubscriptions.count,
      subscription,
    };
  });
}

async function assertJuanScenario(userId: string) {
  const counts = await getJuanActivityCounts(userId);

  if (counts.subscriptions !== 1) {
    throw new Error(`Juan debe tener exactamente 1 suscripción (tiene ${counts.subscriptions}).`);
  }

  const zeroFields: (keyof Omit<JuanActivityCounts, "subscriptions">)[] = [
    "userProgress",
    "lessonSessions",
    "exerciseAttempts",
    "xpEvents",
    "streakEvents",
  ];

  for (const field of zeroFields) {
    if (counts[field] !== 0) {
      throw new Error(`Juan debe tener 0 ${field} (tiene ${counts[field]}).`);
    }
  }

  return counts;
}

async function reportJuanCounts(userId: string) {
  const [
    user,
    subscriptions,
    userProgress,
    lessonSessions,
    exerciseAttempts,
    xpEvents,
    streakEvents,
  ] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        role: true,
        timezone: true,
      },
    }),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        status: true,
        planId: true,
        endsAt: true,
      },
    }),
    prisma.userProgress.count({ where: { userId } }),
    prisma.lessonSession.count({ where: { userId } }),
    prisma.exerciseAttempt.count({
      where: { session: { userId } },
    }),
    prisma.xpEvent.count({ where: { userId } }),
    prisma.streakEvent.count({ where: { userId } }),
  ]);

  console.log("\nAlumno:");
  console.log(`  email:    ${user.email}`);
  console.log(`  name:     ${user.name}`);
  console.log(`  role:     ${user.role}`);
  console.log(`  timezone: ${user.timezone}`);

  console.log("\nSuscripciones:");
  for (const subscription of subscriptions) {
    console.log(
      `  ${subscription.planId} | ${subscription.status} | endsAt=${subscription.endsAt?.toISOString() ?? "null"}`
    );
  }

  console.log("\nConteos finales de Juan:");
  console.log(`  Subscription:    ${subscriptions.length}`);
  console.log(`  UserProgress:    ${userProgress}`);
  console.log(`  LessonSession:   ${lessonSessions}`);
  console.log(`  ExerciseAttempt: ${exerciseAttempts}`);
  console.log(`  XpEvent:         ${xpEvents}`);
  console.log(`  StreakEvent:     ${streakEvents}`);
}

async function reportOtherUsersIntegrity(before: OtherUserSnapshot[]) {
  const after = await captureOtherUsersSnapshot();
  assertSnapshotsEqual(before, after);

  console.log("\nIntegridad de otros usuarios:");
  const carlos = after.find((snapshot) => snapshot.email === CARLOS_EMAIL);

  if (!carlos) {
    console.log(`  ${CARLOS_EMAIL}: no presente (seed base no ejecutado)`);
  } else {
    console.log(`  ${carlos.email}:`);
    console.log(`    Subscription:    ${carlos.subscriptions}`);
    console.log(`    UserProgress:    ${carlos.userProgress}`);
    console.log(`    LessonSession:   ${carlos.lessonSessions}`);
    console.log(`    ExerciseAttempt: ${carlos.exerciseAttempts}`);
    console.log(`    XpEvent:         ${carlos.xpEvents}`);
    console.log(`    StreakEvent:     ${carlos.streakEvents}`);
  }

  const otherCount = after.filter((snapshot) => snapshot.email !== CARLOS_EMAIL).length;
  if (otherCount > 0) {
    console.log(`  Otros usuarios verificados sin cambios: ${otherCount}`);
  }
}

async function main() {
  const now = new Date();
  const endsAt = addCalendarMonths(now, SUBSCRIPTION_MONTHS);
  const othersBefore = await captureOtherUsersSnapshot();

  console.log("🌱 Preparando escenario de alumno nuevo (Juan Lizama)...");

  const juan = await upsertJuan();
  const reset = await resetJuanScenario(juan.id, endsAt);
  await assertJuanScenario(juan.id);

  console.log("✅ Juan Lizama listo para recorrido desde cero.");
  console.log(
    `   Suscripción ${reset.subscription.planId} activa hasta ${reset.subscription.endsAt?.toISOString()}`
  );
  console.log("\nLimpieza de actividad previa:");
  console.log(`  ExerciseAttempt eliminados: ${reset.deletedAttempts}`);
  console.log(`  XpEvent eliminados:         ${reset.deletedXpEvents}`);
  console.log(`  LessonSession eliminadas:   ${reset.deletedSessions}`);
  console.log(`  UserProgress eliminados:    ${reset.deletedProgress}`);
  console.log(`  StreakEvent eliminados:     ${reset.deletedStreakEvents}`);
  console.log(`  Subscription eliminadas:    ${reset.deletedSubscriptions}`);

  await reportJuanCounts(juan.id);
  await reportOtherUsersIntegrity(othersBefore);
}

main()
  .catch((error) => {
    console.error("❌ Seed de alumno nuevo falló:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
