# Gmusic Estudio — Diseño Gamificado de Cursos

## Objetivo

Gmusic debe sentirse como una academia de guitarra premium con energia de app de aprendizaje gamificado: claro, motivante, tactil y progresivo. La referencia de categoria es Duolingo por sus patrones de motivacion, no por su identidad visual. No copiar logos, mascota, personajes, ilustraciones propietarias ni layouts exactos.

Regla madre: cinematica premium primero; gamificacion como interaccion, no como disfraz visual.

## Personalidad Visual

- Premium musical: carbon, dorado, fotografia o textura real de guitarra.
- Gamificacion sobria: progreso visible, recompensas, racha, XP, niveles y estados bloqueados.
- Aprendizaje amable: errores recuperables, feedback inmediato, proximos pasos muy claros.
- No infantilizar: Gmusic es una academia seria; la energia ludica vive en microinteracciones, badges y rutas.

## Tokens Base

Usar `design-system/tokens.css` como fuente de verdad. Estos roles complementan los tokens existentes:

```css
:root {
  --edu-success: #58cc02;
  --edu-success-hover: #49ad00;
  --edu-success-shadow: #3f9700;
  --edu-info: #1cb0f6;
  --edu-error: #ff4b4b;
  --edu-warning: #ffc800;
  --edu-reward: #ff9600;
  --edu-achievement: #ce82ff;
  --edu-locked: rgba(255, 255, 255, 0.28);
  --edu-surface-light: #f7f7f7;
}
```

Regla de uso: el dorado sigue siendo la marca premium; el verde gamificado se reserva para progreso, completado, continuar y exito. No convertir toda la interfaz en verde.

## Tipografia

- Titulares premium: `Playfair Display`, ya definido como `--font-display`.
- UI, progreso y aprendizaje: `Inter` / `Outfit`, ya definido como `--font-body`.
- Para pantallas mas ludicas se puede sumar una fuente redondeada solo si esta instalada y no rompe la identidad premium.
- Evitar texto gigante dentro de cards compactas. Los paneles de alumno deben ser densos, claros y escaneables.

## Componentes

## Layout de Dashboard

La pantalla `Mi Estudio` debe respetar siempre esta base antes de cualquier capa estetica:

- Contenedor unico centrado: `max-width: 1280px`.
- Padding lateral consistente: compacto en mobile, estable en desktop.
- Grilla desktop: 12 columnas.
- Grilla mobile: 1 columna.
- No improvisar distribuciones fuera de la grilla base.
- Orden visual recomendado:
  1. Hero compacto o panel de bienvenida en 12 columnas.
  2. Proxima practica en 12 columnas o composicion validada.
  3. Metricas en `4 + 4 + 4`.
  4. Cards bloqueadas en `6 + 6`.

No usar textura de fondo, LED, celebracion de cofre ni efectos de boton hasta que la grilla este estable.

### Botones

- Primario premium: dorado para compra, acceso principal o acciones de marca.
- Primario de practica: verde para continuar leccion, completar ejercicio o retomar camino.
- Deben tener estados hover, focus, active, disabled y loading.
- En acciones gamificadas, usar boton tactil con sombra inferior y estado presionado.

### Cards

- Cards premium: fondo carbon/elevado, borde sutil, acento dorado.
- Cards de progreso: pueden usar verde, azul, amarillo o morado segun estado.
- No anidar cards dentro de cards.
- Mantener radios existentes salvo que la pantalla sea claramente gamificada.

### Ruta de Aprendizaje

- Mostrar pasos completados, activo, bloqueados y recompensas.
- El nodo activo debe ser el mas visible.
- El bloqueo debe explicar valor sin sonar punitivo: "Disponible en el plan completo".
- La ruta puede ser serpenteante, pero debe mantenerse legible en mobile.

### Recompensas

- XP, racha, cofres, badges y metas semanales deben apoyar la practica, no competir con ella.
- Usar animaciones breves y opcionales.
- El feedback de exito debe ser inmediato y alegre.
- El feedback de error debe guiar el siguiente intento.

## Referencias

- Duolingo Brand Guidelines: https://design.duolingo.com/
- VoltAgent awesome-design-md: https://github.com/VoltAgent/awesome-design-md
- Duolingo DESIGN.md reference: https://www.shadcn.io/design/duolingo
- Open edX Paragon: https://github.com/openedx/paragon

## Checklist Antes de Entregar UI

- La accion principal se entiende en menos de 3 segundos.
- Hay progreso visible sin leer instrucciones largas.
- Los estados completado, activo y bloqueado son distintos por mas que solo color.
- La pantalla mantiene el tono premium de Gmusic.
- No se copiaron assets protegidos de Duolingo.
- El layout funciona en mobile y desktop sin solapes.
