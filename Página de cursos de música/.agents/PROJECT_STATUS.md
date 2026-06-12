# Project Status — Gmusic Estudio

Última actualización: 12 Jun 2026 (post-Fase B ExPulsoAire — implementada, pendiente validación)

## Fases

| Fase | Descripción | Estado | Commit | Tests |
|------|-------------|--------|--------|-------|
| Fase 1 | Landing limpia + CTA dinámico en AcademiaSection | ✅ Completo | `5ad9517` | `fundamento-funnel.test.ts` |
| Fase 2 | Demo 5 clases (PathDemoPage + DemoLessonPage) | ✅ Completo | `2e41d9f` | `path-demo-page.test.ts`, `fundamento-funnel.test.ts` |
| Fase 3 | InscripcionGatePage gamificada + selector de planes | ✅ Completo | `2e41d9f` | `inscripcion-gate.test.ts` |
| Pre-Fase 4 | Bridge WhatsApp + videos YouTube en demo | ✅ Completo | `8ca6228` | `inscripcion-gate.test.ts` |
| Fase Precios | Modelo 3 tiers × 3 períodos + CLP en gate/registro | ✅ Completo | `cf3343c` | `inscripcion-gate.test.ts` (358 tests totales app) |
| R3 / zona alumno | Acceso, funnel Semestral dev, cofre Fase 6, R3.3E redirect | ✅ Completo (remoto) | `30e310b`…`6088dc5` | `public-session-flow.test.ts`, `map-dashboard.test.ts`, etc. |
| **Fase A** | **Reordenamiento pedagógico demo (5-class Fundamento arc)** | **✅ Completo** | **`90883a1`** | **`path-demo-page.test.ts` (358/358)** |
| **Fase B** | **ExPulsoAire — ejercicio TAP manual para Clases 4 y 5** | **⚠️ Implementada — pendiente validación y commit** | **sin commit** | **app:typecheck ✅ · app:test 358/358 ✅** |
| Fase 4 | Auth real (JWT/bcrypt/Prisma) | ⏸ Pausada — condicionada a conversión WhatsApp | — | — |
| Fase 5 | Flow + Resend + Webhooks | ⏸ Pausada — condicionada a Fase 4 | — | — |

---

## Inventario de páginas activas

Páginas montadas en `App.tsx` que **no** están detrás de `DEV_LEGACY`:

| Archivo | Ruta (`currentPage`) | Estado | Notas |
|---------|----------------------|--------|-------|
| `GmusicLanding.tsx` | `home` | ✅ Completo | Compone Hero, Academia, Planes, etc.; recibe `session` para CTA |
| `PathDemoPage.tsx` | `mi-camino-demo` | ✅ Completo | 5 nodos desde `DEMO_LESSONS`; progreso vía `useDemoProgress` |
| `DemoLessonPage.tsx` | `demo-clase-1` … `demo-clase-5` | ✅ Completo | Fases video → ejercicio → éxito; YouTube embed si `videoUrl` presente |
| `InscripcionGatePage.tsx` | `inscripcion-gate` | ✅ Completo | Selector período (default `semester`) + 3 tiers (`basico`/`plus`/`familiar`); Plus recomendado (`cf3343c`) |
| `InscripcionRegistroPage.tsx` | `inscripcion-registro` | ✅ Completo | Bridge WhatsApp; planId `{tier}-{period}`; fallback `plus-semester`; `WHATSAPP_NUMBER = "56953429676"` |
| `GmusicWelcome.tsx` | `mi-estudio`, `welcome` | ✅ Completo | Tras `StudentZoneGuard`; API dashboard real/mock |
| `GmusicPath.tsx` | `mi-camino` | ✅ Completo | Tras `StudentZoneGuard`; API path + lesson sessions |
| `FreeFundamentoLessonPage.tsx` | `fundamento-free-lesson` | 🗂️ Legacy activo | Ruta paralela; Hero/Planes aún apuntan aquí |
| `ProbarPage.tsx` | `probar` | 🗂️ Legacy activo | Página de prueba histórica |
| `CheckoutPage.tsx` | `checkout` | 🗂️ Legacy activo | Funnel Semestral directo (AuthModal → checkout) |
| `CourseDetailPage.tsx` | `course-detail` | 🗂️ Legacy activo | Catálogo legacy |
| `AlbumCoursesPages.tsx` | `album`, `courses` | 🗂️ Legacy activo | Catálogo legacy |
| `InstrumentCoursesPage.tsx` | `instrument-selector`, `instrument-courses` | 🗂️ Legacy activo | Selector instrumento legacy |
| `CommunityPage.tsx` | `community` | 🔴 Placeholder | Montada; alcance producto no verificado |

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

---

