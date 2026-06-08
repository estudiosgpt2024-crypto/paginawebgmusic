# Gmusic Learning Engine — Database Schema

## Objetivo

Este esquema define la base relacional del motor de aprendizaje de Gmusic: usuarios, apoderados, cursos, camino pedagogico, microejercicios, sesiones, intentos, progreso, XP, rachas y acceso comercial.

No estamos copiando Duolingo visualmente; estamos construyendo un motor de habito, progreso y micropractica musical inspirado en su logica de aprendizaje.

## Principios

- PostgreSQL es la fuente de verdad.
- Prisma administra schema, tipos y migraciones.
- El servidor valida respuestas, XP, rachas y progreso.
- El frontend nunca recibe la respuesta correcta como parte del payload normal de una leccion.
- Los eventos criticos deben ser idempotentes para evitar doble suma de XP o rachas.
- El modelo debe soportar web primero y mobile/PWA despues.

## Integridad referencial e índices

- **onDelete: Cascade** — registros del alumno (`LessonSession`, `UserProgress`, `XpEvent`, `StreakEvent`, `Subscription`, `GuardianLink`) cuando se elimina el `User`.
- **onDelete: Restrict** — contenido pedagógico y nodos referenciados por sesiones o progreso (`Module` → `Course`, `PathNode` → `Module`, `LessonSession` → `PathNode`, etc.) para evitar borrados accidentales con historial activo.
- **onDelete: SetNull** — `XpEvent.sessionId` opcional si la sesión se elimina en mantenimiento.
- **onDelete: Cascade** — `MicroExercise` y `ExerciseAttempt` hijos directos de nodo/sesión respectivamente.
- **@@index** — FKs de consulta frecuente (`userId`, `nodeId`, `sessionId`, `courseId`, `moduleId`) y compuesto `LessonSession(userId, status)`.

## Prisma Schema Base

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  GUARDIAN
  ADMIN
}

enum ExerciseType {
  IDENTIFY_NOTE
  RHYTHM_TAP
  EAR_TRAINING
  CHORD_SHAPE
}

enum SessionStatus {
  STARTED
  COMPLETED
  ABANDONED
}

enum PublishStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
}

model User {
  id            String          @id @default(uuid())
  email         String          @unique
  name          String
  role          Role            @default(STUDENT)
  timezone      String          @default("America/Santiago")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  studentLinks  GuardianLink[]  @relation("StudentToGuardian")
  guardianLinks GuardianLink[]  @relation("GuardianToStudent")
  sessions      LessonSession[]
  progress      UserProgress[]
  xpEvents      XpEvent[]
  streakEvents  StreakEvent[]
  subscriptions Subscription[]
}

model GuardianLink {
  id         String   @id @default(uuid())
  guardianId String
  studentId  String
  createdAt  DateTime @default(now())

  guardian User @relation("GuardianToStudent", fields: [guardianId], references: [id], onDelete: Cascade)
  student  User @relation("StudentToGuardian", fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([guardianId, studentId])
  @@index([guardianId])
  @@index([studentId])
}

model Subscription {
  id        String             @id @default(uuid())
  userId    String
  status    SubscriptionStatus @default(ACTIVE)
  planId    String
  endsAt    DateTime?
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Course {
  id          String        @id @default(uuid())
  title       String
  slug        String        @unique
  description String?
  status      PublishStatus @default(DRAFT)
  version     Int           @default(1)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  modules Module[]
}

model Module {
  id        String        @id @default(uuid())
  courseId  String
  title     String
  order     Int
  status    PublishStatus @default(DRAFT)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  course Course     @relation(fields: [courseId], references: [id], onDelete: Restrict)
  nodes  PathNode[]

  @@unique([courseId, order])
  @@index([courseId])
}

model PathNode {
  id        String        @id @default(uuid())
  moduleId  String
  title     String
  order     Int
  status    PublishStatus @default(DRAFT)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  exercises MicroExercise[]
  progress  UserProgress[]
  sessions  LessonSession[]
  module    Module          @relation(fields: [moduleId], references: [id], onDelete: Restrict)

  @@unique([moduleId, order])
  @@index([moduleId])
}

model MicroExercise {
  id             String       @id @default(uuid())
  nodeId         String
  type           ExerciseType
  difficulty     Int
  instruction    String
  contentPayload Json
  secureAnswer   Json
  order          Int
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  attempts ExerciseAttempt[]
  node     PathNode          @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  @@unique([nodeId, order])
  @@index([nodeId])
}

model LessonSession {
  id            String        @id @default(uuid())
  userId        String
  nodeId        String
  status        SessionStatus @default(STARTED)
  accuracy      Float?
  xpEarned      Int           @default(0)
  streakUpdated Boolean       @default(false)
  startedAt     DateTime      @default(now())
  completedAt   DateTime?

  attempts ExerciseAttempt[]
  user     User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  node     PathNode          @relation(fields: [nodeId], references: [id], onDelete: Restrict)
  xpEvents XpEvent[]

  @@index([userId])
  @@index([nodeId])
  @@index([userId, status])
}

model ExerciseAttempt {
  id              String   @id @default(uuid())
  sessionId       String
  microExerciseId String
  isCorrect       Boolean
  selectedAnswer  String
  responseTimeMs  Int
  createdAt       DateTime @default(now())

  session  LessonSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exercise MicroExercise @relation(fields: [microExerciseId], references: [id], onDelete: Restrict)

  @@unique([sessionId, microExerciseId])
  @@index([sessionId])
  @@index([microExerciseId])
}

model UserProgress {
  id          String    @id @default(uuid())
  userId      String
  nodeId      String
  isCompleted Boolean   @default(false)
  unlockedAt  DateTime  @default(now())
  completedAt DateTime?

  user User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  node PathNode @relation(fields: [nodeId], references: [id], onDelete: Restrict)

  @@unique([userId, nodeId])
  @@index([userId])
  @@index([nodeId])
}

model XpEvent {
  id        String   @id @default(uuid())
  userId    String
  sessionId String?
  amount    Int
  reason    String
  createdAt DateTime @default(now())

  user    User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  session LessonSession? @relation(fields: [sessionId], references: [id], onDelete: SetNull)

  @@unique([sessionId, reason])
  @@index([userId])
  @@index([createdAt])
}

model StreakEvent {
  id            String   @id @default(uuid())
  userId        String
  currentStreak Int
  eventDate     String
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, eventDate])
  @@index([userId])
}
```

## Notas de Implementacion

- `secureAnswer` no debe salir por API publica.
- `ExerciseAttempt.isCorrect` lo calcula el servidor, no el cliente.
- `LessonSession.status` debe ser enum, nunca string libre.
- `@@unique([sessionId, microExerciseId])` evita duplicar intentos por reintentos.
- `@@unique([sessionId, reason])` en `XpEvent` evita doble XP por la misma sesion y razon.
- La relacion apoderado-alumno se valida con `GuardianLink`.
- Los estados `DRAFT`, `PUBLISHED` y `ARCHIVED` permiten preparar contenido sin publicarlo.
- `onDelete` explicito en todas las relaciones FK; ver seccion **Integridad referencial e indices**.
- Indices `@@index` en FKs de consulta frecuente y en `LessonSession(userId, status)`.
