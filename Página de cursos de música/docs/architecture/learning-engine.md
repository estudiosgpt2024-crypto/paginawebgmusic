# Gmusic Learning Engine

## Regla de Producto

No estamos copiando Duolingo visualmente. Gmusic construye un motor de habito, progreso y micropractica musical inspirado en su logica de aprendizaje: sesiones cortas, feedback claro, XP, rachas, camino pedagogico y reportes.

## Stack Recomendado Para MVP

- Frontend actual: React + Vite.
- Backend: Node.js + TypeScript.
- API: REST primero.
- Base de datos: PostgreSQL.
- ORM: Prisma.
- Mobile: PWA o Expo despues de validar el motor web.

## Flujo Principal

1. El alumno abre `Mi Estudio` o `Mi Camino`.
2. El frontend pide `GET /api/v1/me/dashboard` y `GET /api/v1/me/path`.
3. El alumno inicia una practica con `POST /api/v1/lesson-sessions`.
4. El backend crea una `LessonSession` y devuelve un paquete de microejercicios sin respuestas correctas.
5. El frontend ejecuta los microejercicios localmente para que audio, tacto y seleccion sean inmediatos.
6. Al finalizar, el frontend envia `POST /api/v1/lesson-sessions/:id/complete`.
7. El backend valida respuestas, calcula precision, XP, racha y progreso dentro de una transaccion.
8. El dashboard del alumno y el reporte del apoderado leen los eventos ya persistidos.

## Endpoints MVP

### Alumno

`GET /api/v1/me/dashboard`

Devuelve racha actual, XP total, nodo activo, progreso del modulo y proxima practica.

`GET /api/v1/me/path`

Devuelve modulos y nodos con estado `locked`, `available`, `active` o `completed`.

`POST /api/v1/lesson-sessions`

Body:

```json
{
  "nodeId": "uuid"
}
```

Crea una sesion `STARTED` y devuelve ejercicios listos para ejecutar localmente.

`POST /api/v1/lesson-sessions/:id/complete`

Body:

```json
{
  "attempts": [
    {
      "microExerciseId": "uuid",
      "selectedAnswer": "c",
      "responseTimeMs": 4200
    }
  ]
}
```

Procesa intentos de forma idempotente. El cliente no envia `isCorrect`; el servidor lo calcula.

### Apoderado

`GET /api/v1/guardian/students`

Lista alumnos vinculados al apoderado autenticado.

`GET /api/v1/guardian/students/:id/report`

Devuelve dias activos, sesiones recientes, precision promedio, XP y progreso del alumno. Solo se permite si existe `GuardianLink`.

## Payload Seguro de Leccion

El servidor debe devolver contenido sin respuesta correcta.

```json
{
  "sessionId": "sess_8923a1b2-4cd5-4e78",
  "nodeId": "node_550e8400-e29b-41d4",
  "exercises": [
    {
      "id": "ex_001",
      "type": "IDENTIFY_NOTE",
      "difficulty": 1,
      "instruction": "Escucha el siguiente audio e identifica que cuerda de la guitarra esta sonando al aire.",
      "contentPayload": {
        "audioUrl": "https://cdn.gmusic.academy/audio/samples/6th-string-e.mp3",
        "imageUrl": null,
        "options": [
          { "id": "a", "text": "1a cuerda (Mi)" },
          { "id": "b", "text": "5a cuerda (La)" },
          { "id": "c", "text": "6a cuerda (Mi grave)" },
          { "id": "d", "text": "4a cuerda (Re)" }
        ],
        "explanationAfterAnswer": "La 6a cuerda es la mas gruesa de la guitarra y produce la nota Mi mas grave."
      }
    }
  ]
}
```

## Algoritmo Seguro de Cierre de Sesion

