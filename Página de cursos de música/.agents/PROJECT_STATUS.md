# Project Status — Gmusic Estudio

Última actualización: 10 Jun 2026 (auditoría Cursor, solo lectura de código)

## Fases

| Fase | Descripción | Estado | Commit | Tests |
|------|-------------|--------|--------|-------|
| Fase 1 | Landing limpia + CTA dinámico en AcademiaSection | ✅ Completo | `5ad9517` | `fundamento-funnel.test.ts` |
| Fase 2 | Demo 5 clases (PathDemoPage + DemoLessonPage) | ✅ Completo | `2e41d9f` | `path-demo-page.test.ts`, `fundamento-funnel.test.ts` |
| Fase 3 | InscripcionGatePage gamificada + selector de planes | ✅ Completo | `2e41d9f` | `inscripcion-gate.test.ts` |
| Pre-Fase 4 | Bridge WhatsApp + videos YouTube en demo | ⚠️ Implementado, sin commit | — | `inscripcion-gate.test.ts` (modificado sin commit) |
| R3 / zona alumno | Acceso, funnel Semestral dev, cofre Fase 6, R3.3E redirect | ✅ Completo (remoto) | `30e310b`…`6088dc5` | `public-session-flow.test.ts`, `map-dashboard.test.ts`, etc. |
| Fase 4 | Auth real (JWT/bcrypt/Prisma) | ⏸ Pausada | — | — |
| Fase 5 | Flow + Resend + Webhooks | ⏸ Pausada | — | — |

## Inventario de páginas activas

Páginas montadas en `App.tsx` que **no** están detrás de `DEV_LEGACY`:

| Archivo | Ruta (`currentPage`) | Estado | Notas |
|---------|----------------------|--------|-------|
| `GmusicLanding.tsx` | `home` | ✅ Completo | Compone Hero, Academia, Planes, etc.; recibe `session` para CTA |
| `PathDemoPage.tsx` | `mi-camino-demo` | ✅ Completo | 5 nodos desde `DEMO_LESSONS`; progreso vía `useDemoProgress` |
| `DemoLessonPage.tsx` | `demo-clase-1` … `demo-clase-5` | ✅ Completo | Fases video → ejercicio → éxito; YouTube embed si `videoUrl` presente |
| `InscripcionGatePage.tsx` | `inscripcion-gate` | ✅ Completo | `LockedGate` si demo incompleto; selector 3 planes |
| `InscripcionRegistroPage.tsx` | `inscripcion-registro` | ⚠️ Parcial | Bridge WhatsApp; `WHATSAPP_NUMBER = "569XXXXXXXXX"` (L9) |
| `GmusicWelcome.tsx` | `mi-estudio`, `welcome` | ✅ Completo | Tras `StudentZoneGuard`; API dashboard real/mock |
| `GmusicPath.tsx` | `mi-camino` | ✅ Completo | Tras `StudentZoneGuard`; API path + lesson sessions |
| `FreeFundamentoLessonPage.tsx` | `fundamento-free-lesson` | 🗂️ Legacy activo | Ruta paralela; Hero/Planes aún apuntan aquí |
| `ProbarPage.tsx` | `probar` | 🗂️ Legacy activo | Página de prueba histórica |
| `CheckoutPage.tsx` | `checkout` | 🗂️ Legacy activo | Funnel Semestral directo (AuthModal → checkout) |
| `CourseDetailPage.tsx` | `course-detail` | 🗂️ Legacy activo | Catálogo legacy |
| `AlbumCoursesPages.tsx` | `album`, `courses` | 🗂️ Legacy activo | Catálogo legacy |
| `InstrumentCoursesPage.tsx` | `instrument-selector`, `instrument-courses` | 🗂️ Legacy activo | Selector instrumento legacy |
| `CommunityPage.tsx` | `community` | 🔴 Placeholder | Montada; alcance producto no verificado en esta auditoría |

