---
name: gmusic-visual-vfx
description: >-
  Leyes de efectos especiales e iluminación de Gmusic Estudio: ChunkyButton
  mecánico, LED de progreso WebKit-safe, sombras de volumen tokenizadas y
  overlay cinematográfico del cofre semanal. Usar cuando la tarea toque luces,
  VFX, CSS de atmósfera, profundidad o animaciones táctiles del dashboard.
---

# Gmusic Visual VFX

Usar este skill cuando la tarea toque **luces, VFX, CSS de atmósfera, profundidad, LED, overlay o animaciones táctiles** — no para lógica de juego (ver `gmusic-game-progression-architecture`) ni layout de grilla (ver `DESIGN.md` + `gmusic-welcome`).

## Fuentes locales obligatorias

1. `AGENTS.md`
2. `design-system/tokens.css` — fuente de verdad CSS
3. `src/app/components/gmusic/tokens.ts` — espejo `DASH_TOKENS`
4. `src/styles/index.css` — clases de atmósfera (`.dash-*`, overlay cofre)
5. `src/app/components/gmusic/dashboard/dashboard-depth.css` — física ChunkyButton

Complemento de pantalla: skill del módulo activo (`gmusic-welcome`, `gmusic-path`).

---

## Regla madre

**Cinemática premium primero.** Gamificación como interacción, no como disfraz visual. No copiar assets ni estética propietaria de Duolingo.

Orden de implementación en dashboard:

1. Grilla estable (12 cols) — ver `DESIGN.md`
2. Tokens de elevación (`--dash-surface-*`, `--dash-shadow-*`)
3. VFX puntuales (LED, chunky, cofre) sobre tokens

---

## ChunkyButton — hardware mecánico (pedal de guitarra)

Archivos: `ChunkyButton.tsx`, `dashboard-depth.css`

| Propiedad | Valor | Token |
|-----------|-------|-------|
| Altura mínima | `58px` | — |
| Radio | `14px` | — |
| Transición | `80ms ease` | `--btn-premium-transition` |
| Active press | `translateY(3px)` | CSS `.chunky-btn:active` |
| Sombra reposo | sombra inferior + halo dorado | `--btn-premium-shadow-rest` |
| Sombra activa | plana, pedal presionado | `--btn-premium-shadow-active` |

**Reglas:**

- Variante default: `variant="premium"` (dorado de marca, no verde práctica).
- Estados obligatorios: hover, focus-visible, active, disabled, loading (`aria-busy` + spinner).
- Spinner respeta `prefers-reduced-motion: reduce` (sin animación continua).
- **No** mutar colores con `onMouseEnter` inline; delegar a CSS y tokens.
- **Prohibido:** animaciones continuas en WebKit (pulse/ping en CTAs premium).

---

## LED azul de consola — barra de progreso

Archivos: `MetricCard.tsx`, `index.css`, tokens `--dash-progress-*`

Optimización WebKit (Claude): usar **`filter: drop-shadow()`** en `.dash-progress-led`, **no** `box-shadow` en el LED (evita paint layers extra).

| Elemento | Clase | Reglas |
|----------|-------|--------|
| Track | `.dash-progress-track` | `overflow: hidden`, `border-radius: 999px`, clip nativo |
| Relleno | `.dash-progress-fill` | gradiente dorado tokenizado |
| LED | `.dash-progress-led` | `#38bdf8`, glow vía `--dash-progress-led-glow`, `will-change: transform, opacity` **solo aquí** |

**Lógica:**

- Normalizar porcentaje con `normalizeDashboardProgressPercent()` (0–100).
- Ocultar LED completamente si progreso === 0.
- No reintroducir LED azul con box-shadow pesado.

---

## Sombras de volumen — elevación de cards

Archivos: `PremiumCard.tsx`, `design-system/tokens.css`

| Nivel | Prop `elevation` | Tokens |
|-------|------------------|--------|
| Reposo | `rest` (default) | `--dash-shadow-rest`, `--dash-surface-metric` |
| Destacado | `raised` | `--dash-shadow-raised`, `--dash-surface-accent` |

`PracticeCard` usa `elevation="raised"`. Métricas y locked en `rest`.

No hardcodear hex en cards hijas; consumir `DASH_TOKENS` o CSS vars.

---

## Locked cards — contraste sin opacidad global

Clase: `.dash-locked-card` en `index.css`

- Superficie: `--dash-surface-locked` (#0d0d0d)
- Texto AA: `--dash-locked-text` / `--dash-locked-text-muted`
- **Prohibido:** `opacity: 0.6` o `pointer-events: none` en contenedor
- Candado: Lucide, `strokeWidth={1.5}`, `currentColor`

---

## Cofre semanal — spotlight cenital (Radix + overlay)

Archivos: `WeeklyChestCelebrationShell.tsx`, `index.css`

- Wrapper obligatorio: `Dialog` de `src/app/components/ui/dialog.tsx` (Radix).
- ARIA: `aria-labelledby="weekly-chest-title"`, `aria-describedby="weekly-chest-description"`.
- Overlay cinematográfico vía selector `[data-slot="dialog-overlay"]` cuando contiene `.weekly-chest-celebration-dialog`:

```css
backdrop-filter: blur(var(--dash-chest-overlay-blur));
-webkit-backdrop-filter: blur(var(--dash-chest-overlay-blur));
```

- Fallback obligatorio para navegadores sin backdrop-filter:

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  background: var(--dash-chest-overlay-fallback);
}
```

- Motion (`motion/react`) **solo en el interior** del `DialogContent`, no en overlay raw.
- Estado tipado: `WeeklyChestCelebrationState` → `idle | opening | reward-revealed | closing`.

---

## Tipografía — regla de oro

- **Prohibido:** `letter-spacing` negativo y clases `tracking-[-...]` en entorno dashboard.
- Test guardián: `dashboard-typography.test.ts`
- Tracking positivo en eyebrows (`tracking-[0.16em]`, etc.) se conserva.

---

## Prohibiciones VFX

- No usar `--edu-success` (verde) en capa de atmósfera premium dorada.
- No añadir glows ambientales de página en Mi Estudio (radiales de fondo) en sprints de VFX puntual.
- No crear modales raw; siempre Radix Dialog del sistema.
- No commit salvo autorización explícita.

---

## QA mínima

1. `npm run app:test` — `dashboard-atmosphere.test.ts`, `dashboard-depth.test.ts`, `weekly-chest-celebration.test.ts`
2. `npm run build`
3. Verificar LED visible solo con progreso > 0
4. Verificar ChunkyButton: press 3px + sombra activa
5. Verificar overlay cofre en Safari (dual `-webkit-backdrop-filter`)