```ts
async function completeSession(
  sessionId: string,
  userId: string,
  payloadAttempts: IncomingAttempt[]
) {
  const session = await prisma.lessonSession.findUnique({
    where: { id: sessionId },
    include: { node: { include: { exercises: true } } },
  });

  if (!session || session.userId !== userId) {
    throw new Error("UnauthorizedOrNotFound");
  }

  if (session.status === "COMPLETED") {
    return {
      status: session.status,
      xpEarned: session.xpEarned,
      accuracy: session.accuracy,
      alreadyProcessed: true,
    };
  }

  const MAX_WINDOW_MS = 3 * 60 * 60 * 1000;
  const timeElapsed = Date.now() - session.startedAt.getTime();

  if (timeElapsed > MAX_WINDOW_MS) {
    await prisma.lessonSession.update({
      where: { id: sessionId },
      data: { status: "ABANDONED" },
    });
    throw new Error("SessionExpiredWindowExceeded");
  }

  const exerciseById = new Map(session.node.exercises.map((exercise) => [exercise.id, exercise]));
  let correctCount = 0;

  const attemptsData = payloadAttempts.map((attempt) => {
    const exercise = exerciseById.get(attempt.microExerciseId);
    if (!exercise) throw new Error("InvalidExerciseAttempt");

    const secureAnswer = exercise.secureAnswer as { correctOptionId: string };
    const isCorrect = secureAnswer.correctOptionId === attempt.selectedAnswer;
    if (isCorrect) correctCount += 1;

    return {
      sessionId,
      microExerciseId: attempt.microExerciseId,
      isCorrect,
      selectedAnswer: attempt.selectedAnswer,
      responseTimeMs: attempt.responseTimeMs,
    };
  });

  const accuracy = correctCount / session.node.exercises.length;
  const xpEarned = Math.round(accuracy * 100);

  return prisma.$transaction(async (tx) => {
    await tx.exerciseAttempt.createMany({
      data: attemptsData,
      skipDuplicates: true,
    });

    if (accuracy >= 0.7) {
      await tx.userProgress.upsert({
        where: { userId_nodeId: { userId, nodeId: session.nodeId } },
        update: { isCompleted: true, completedAt: new Date() },
        create: { userId, nodeId: session.nodeId, isCompleted: true, completedAt: new Date() },
      });
    }

    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const localDateStr = getLocalDateInTimezone(user.timezone);

    const existingToday = await tx.streakEvent.findUnique({
      where: { userId_eventDate: { userId, eventDate: localDateStr } },
    });

    let streakUpdated = false;
    if (!existingToday && accuracy >= 0.7) {
      const yesterdayDateStr = getYesterdayDateInTimezone(user.timezone);
      const existingYesterday = await tx.streakEvent.findUnique({
        where: { userId_eventDate: { userId, eventDate: yesterdayDateStr } },
      });

      const nextStreak = existingYesterday ? existingYesterday.currentStreak + 1 : 1;

      await tx.streakEvent.create({
        data: { userId, currentStreak: nextStreak, eventDate: localDateStr },
      });

      streakUpdated = true;
    }

    if (xpEarned > 0) {
      await tx.xpEvent.create({
        data: { userId, amount: xpEarned, reason: "SESSION_COMPLETED", sessionId },
      });
    }

    return tx.lessonSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        accuracy,
        xpEarned,
        streakUpdated,
        completedAt: new Date(),
      },
    });
  });
}
```

## Reglas de Seguridad

- El cliente no decide `isCorrect`, XP, racha ni progreso.
- El cliente nunca recibe `secureAnswer`.
- `completeSession` debe ser idempotente.
- Una sesion `COMPLETED` no se procesa dos veces.
- Una sesion vencida se marca `ABANDONED`.
- La zona horaria del alumno se aplica en servidor.
- Los reportes de apoderado deben validar `GuardianLink`.

## Offline y Reintentos

El frontend puede guardar en IndexedDB o `localStorage`:

- `sessionId`
- ejercicios recibidos
- intentos pendientes
- fecha local de captura para UX

Pero el servidor solo debe confiar en:

- `LessonSession.startedAt`
- usuario autenticado
- pertenencia de la sesion
- estado actual de la sesion
- ventana maxima permitida

Si el envio falla, el cliente puede mostrar:

> Buen trabajo. Tu sesion quedo guardada en este dispositivo y se sincronizara apenas vuelva la conexion.

## Fases

1. Backend core: Prisma schema, migraciones, seed de curso/nodos/ejercicios y endpoints mock.
2. Motor web: consumir `lesson-sessions`, ejecutar microejercicios y enviar cierre.
3. Reportes de apoderado: alumnos vinculados, actividad semanal, precision y XP.
4. PWA/mobile: outbox offline, instalable web y eventual Expo.
