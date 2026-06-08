---
name: gmusic-welcome
description: >-
  Trabaja en Mi Estudio (GmusicWelcome): dashboard premium del alumno, hero de
  bienvenida, card Próxima práctica, métricas y cards bloqueadas. Usar cuando la
  tarea toque welcome, mi-estudio, GmusicWelcome o el panel del alumno.
---

# Gmusic Welcome — Mi Estudio

Pantalla interna del alumno. Ruta: `mi-estudio` / `welcome` → `/alumno`.

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/app/pages/GmusicWelcome.tsx` | Página principal Mi Estudio |
| `src/app/components/gmusic/GmusicInternalHeader.tsx` | Header compartido |
| `src/app/data/mock-user.ts` | Datos Carlos (MOCK_USER) |
| `src/app/data/gmusic-path-data.ts` | ACTIVE_NODE_PANEL para próxima práctica |
| `src/app/App.tsx` | Debe renderizar `GmusicWelcome`, no `StudentDashboard` |

## Bloques que no se eliminan

Hero (Hola + práctica de hoy), racha, audio, Próxima práctica, Progreso del módulo, XP y constancia, frase del día, Desafío del Día, Laboratorio de Práctica, CTA Continuar mi Camino.

## Reglas visuales

- Academia premium: carbón, oro `#D4AF37`, Playfair Display en titulares.
- Hero = bienvenida; CTA principal va en card Próxima práctica → `setPage("mi-camino")`.
- Ajustes quirúrgicos: no rediseñar toda la pantalla de golpe.
- Espaciado generoso; cards con padding 24–32px; `max-w-7xl` centrado.

## Prohibiciones

- No tocar `GmusicPath`, landing, Navbar público, rutas SEO, backend, Tonal.js, LessonPage legacy.
- No commit salvo autorización explícita del usuario.
- No eliminar bloques existentes en refactors visuales.

## QA

1. Perfil → Mi Estudio o `http://localhost:5174/alumno`
2. Verificar hero + visual guitarra (desktop 2 columnas)
3. CTA Continuar mi Camino → Mi Camino
4. Mi Progreso / Comunidad → modal plan completo (candado)
