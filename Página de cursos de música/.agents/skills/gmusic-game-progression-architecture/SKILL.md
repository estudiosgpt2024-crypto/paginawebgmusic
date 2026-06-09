---
name: gmusic-game-progression-architecture
description: >-
  Arquitectura de progresión y conversión de Gmusic: matriz Academia 3×3,
  funnel Semestral lineal, estados de bloqueo WCAG AA y semántica de juego
  premium sin infantilizar. Usar cuando la tarea toque niveles, XP, funnel
  público, suscripción mock, Academia o cards bloqueadas.
---

# Gmusic Game Progression Architecture

Usar este skill cuando la tarea toque **mecánicas de juego**, **progresión**, **funnel de conversión**, **matriz de niveles** o **estados bloqueados** — no para CSS/VFX (ver `gmusic-visual-vfx`) ni layout base (ver `gmusic-welcome` / `DESIGN.md`).

## Fuentes locales obligatorias

1. `AGENTS.md`
2. `DESIGN.md`
3. `src/app/utils/academia-track-matrix.ts`
4. `src/app/utils/public-subscription-flow.ts`
5. `src/app/App.tsx` (funnel y red de seguridad pública)

Complemento visual/gamificado: skill `gmusic-edu-gamified-design`.

---

## Matriz reactiva Academia 3×3

Fuente: `academia-track-matrix.ts`

**Ejes:**

| Eje | Valores | UI pública |
|-----|---------|------------|
| **Nivel (tier)** | `basico`, `intermedio`, `avanzado` | Selectores: `Nivel 1 · Básico`, `Nivel 2 · Intermedio`, `Nivel 3 · Avanzado` |
| **Enfoque (focus)** | `fundamento`, `tecnica`, `crea` | Tres tarjetas por nivel activo |

**Reglas de producto:**

- Exactamente **9 combinaciones** tier × focus; títulos compuestos (`Fundamento Básico`, etc.).
- Solo **`basico` + `fundamento`** abre la clase gratuita pública (`fundamento-free-lesson`).
- El resto de celdas son preview/comercial; no inventar progreso, XP ni racha en landing.
- No usar rutas legacy (`probar`, `fundamento-preview` como destino principal, `LessonRunnerShell` en anónimo).

**Componentes cableados:**

- `InteractiveLevelSelector.tsx` — selector 3×3
- `HeroSection.tsx` / `PlanesSection.tsx` — CTAs al funnel
- `fundamento-funnel.test.ts` — contratos de la matriz

---

## Funnel de conversión lineal (Semestral)

Fuente: `public-subscription-flow.ts` + `App.tsx`

Flujo obligatorio y secuencial:

```
Plan Semestral (PlanesSection)
  → AuthModal (tab register)
  → CheckoutPage (SEMESTRAL_CHECKOUT_COURSE)
  → mi-estudio (zona alumno)
```

**Reglas:**

- `handleSemestralPlanSelect` activa `pendingSemestralCheckout` y abre registro.
- `handleAuthSuccess` con checkout pendiente navega a `checkout`, no a curso legacy.
- `handleCheckoutSuccess` lleva a `mi-estudio`, no a `course-detail`.
- Mensual/Anual: no seleccionables en esta fase (placeholders visuales).
- Navbar público: `onSignIn` / `onRegister` activos; sin acceso directo a Mi Estudio anónimo.

**Clase gratuita (paralela, no sustituye Semestral):**

- Ruta: `fundamento-free-lesson` → `FreeFundamentoLessonPage` (consola Video → Desafío → Éxito).
- Red de seguridad: `isPublicFreeLessonPage()` cubre alias (`fundamento-preview`, etc.).

---

## Semántica de bloqueo (WCAG AA)

El bloqueo se comunica por **diseño y copy**, no rompiendo el componente.

**LockedFeatureCard / nav bloqueada:**

- Tokens: `--dash-surface-locked`, `--dash-locked-text` (#7a7a7a), `--dash-locked-text-muted` (#555555).
- Texto principal legible a **14px** sobre `#0d0d0d`.
- Candado Lucide: `strokeWidth={1.5}`, `currentColor`, tono muted semántico.
- **Prohibido:** `opacity: 0.6` o `pointer-events: none` en el contenedor global de la card.
- Copy de plan completo: `"Disponible en el plan completo"` (`LOCKED_NAV_MODAL` en header interno).

**Mi Estudio — features futuras:**

- Desafío del Día y Laboratorio: bloqueados con badge "Próximamente", no rutas fantasma.
- Mi Progreso / Comunidad: modal placeholder, no páginas legacy.

---

## Progresión en zona alumno (estado actual)

| Capa | Estado | Archivo |
|------|--------|---------|
| Dashboard | API mock vía `useDashboard` | `GmusicWelcome.tsx` |
| Camino | Ruta serpenteante + sesiones | `GmusicPath.tsx` |
| XP / racha | Métricas visuales; cofre = shell (`WeeklyChestCelebrationShell`) | dashboard/* |
| Cofre semanal | UI shell; lógica de apertura en fase posterior | `WeeklyChestCelebrationShell.tsx` |

No implementar backend real, pagos reales ni Tonal.js salvo fase explícita.

---

## Prohibiciones

- No mezclar funnel público con componentes legacy del dev funnel.
- No usar verde `--edu-success` como marca global; reservado para acciones de práctica.
- No commit salvo autorización explícita.
- No borrar bloques existentes del dashboard al extender progresión.

---

## QA mínima

1. `npm run app:test` — especialmente `fundamento-funnel.test.ts`, `dashboard-atmosphere.test.ts`.
2. Matriz 3×3: 9 celdas, solo Fundamento Básico → clase gratuita.
3. Semestral: registro → checkout → `/alumno`.
4. Locked cards: contraste AA, sin opacity global en contenedor.