**Solo en `import.meta.env.DEV` (`DEV_LEGACY`):**

| Archivo | Ruta | Estado |
|---------|------|--------|
| `DashboardPage.tsx` | `dashboard` | 🗂️ Dev legacy |
| `LessonPage.tsx` | `lesson` | 🗂️ Dev legacy (`ExerciseEngine`) |
| `CurriculumPage.tsx` | `curriculum` | 🗂️ Dev legacy |

**Existe pero no montada en `App.tsx`:**

| Archivo | Notas |
|---------|-------|
| `FundamentoPreviewPage.tsx` | Conservada; tests confirman que no se monta en App |

## Inventario de ejercicios del demo

| Componente | Demo (`DemoLessonPage`) | Zona alumno (`ExerciseEngine` / `LessonPage`) | Clase demo |
|------------|-------------------------|-----------------------------------------------|------------|
| `MultipleChoiceExercise` | ✅ Clases 1 y 3 (MCQ en `demo-lessons.ts`) | ❌ | demo-clase-1, demo-clase-3 |
| `Ex1Cuerdas.tsx` | ✅ Clase 2 (`ex1-cuerdas`) | ✅ `ExerciseEngine` paso 0 | demo-clase-2 |
| `Ex2NotasAm.tsx` | ❌ | ✅ `ExerciseEngine` paso 1 | — |
| `Ex3NotasEm.tsx` | ❌ | ✅ `ExerciseEngine` paso 2 | — |
| `Ex4CalidadAcorde.tsx` | ✅ Clase 4 (`ex4-calidad-acorde`) | ✅ `ExerciseEngine` paso 3 | demo-clase-4 |
| `Ex5Secuencia.tsx` | ✅ Clase 5 (`ex5-secuencia`) | ✅ `ExerciseEngine` paso 4 | demo-clase-5 |

**Gap curricular documentado:** Clase 4 (video: notas y sostenidos) usa `ex4-calidad-acorde` (calidad mayor/menor). `Ex2NotasAm` no está cableado al demo.

## Archivos sin commit (working tree)

Según `git status` al momento de la auditoría:

**Modificados (unstaged):**

- `.agents/skills/gmusic-game-progression-architecture/SKILL.md`
- `src/app/components/dashboard/VideoPlayerLesson.tsx`
- `src/app/data/demo-lessons.ts`
- `src/app/pages/DemoLessonPage.tsx`
- `src/app/pages/InscripcionGatePage.tsx`
- `src/app/pages/InscripcionRegistroPage.tsx`
- `src/app/pages/inscripcion-gate.test.ts`

**Sin rastrear:**

- `.agents/MEMORY.md`
- `.agents/skills/gmusic-agent-workflow/SKILL.md`
- `.agents/skills/gmusic-auth-email-verification/SKILL.md`
- `.agents/skills/gmusic-funnel-conversion/SKILL.md`
- `CURSOR-INSTRUCTIONS.md` (raíz)
- `TODO-fix-ts-errors.md` (raíz)

**Nota git:** `main` local estaba **2 commits ahead** de `origin/main` (`5ad9517`, `2e41d9f`) además de los cambios unstaged anteriores.

## Pendientes inmediatos

- [ ] WhatsApp real (`569XXXXXXXX`) — reemplazar placeholder en `InscripcionRegistroPage.tsx` L9 (`WHATSAPP_NUMBER`)
- [ ] Precios reales CLP (Mensual / Semestral / Anual) — `subscription-plans.ts`: todos los `price: null`
- [ ] Decisión Clase 4: ejercicio curricular (`ex4-calidad-acorde` vs. `Ex2NotasAm` / contenido del video)
- [ ] Decisión Skills curriculares: ¿repo git o Notion/Drive?
- [ ] Autorización commit Pre-Fase 4 (bridge WhatsApp + YouTube + Skills nuevos)
- [ ] Push de commits funnel (`5ad9517`, `2e41d9f`) si aún no están en remoto
