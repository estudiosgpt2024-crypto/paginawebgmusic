# DO NOT TOUCH — Gmusic Estudio

Estas zonas requieren autorización explícita de Juan (Product Owner) antes de cualquier modificación.
Fable (CTO) es el único autorizado para aprobar cambios en estas zonas.

Cursor y otros agentes ejecutores deben leer este archivo **antes** de editar código.

## Zonas absolutamente protegidas

| Zona | Archivos / carpetas | Razón |
|------|---------------------|-------|
| Auth real (dev) | `server/middleware/devStudentAuth.ts`, `server/lib/devStudentCookie.ts`, `server/routes/me.ts` | Dev-only — no tocar hasta que `realStudentAuth` esté listo y aprobado (Fase 4) |
| Prisma / DB | `prisma/schema.prisma`, `prisma/migrations/` | Fase 4 pausada |
| Pagos | `src/app/pages/legacy/CheckoutPage.tsx`, activación Semestral en `src/app/services/gmusic-api/` | Fase 5 / flujo dev acordado; no improvisar pagos reales |
| StudentZoneGuard | `src/app/components/gmusic/StudentZoneGuard.tsx` | Controla acceso a zona alumno — crítico |
| Mi Estudio | `src/app/pages/GmusicWelcome.tsx` | Zona alumno estable (Fase 6 cofre cableado) |
| GmusicPath | `src/app/pages/GmusicPath.tsx` | Zona alumno estable |
| Routing central | `src/app/App.tsx` | Agregar rutas solo con scope explícito; actualizar exclusiones Navbar/MusicPlayer |
| PublicSession | `src/app/services/gmusic-api/public-student-session.ts` | Cambio `registered_no_sub` es Fase 4 |
| Skills del agente | `.agents/skills/` | Solo Fable los edita |
| Tests existentes | `src/**/*.test.ts` | No modificar tests que pasan — solo agregar nuevos |
| Tokens globales | `design-system/tokens.css` | Fuente CSS global — cambios con ripple en todo el producto |

## No implementar todavía (sin autorización explícita)

- Auth real: JWT httpOnly, bcrypt, registro real, login real
- Pagos reales: Flow integration, webhooks, Resend email
- App de escritorio (Electron, Tauri)
- App móvil (React Native, Capacitor)
- Micrófono real / afinador real (Web Audio API)
- Motor musical avanzado (Tonal.js, teoría interactiva avanzada)
- Rediseño completo de cualquier página ya funcional
- Cambios en el schema de Prisma
- Nuevas rutas públicas sin actualizar exclusiones de Navbar/MusicPlayer en `App.tsx`
- Cambios en localStorage keys (`gmusic:demo_v1`, `gmusic:selected_plan_v1`) sin migrar todos los lectores en el mismo PR
- Editar `.agents/MEMORY.md` (gestionado por Fable)

## Referencias

- Protocolo de trabajo: `.agents/skills/gmusic-agent-workflow/SKILL.md`
- Auth Fase 4: `.agents/skills/gmusic-auth-email-verification/SKILL.md`
- Funnel público: `.agents/skills/gmusic-funnel-conversion/SKILL.md`
