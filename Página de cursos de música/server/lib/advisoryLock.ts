import { Prisma } from "@prisma/client";

/**
 * Bloqueo transaccional por alumno+nodo.
 *
 * Peticiones concurrentes a POST /lesson-sessions pueden intercalar lecturas
 * antes de que exista la fila STARTED recién creada y terminar insertando
 * duplicados. pg_advisory_xact_lock serializa la sección crítica dentro de la
 * transacción; se libera automáticamente al commit o rollback.
 */
export async function acquireLessonSessionAdvisoryLock(
  tx: Prisma.TransactionClient,
  userId: string,
  nodeId: string
): Promise<void> {
  await tx.$executeRaw(
    Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${userId}), hashtext(${nodeId}))`
  );
}
