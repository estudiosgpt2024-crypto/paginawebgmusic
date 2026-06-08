---
name: gmusic-learning-engine
description: >-
  Diseña e implementa el motor de aprendizaje de Gmusic: backend REST,
  PostgreSQL, Prisma, sesiones de lección, microejercicios, progreso, XP,
  rachas, apoderados, idempotencia, offline seguro y validación anti-cheat.
---

# Gmusic Learning Engine

Usar este skill cuando la tarea toque backend, base de datos, API, Prisma, PostgreSQL, progreso de alumnos, rachas, XP, microejercicios, sesiones de leccion, reportes de apoderados, PWA/offline o logica inspirada en Duolingo para Gmusic.

## Fuentes Locales

Leer primero:

1. `docs/architecture/learning-engine.md`
2. `docs/architecture/database-schema.md`
3. `AGENTS.md`
4. `DESIGN.md` solo si la tarea tambien toca UI.

## Regla de Producto

No copiar Duolingo visualmente. Construir un motor de habito, progreso y micropractica musical adaptado a Gmusic.

## Stack MVP

- Frontend existente: React + Vite.
- Backend recomendado: Node.js + TypeScript.
- API inicial: REST.
- Base de datos: PostgreSQL.
- ORM: Prisma.
- Mobile: PWA/Expo despues de validar el motor web.

## Reglas de Seguridad

- El cliente nunca recibe `secureAnswer`.
- El cliente no decide `isCorrect`, XP, racha ni progreso.
- El endpoint de cierre de sesion debe ser idempotente.
- Una `LessonSession` completada no debe procesarse dos veces.
- Las sesiones vencidas deben marcarse `ABANDONED`.
- La racha se calcula en servidor usando timezone del alumno.
- Los apoderados solo leen datos si existe `GuardianLink`.

## Implementacion por Fases

1. Crear Prisma schema y migraciones.
2. Crear seeds de curso, modulos, nodos y microejercicios.
3. Implementar endpoints REST mockeados:
   - `GET /api/v1/me/dashboard`
   - `GET /api/v1/me/path`
   - `POST /api/v1/lesson-sessions`
   - `POST /api/v1/lesson-sessions/:id/complete`
4. Conectar el frontend web al motor.
5. Agregar reportes de apoderado.
6. Agregar outbox offline/PWA.

## Reglas de Desarrollo

- No introducir GraphQL en MVP salvo instruccion explicita.
- No migrar a Expo hasta que el motor web este validado.
- No mezclar implementacion de backend con rediseños visuales.
- No guardar respuestas correctas en payloads publicos.
- Usar transacciones para XP, rachas, progreso e intentos.
- Agregar tests unitarios a la logica de rachas e idempotencia cuando se implemente backend real.
