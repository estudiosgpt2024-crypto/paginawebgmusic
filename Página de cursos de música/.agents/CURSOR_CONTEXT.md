# Cursor Context — Gmusic Estudio

Leer antes de cualquier tarea. Actualizar cuando cambie algo relevante en el repo.
Fuente canónica extendida: `.cursorrules`, `docs/CURSOR-CONTEXT.md`, `.agents/MEMORY.md`.

---

## Stack técnico

- **Frontend:** React 18 + TypeScript strict + Vite 6 + Tailwind v4 + `motion/react` (Framer Motion)
- **Routing:** string-based SPA (`currentPage` + `handlePageChange` en `App.tsx`) — **NO** React Router como eje principal
- **Backend:** Express + Prisma 6 + PostgreSQL (Docker local; Supabase opcional staging)
- **Tests:** Node test runner (`node --import tsx --test`) — **NO** Jest/Vitest
- **Typecheck:** `npm run app:typecheck` / `npm run api:typecheck`

---

## Comandos esenciales

```bash
npm run app:test        # tests frontend
npm run app:typecheck   # TypeScript frontend
npm run api:typecheck   # TypeScript backend
npm run api:test        # tests backend
npm run dev             # Vite :5173
npm run api:dev         # Express :3001
npm run build           # build producción
```

**Última ejecución auditada:** `npm run app:test` → **356 pass / 0 fail** (128 suites).

---

## Rutas activas — funnel principal

| Ruta (`currentPage`) | Componente | Navbar | Notas |
|----------------------|------------|--------|-------|
| `home` | `GmusicLanding` | ✅ | Landing embudo |
| `mi-camino-demo` | `PathDemoPage` | ❌ | 5 nodos demo |
| `demo-clase-1` … `demo-clase-5` | `DemoLessonPage` | ❌ | Regex en App |
| `inscripcion-gate` | `InscripcionGatePage` | ❌ | Requiere 5 clases completas |
| `inscripcion-registro` | `InscripcionRegistroPage` | ❌ | Bridge WhatsApp (temporal) |
| `mi-estudio` / `welcome` | `GmusicWelcome` | ❌ | `StudentZoneGuard` + `/alumno` |
| `mi-camino` | `GmusicPath` | ❌ | `StudentZoneGuard` + `/mi-camino` |

Exclusiones Navbar/MusicPlayer definidas en `App.tsx` (~L229 y ~L380).

---

## Rutas legacy / paralelas activas

| Ruta | Componente | Por qué existe |
|------|------------|----------------|
| `fundamento-free-lesson` | `FreeFundamentoLessonPage` | Clase gratuita legacy; Hero/Planes aún navegan aquí |
| `probar` | `ProbarPage` | Sandbox histórico |
| `checkout` | `CheckoutPage` | Funnel Semestral directo (AuthModal → pago dev) |
| `course-detail`, `album`, `courses`, … | `legacy/*` | Catálogo música legacy |

---

## Rutas DEV_LEGACY (solo `import.meta.env.DEV`)

| Ruta | Componente |
|------|------------|
| `dashboard` | `DashboardPage` |
| `lesson` | `LessonPage` + `ExerciseEngine` |
| `curriculum` | `CurriculumPage` |

---

## localStorage keys

| Clave | Shape | Propietario |
|-------|-------|-------------|
| `gmusic:demo_v1` | `{ completed: number[] }` | `useDemoProgress` |
| `gmusic:selected_plan_v1` | `{ planId: "monthly"\|"semester"\|"annual" }` | `InscripcionGatePage` → leído en `InscripcionRegistroPage` |

---

## Ejercicios — demo vs. zona alumno

| Ejercicio | Demo | Zona alumno |
|-----------|------|-------------|
| MCQ (`MultipleChoiceExercise`) | Clases 1, 3 | — |
| `Ex1Cuerdas` | Clase 2 | `ExerciseEngine` #1 |
| `Ex2NotasAm` | — | `ExerciseEngine` #2 |
| `Ex3NotasEm` | — | `ExerciseEngine` #3 |
| `Ex4CalidadAcorde` | Clase 4 | `ExerciseEngine` #4 |
| `Ex5Secuencia` | Clase 5 | `ExerciseEngine` #5 |

---

## Variables de entorno (`.env.example`)

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Postgres local / staging |
| `API_PORT` | Express (default 3001) |
| `GMUSIC_DEV_USER_EMAIL` | Auth dev fallback |
| `GMUSIC_DEV_ACTIVATION_KEY` | Dev activate-semestral (nunca `VITE_*`) |
| `VITE_API_BASE_URL` | Cliente API frontend |
| `VITE_USE_DASHBOARD_MOCK` | Mock dashboard UI |
| `VITE_USE_PATH_MOCK` | Mock path UI |

Fase 4 añadirá `JWT_SECRET` (ver skill auth).

---

## Skills en `.agents/skills/`

| Skill | Una línea |
|-------|-----------|
| `gmusic-agent-workflow` | Protocolo Fable/Cursor: leer skills, auditar, test, no commit sin OK |
| `gmusic-funnel-conversion` | Funnel público: demo 5 clases, gate, planes, CTA, localStorage |
| `gmusic-game-progression-architecture` | Progresión, matriz 3×3, funnel Semestral, bloqueos WCAG |
| `gmusic-auth-email-verification` | Auth JWT Fase 4: cookies, bcrypt, estados sesión |
| `gmusic-welcome` | Mi Estudio: dashboard, cofre, métricas |
| `gmusic-path` | Mi Camino: mapa serpentino, sesiones |
| `gmusic-learning-engine` | Backend REST: XP, racha, lesson sessions |
| `gmusic-edu-gamified-design` | Tokens gamificación, UI tipo Duolingo adaptada |
| `gmusic-visual-vfx` | LED, ChunkyButton, overlay cofre, atmósfera |

---

## Archivos que Cursor NO debe tocar

Ver `.agents/DO_NOT_TOUCH.md`.

---

## Protocolo antes de cualquier cambio

1. Leer `.agents/MEMORY.md`
2. Leer el Skill que gobierna la tarea
3. Verificar `.agents/DO_NOT_TOUCH.md`
4. Correr validación: `app:typecheck`, `app:test`, `build` (y api si aplica)
5. **No commitear** sin autorización de Juan
6. **No push a `main`** sin acuerdo del arquitecto

---

## Troubleshooting TS (falso positivo LSP)

Errores `Cannot find name 'process'/'global'` en el panel de VS Code suelen ser **cache stale del TS server**, no errores reales (`npm run app:typecheck` pasa).

Fix: `Cmd+Shift+P` → **TypeScript: Restart TS Server**.

Ver también `CURSOR-INSTRUCTIONS.md` en raíz (recomendado mover/absorber aquí).

---

## Dónde buscar qué

| Necesito… | Archivo |
|-----------|---------|
| Estado por fase | `.agents/PROJECT_STATUS.md` |
| Roadmap | `.agents/ROADMAP.md` |
| Zonas protegidas | `.agents/DO_NOT_TOUCH.md` |
| Endpoints REST | `docs/architecture/api-contract.md` |
| Funnel canónico | `.agents/skills/gmusic-funnel-conversion/SKILL.md` |
| Decisiones estratégicas | `.agents/decisions/` |
