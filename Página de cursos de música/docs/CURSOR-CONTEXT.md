# CURSOR AI — Contexto del Proyecto Gmusic Academy

> ⚠️ **Este archivo es referencia rápida.** La fuente de verdad para arquitectura, endpoints y fases R3 es `.cursorrules` y `docs/architecture/api-contract.md`.

## 1. Proyecto

**Gmusic Academy** — plataforma de educación musical gamificada. Estudiantes aprenden guitarra con ruta pedagógica de 12 meses: microprácticas interactivas, XP, streaks, progreso. Apoderados tienen reportes de actividad.

## 2. Stack

- **Frontend**: React 18 + TypeScript strict, Vite 6, TailwindCSS 4 + shadcn/ui (Radix), Recharts, Framer Motion
- **Backend**: Node.js + Express + TypeScript strict
- **DB**: PostgreSQL (Supabase hosted) + Prisma 6
- **Auth**: Sin Supabase Auth todavía. Dev auth via cookies HttpOnly firmadas HMAC-SHA256. Migrar a JWT antes de producción.

## 3. Estructura del proyecto

```
server/
  index.ts              → entry (puerto 3001)
  app.ts                → montaje Express
  config.ts
  lib/
    prisma.ts           → singleton Prisma
    devStudentCookie.ts → cookie firmada (student | logged_out)
    devActivationGate.ts
    studentAccess.ts
    ...
  middleware/
    devStudentAuth.ts
  routes/
    health.ts           → GET /api/v1/health
    me.ts               → /me/dashboard, /me/path, /me/access
    lessonSessions.ts   → POST /lesson-sessions, POST .../complete
    dev.ts              → /dev/activate-semestral, /dev/logout
  services/
  tests/

src/app/
  App.tsx               → navegación por estado (currentPage + handlePageChange)
  components/gmusic/
    StudentZoneGuard.tsx
  hooks/
    useStudentAccess.ts
    usePublicStudentSession.ts
  services/gmusic-api/  → cliente API
  utils/
    student-zone-routing.ts
    public-subscription-flow.ts
    public-home-navigation.ts
    ...
  pages/
    legacy/             → CheckoutPage, CourseDetailPage, etc.
    marketing/          → GmusicLanding, ProbarPage
vite/
  devActivationProxy.ts
prisma/
  schema.prisma
  seed.ts
docs/architecture/
  api-contract.md       → FUENTE DE VERDAD endpoints REST v1
  learning-engine.md    → lógica del motor
```

**Archivos deprecated** (no usar como referencia):
- `src/app/utils/student-access-guard` → ahora `components/gmusic/StudentZoneGuard.tsx`
- `src/app/utils/api-client` → ahora `services/gmusic-api/`
- `server/src/server.ts` → ahora `server/index.ts`
- `routes/subscriptions.ts` → no existe; suscripciones via servicios Prisma

## 4. Rutas API reales

Base: `/api/v1`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/me/dashboard` | Dashboard: racha, XP, progreso módulo, próxima práctica |
| GET | `/me/path` | Camino pedagógico: módulos + nodos (locked/available/active/completed) |
| GET | `/me/access` | Validación acceso zona privada |
| POST | `/lesson-sessions` | Iniciar/reutilizar sesión de práctica |
| POST | `/lesson-sessions/:id/complete` | Cerrar sesión, calcular XP/racha/progreso |
| POST | `/dev/activate-semestral` | Activación dev (6 meses) — solo local |
| POST | `/dev/logout` | Cierra sesión dev |

**Apoderado** (contrato definido, implementación pendiente):
- `GET /guardian/students`
- `GET /guardian/students/:id/report`

**Seguridad**: El cliente nunca recibe `secureAnswer`, no envía `isCorrect` ni `xpEarned`. El servidor es la única fuente de verdad para XP, racha y progreso.

## 5. Auth dev — cookie con tres estados

Middleware `devStudentAuth` + `devStudentCookie.ts`:

| Cookie | Comportamiento |
|--------|----------------|
| `student:<email>.<hmac>` | Solo ese alumno |
| `logged_out.<hmac>` | 401, sin fallback |
| Sin cookie válida | Fallback a `GMUSIC_DEV_USER_EMAIL` (solo dev) |

- Nombre: `gmusic_dev_student_email` | Path: `/api/v1` | HttpOnly, SameSite=Strict, max-age 28800s
- Firma: HMAC-SHA256 con `GMUSIC_DEV_ACTIVATION_KEY` (mín. 24 chars, **nunca** en `VITE_*`)

## 6. Fases R3 — entregables

| Fase | Commit | Entregado |
|------|--------|-----------|
| R3.1 | `4daebeb` | Contrato y cliente GET /me/access |
| R3.2 | `c51a6f0` | StudentZoneGuard + useStudentAccess |
| R3.3A | `b66f238` | POST /dev/activate-semestral |
| R3.3B | `a55e1ba` | Cookie HttpOnly HMAC, devStudentAuth, POST /dev/logout |
| R3.3C | `5616e1c` | Funnel Semestral completo |
| R3.3D | `356f175` | Sesión pública Navbar + logout coherente |
| **R3.3E** | — | **Pendiente de especificación** |

## 7. Reglas de desarrollo

### TypeScript
- Strict mode. No `any` implícito.
- **No usar `process` ni `global` en frontend** → errores TS stale. Solución: `Cmd+Shift+P → TypeScript: Restart TS Server`. Usar `import.meta.env.VITE_*` para env vars.

### Git
- Commits descriptivos en inglés: `Add student access contract`
- **No push directo a main** sin acuerdo del arquitecto.
- Ramas: `git checkout -b feat/nombre`.

### Prisma
- `npm run prisma:generate` después de cambiar schema.
- `npm run db:seed` para poblar (idempotente).
- Prisma singleton en `server/lib/prisma.ts`.

## 8. Validación obligatoria

Antes de reportar "listo":

```bash
git diff --check
npm run api:typecheck && npm run api:test
npm run app:typecheck && npm run app:test
npm run build
```

Revisar `dist/` sin secretos. Tests (~316 app / ~105 api) — no reportar "listo" si falla alguno.

## 9. Comandos

```bash
npm run dev              # Frontend (5173)
npm run api:dev          # Backend Express (3001)
npm run app:typecheck    # TS frontend
npm run api:typecheck    # TS backend
npm run app:test         # Tests frontend
npm run api:test         # Tests backend
npm run build            # Build producción
npm run prisma:generate  # Regenerar Prisma client
npm run db:seed          # Seed DB
```

## 10. Errores comunes

- `process`/`global` en frontend → Restart TS Server
- Usar archivos deprecated (`src/app/utils/student-access-guard`, `src/app/utils/api-client`)
- Exponer `GMUSIC_DEV_ACTIVATION_KEY` en `VITE_*` o bundle
- Enviar `isCorrect` o `xpEarned` desde el cliente
- Inventar scope para R3.3E antes de especificación
- Push a `main` sin acuerdo del arquitecto

## 11. Fuentes de verdad

| Qué necesito | Dónde buscar |
|-------------|--------------|
| Endpoints REST, contratos | `docs/architecture/api-contract.md` |
| Motor de aprendizaje | `docs/architecture/learning-engine.md` |
| Arquitectura, fases R3, roles | `.cursorrules` |
| Decisiones de fase | Commits + `api-contract.md` (changelog al final) |
| Diseño | `design-system/tokens.css`, `design-system/MASTER.md` |