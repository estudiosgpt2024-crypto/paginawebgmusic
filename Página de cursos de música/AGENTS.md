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

## Rutas internas

| Página | currentPage | URL |
|--------|-------------|-----|
| Mi Estudio | `mi-estudio` | `/alumno` |
| Mi Camino | `mi-camino` | `/mi-camino` |

## Reglas generales

- No commit salvo autorización explícita.
- Etapas por scope: no mezclar funcionalidad futura en la etapa activa.
- Datos mock centralizados en `src/app/data/mock-user.ts`.
- Para UI gamificada, usar `DESIGN.md` y el skill `gmusic-edu-gamified-design`; inspirarse en patrones tipo Duolingo sin copiar marca, mascota ni assets protegidos.
- Para backend, progreso, microejercicios, XP, rachas o apoderados, usar `docs/architecture/learning-engine.md`, `docs/architecture/database-schema.md` y el skill `gmusic-learning-engine`.
