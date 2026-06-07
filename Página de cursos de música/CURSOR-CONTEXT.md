# CURSOR CONTEXT — Gmusic Estudio v1
> Leer este archivo al inicio de cada sesión. Es la fuente de contexto compartida entre Figma Make y Cursor.
> Última actualización: 2026-06-05

---

## 1. Qué es este proyecto

**Gmusic Estudio** — academia de música online.
Primer programa disponible: **Guitarra · 12 meses**.
El producto vende constancia y hábito, no un catálogo de cursos.

### Flujo v1
```
Home (landing pública)
  → CTA "Probar gratis"
    → /probar (formulario nombre + email → video placeholder 7–8 min)
      → [Etapa 02] video real + lead storage
        → [Etapa 03] registro + suscripción
```

### Etapas del producto
| Etapa | Nombre | Estado |
|---|---|---|
| 01 | Público y deseo — Home + /probar | EN CURSO |
| 02 | Enganche gratis — video real + lead | Pendiente |
| 03 | Cuenta y suscripción | Pendiente |
| 04–08 | App de academia | Futuro |

---

## 2. Stack

- React 18 + TypeScript
- Tailwind CSS v4
- Motion (motion/react) para animaciones
- Vite (dev server ya corriendo — no ejecutar `vite` ni `npm run dev`)
- pnpm (no npm)

---

## 3. Sistema visual — tokens

Archivo fuente: `design-system/tokens.css`

```
--bg-base:       #080808    ← fondo global
--bg-surface:    #111111    ← cards, nav
--bg-mid:        #0D0D0D    ← secciones alternas
--gold-primary:  #C9A84C    ← CTAs, acentos (COLOR PRINCIPAL)
--gold-soft:     #E8C97A    ← hover de CTAs
--gold-border:   rgba(201,168,76,0.18)
--text-primary:  #F5F0E8    ← titulares, blanco cálido
--text-secondary:#8A8A8A    ← body, subtítulos
--border-subtle: rgba(255,255,255,0.06)
--max-width:     1280px
--padding-x:     80px
--section-py:    120px
--radius-sm:     2px        ← botones, cards, inputs
--radius-md:     4px        ← imágenes
```

**Tipografía**
- Display / H1: `Playfair Display`, serif — peso 400
- Body / Labels: `Inter`, sans-serif
- Eyebrow: Inter 11px, uppercase, tracking 3px, color dorado

