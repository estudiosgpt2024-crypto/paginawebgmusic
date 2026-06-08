# Gmusic Estudio — instrucciones para agentes

Academia de guitarra online. Stack: React + Vite. Navegación por `currentPage` en `App.tsx`.

## Skills unificados

Fuente de verdad: **`.agents/skills/`**

| Skill | Cuándo usarlo |
|-------|---------------|
| `gmusic-welcome` | Mi Estudio, `GmusicWelcome.tsx` |
| `gmusic-path` | Mi Camino, `GmusicPath.tsx` |
| `gmusic-edu-gamified-design` | Diseño gamificado de cursos, progreso, XP, racha y estilo tipo Duolingo adaptado a Gmusic |
| `gmusic-learning-engine` | Backend/motor de aprendizaje, microejercicios, Prisma, XP, rachas y apoderados |

Registro completo: `skills.manifest.yaml`

Guía visual local: `DESIGN.md`

### Sincronizar entre Cursor, Codex y Antigravity

```bash
./scripts/sync-skills.sh           # espejo → .cursor/skills/
./scripts/sync-skills.sh --global  # además → ~/.codex/skills y ~/.gemini/skills
```

Convención de nombre: carpeta = `name:` en frontmatter = kebab-case (`gmusic-welcome`).

## Rutas internas (zona alumno)

Solo estas URLs tienen pathname real por ahora. El resto del sitio sigue en `currentPage` sin sincronizar URL.

| Página | currentPage | URL |
|--------|-------------|-----|
| Mi Estudio | `mi-estudio` / `welcome` | `/alumno` |
| Mi Camino | `mi-camino` | `/mi-camino` |

Implementación: `src/app/utils/student-zone-routing.ts` + wrapper `handlePageChange` en `App.tsx` (Navbar, landing, Mi Estudio, Mi Camino).

Reglas de navegación:

- Entrar o moverse dentro de zona alumno → `pushState` a `/alumno` o `/mi-camino`.
- Salir de zona alumno hacia páginas públicas/legacy → `replaceState("/")` + `setPage`.
- `popstate` reconoce solo `/`, `/alumno` y `/mi-camino`; pathname desconocido → `home`.
- No agregar rutas URL nuevas sin una fase explícita de routing global.

## Reglas generales

- No commit salvo autorización explícita.
- Etapas por scope: no mezclar funcionalidad futura en la etapa activa.
- Datos mock centralizados en `src/app/data/mock-user.ts`.
- Para UI gamificada, usar `DESIGN.md` y el skill `gmusic-edu-gamified-design`; inspirarse en patrones tipo Duolingo sin copiar marca, mascota ni assets protegidos.
- Para backend, progreso, microejercicios, XP, rachas o apoderados, usar `docs/architecture/learning-engine.md`, `docs/architecture/database-schema.md` y el skill `gmusic-learning-engine`.
