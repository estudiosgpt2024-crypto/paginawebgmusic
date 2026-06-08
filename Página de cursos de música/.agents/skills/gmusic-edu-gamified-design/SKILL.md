---
name: gmusic-edu-gamified-design
description: >-
  Disena e implementa interfaces de cursos de musica con aprendizaje gamificado
  inspirado en Duolingo, adaptado a Gmusic Estudio: premium, guitarra, progreso,
  racha, XP, ruta pedagogica, recompensas y estados bloqueados sin copiar marca
  ni assets protegidos.
---

# Gmusic Edu Gamified Design

Usar este skill cuando la tarea toque colores, tipografia, diseno visual, UI gamificada, ruta de aprendizaje, progreso, streaks, XP, badges, cofres, ejercicios o pantallas tipo Duolingo para Gmusic.

## Fuentes Locales

Leer primero:

1. `DESIGN.md`
2. `design-system/tokens.css`
3. `AGENTS.md`
4. Skill especifico de pantalla si aplica:
   - `gmusic-welcome`
   - `gmusic-path`

## Regla Principal

Gmusic no debe verse como clon de Duolingo. Capturar patrones de producto: progreso claro, motivacion, botones tactiles, feedback inmediato y recompensas. No copiar Duo, el logo, personajes, ilustraciones propietarias, tipografias propietarias ni composiciones exactas.

## Direccion Visual

- Mantener base premium: carbon, dorado, fotografia/textura musical y jerarquia elegante.
- Agregar gamificacion con acentos: verde para progreso/exito, amarillo para recompensa, azul para informacion, rojo para error, morado para logro.
- Usar verde solo en acciones de aprendizaje o progreso, no como marca principal global.
- Evitar una interfaz infantil; la musica y la practica siguen siendo protagonistas.

## Reglas de Implementacion

- Usar tokens existentes antes de hardcodear colores.
- Si hacen falta tokens gamificados, agregarlos a `design-system/tokens.css` con prefijo `--edu-*`.
- Mantener mobile primero: nodos, botones y labels no deben solaparse.
- Toda accion importante debe tener estado hover, focus, active, disabled y loading cuando aplique.
- No usar texto visible para explicar obviedades de la UI; mostrar estado con componente, icono y copy breve.
- No mezclar cambios de varias pantallas si el usuario pidio una pantalla especifica.

## Componentes Esperados

- Camino o mapa de lecciones con nodos completado, activo y bloqueado.
- Card de proxima practica.
- Indicadores de XP, racha, progreso semanal y nivel.
- Badges o cofres como recompensa secundaria.
- Modal o tooltip para contenido bloqueado con copy: "Disponible en el plan completo".

## QA

Antes de terminar:

1. Verificar que `DESIGN.md` siga representando la decision tomada.
2. Verificar desktop y mobile si se modifico UI.
3. Confirmar que no se usaron assets de Duolingo.
4. Confirmar que el tono premium de Gmusic no se perdio.