**Reglas visuales críticas**
- Azul (#2563EB, #3B82F6) NO es color protagonista — solo acento mínimo
- `border-radius` estándar: `2px` — no pill (999px), no redondeado (12px)
- Secciones alternas: cambio de fondo (#080808 ↔ #0D0D0D), no líneas divisoras
- MusicPlayer NO aparece en `home` ni en `probar`

---

## 4. Estructura de archivos — estado actual

```
/
├── .claude/commands/           ← slash commands para agentes
│   ├── orquestador.md
│   ├── landing.md
│   ├── diseno.md
│   ├── copy.md
│   ├── arquitecto.md
│   └── qa.md
│
├── design-system/
│   ├── MASTER.md               ← tokens documentados
│   └── tokens.css              ← variables CSS (fuente de verdad)
│
├── docs/
│   ├── FIGMA-CODIGO-CONTEXTO.md
│   └── etapas/
│       ├── 00-MASTER.md
│       └── 01-publico-deseo/
│           ├── 01.1-COPY-CONVERSION.md   ← COPY APROBADO
│           ├── 01.2-IMPLEMENTACION.md
│           ├── 01.3-PROBAR-SCOPE.md
│           ├── 01.4-HOME-VS-01.1.md      ← desalineaciones
│           └── DECISIONES.md
│
└── src/app/
    ├── App.tsx                 ← routing principal
    ├── pages/
    │   ├── GmusicLanding.tsx   ← Home — orquesta las 6 secciones
    │   ├── ProbarPage.tsx      ← /probar
    │   ├── CommunityPage.tsx   ← comunidad (página interna)
    │   └── [legacy — no tocar en v1]
    │       ├── AlbumCoursesPages.tsx
    │       ├── CheckoutPage.tsx
    │       ├── InstrumentCoursesPage.tsx
    │       └── InstrumentSelectorPage.tsx
    ├── components/
    │   ├── music/
    │   │   ├── Navbar.tsx              ← aprobado, no reorganizar
    │   │   ├── MusicPlayer.tsx         ← legacy activo
    │   │   ├── InteractiveLevelSelector.tsx  ← tarjetas Academia
    │   │   ├── AuthModal.tsx
    │   │   └── Cards.tsx
    │   └── ui/
    │       └── OptimizedImage.tsx
    └── styles/
        ├── tokens.css          ← pendiente: importar design-system/tokens.css
        ├── theme.css
        ├── animations.css
        └── fonts.css
```

### Estructura objetivo (migración pendiente)
```
src/app/components/marketing/sections/
├── HeroSection.tsx
├── AcademiaSection.tsx
├── ComunidadSection.tsx
├── PlanesSection.tsx
└── ContactoSection.tsx
```
Hoy todo está en `GmusicLanding.tsx`. La migración a secciones separadas es Etapa de organización, no v1 bloqueante.

---

## 5. Home — secciones y anclas

| # | ID | Nav label | Estado |
|---|---|---|---|
| 1 | `hero` | Inicio | ✅ implementado |
| 2 | `academia` | Academia | ✅ implementado |
| 3 | `comunidad` | Comunidad | ✅ implementado |
| 4 | `planes` | Ver planes | ✅ implementado |
| 5 | `contacto` | Contacto | ✅ implementado |

**Navbar:** Inicio · Academia · Comunidad · Ver planes · Contacto + `Iniciar sesión`
Archivo: `src/app/components/music/Navbar.tsx`

---

## 6. Copy aprobado — reglas

Fuente única: `docs/etapas/01-publico-deseo/01.1-COPY-CONVERSION.md`

**Prohibido inventar:**
- Precios ($9, $60, $90 — lo que sea)
- Cifras sociales ("+2,800 músicos", "234 alumnos activos")
- Testimonios sin aprobar

**Copy clave del Hero:**
```
Eyebrow:  Academia de música · Primer curso: Guitarra
H1:       Aprende música con constancia.
H2:       Empieza con guitarra. Avanza a tu propio ritmo.
CTA 1:    Probar gratis  →  setPage("probar")
CTA 2:    Conocer academia  →  scroll #academia
Micro:    Sin tarjeta de crédito · 7 min al día · Método completo
```

---

## 7. /probar — scope v1

Archivo: `src/app/pages/ProbarPage.tsx`

```
Estado A:  Formulario → Nombre + Email + botón "Ver la clase gratis"
Estado B:  Título del video + placeholder 16:9
```

**NO implementar en v1:** Supabase, video real, redirect a registro, lección bloqueada.
Detalle completo: `docs/etapas/01-publico-deseo/01.3-PROBAR-SCOPE.md`

---

## 8. Routing — App.tsx

```typescript
currentPage === "home"              → GmusicLanding
currentPage === "probar"            → ProbarPage
currentPage === "community"         → CommunityPage
currentPage === "courses"           → CoursesPage (legacy)
currentPage === "instrument-courses"→ InstrumentCoursesPage (legacy)
currentPage === "course-detail"     → CourseDetailPage (legacy)
currentPage === "checkout"          → CheckoutPage (legacy)
```

MusicPlayer se renderiza solo cuando `currentPage !== "home"` y `currentPage !== "probar"`.

---

## 9. Comandos disponibles (slash commands)

En Cursor puedes invocar estos contextos especializados:

| Comando | Cuándo usarlo |
|---|---|
| `/orquestador` | Inicio de sesión, orientación general |
| `/landing` | Trabajar cualquier sección del Home |
| `/diseno` | Tokens, componentes visuales, verificar sistema |
| `/copy` | Verificar o escribir textos |
| `/arquitecto` | Mover archivos, reorganizar carpetas |
| `/qa` | Checklist final antes de dar algo por listo |

---

## 10. Qué NO hacer en v1

- No rediseñar en el IDE — Figma es la referencia visual
- No implementar Supabase ni backend
- No promover en nav: álbumes, reproductor, selector de instrumento
- No tocar `__figma__entrypoint__.ts` — generado automáticamente
- No ejecutar `vite`, `npm run dev` ni `vite build` — el servidor ya corre
- No cambiar `node_modules/`
- No usar `npm` — usar `pnpm`

---

## 11. Desalineaciones activas (no bloquean, documentadas)

Ver detalle: `docs/etapas/01-publico-deseo/01.4-HOME-VS-01.1.md`

| Elemento | Docs dicen | Código actual |
|---|---|---|
| inputs border-radius | 2px | 12px en algunos componentes |
| Algunos botones | 2px | 999px (pill) en legacy |
| `landing-premium.css` | debe estar en tokens.css | existe suelto |
| `.md` en raíz del proyecto | deben estar en docs/ | ATTRIBUTIONS.md, etc. |