## Inventario de ejercicios del demo (estado post-Fase B)

Arc pedagógico activo: **Conoce → Afina → Cuerdas → Pulso → Canción**

| Clase | Título | Ejercicio | Componente | Estado |
|-------|--------|-----------|------------|--------|
| 1 | Conoce tu guitarra | MCQ — ¿dónde van las clavijas? (correctId: `headstock`) | `MultipleChoiceExercise` | ✅ |
| 2 | Afina tu guitarra | MCQ — ¿qué nota es la cuerda 6? (correctId: `e_mi`) | `MultipleChoiceExercise` | ✅ |
| 3 | Cuerdas al aire | Nombrar las 6 cuerdas | `Ex1Cuerdas` | ✅ |
| 4 | Pulso con cuerdas al aire | TAP manual — 8 beats (ver nota pedagógica) | `ExPulsoAire` | ⚠️ impl. pendiente commit |
| 5 | Tu primera canción | TAP manual — 10 beats (ver nota pedagógica) | `ExPulsoAire` | ⚠️ impl. pendiente commit |

**Nota pedagógica — diferencia Fable spec vs. implementación Cursor (Fase B):**

| | Fable especificó | Cursor implementó |
|-|-----------------|-------------------|
| Clase 4 | 8 beats alternando cuerdas 6/5/4 (`6 6 / 5 5 / 4 4 / 6 6`) | 8 beats en cuerda 6 al aire solamente |
| Clase 5 | 15 beats con 3 silencios automáticos (`6 6 — 6 / 5 5 — 5 / 4 4 5 6 / 6 — 6`) | 10 beats sin silencios (`6 6 6 / 5 5 5 / 4 4 5 6`) |

Pendiente: validación visual de Juan + decisión de Fable (aceptar v1 o patch pedagógico).
No bloqueante para el commit de Fase B — es una decisión de contenido, no un bug técnico.

**Componentes de ejercicio en zona alumno (ExerciseEngine / LessonPage — DEV_LEGACY):**

`Ex2NotasAm`, `Ex3NotasEm`, `Ex4CalidadAcorde`, `Ex5Secuencia` — solo en zona alumno, nunca en demo.

---

## Archivos sin commit (working tree actual)

**Fase B — implementada por Cursor, sin commit:**

| Archivo | Acción |
|---------|--------|
| `src/app/components/dashboard/exercises/ExPulsoAire.tsx` | Creado (untracked) |
| `src/app/data/demo-lessons.ts` | Modificado — `PulsoBeat` interface + `"ex-pulso-aire"` kind + Clases 4 y 5 actualizadas |
| `src/app/pages/DemoLessonPage.tsx` | Modificado — import + render case para `ExPulsoAire` |

**Pendiente de resolución:**

| Archivo | Problema |
|---------|---------|
| `src/app/data/demo-lessons.ts` (Clase 3) | `videoUrl` duplicado con Clase 2 — `TODO` insertado en el código; sin URL correcta definida aún |

---

## Modelo de precios activo

(`subscription-plans.ts`, commit `cf3343c`):

- Tiers: `basico`, `plus` (recomendado), `familiar` (3 perfiles)
- Períodos: `monthly`, `semester` (default UI), `annual`
- 9 `planId`: p. ej. `plus-semester`
- `PRICE_TABLE` CLP completo; ahorro en selector: Semestral 17%, Anual 25% (referencia Plus)

**WHATSAPP_NUMBER:** `56953429676` (formato wa.me correcto, commit `8ca6228`).

---

## Próximo paso operativo (Fase B validation loop)

1. [ ] Confirmar commit local de Fase B (hash pendiente — Juan autoriza mensaje)
2. [ ] Juan revisa en browser: Clases 4 y 5 con ExPulsoAire funcionando
3. [ ] Fable decide: aceptar v1 o aplicar patch pedagógico (secuencias de cuerdas alternadas + silencios)
4. [ ] Actualizar `.agents/` con resultado
5. [ ] Push solo con autorización explícita de Juan

---

## Pendientes documentados (no bloqueantes hoy)

- [ ] Clase 3 video: reemplazar embed duplicado (mismo que Clase 2) por video de cuerdas al aire
- [ ] Patch pedagógico Fase B: cuerdas alternadas en Clase 4, silencios automáticos en Clase 5 (post-validación)
- [ ] PostHog analytics — ~8 eventos de funnel — aprobado en principio, sin prioridad activa
- [ ] Limpieza rutas legacy — post-Fase 4, con plan de migración explícito
- [ ] Fase 4 Auth real — NO iniciar hasta primera conversión WhatsApp confirmada
- [ ] Fase 5 Flow + Resend — NO iniciar hasta Fase 4 completa
