# ============================================================
# RESOLUCIÓN FINAL — ROADMAP GMUSIC ESTUDIO V1
# MEDIACIÓN ENTRE PROPUESTAS CURSOR + GEMINI
# ============================================================

## VEREDICTO GENERAL

Se aprueba el roadmap maestro de Gmusic Estudio V1 con una regla estricta:

La visión de Gemini queda aprobada como arquitectura general de producto.
La evaluación de Cursor queda aprobada como criterio de implementación por etapas.

No se deben mezclar pantallas, componentes ni funcionalidades de etapas futuras dentro de la etapa activa.

La etapa activa actual es:

ETAPA 01 — GMUSIC WELCOME V1

---

# ============================================================
# PRINCIPIO NORTE DEL PRODUCTO
# ============================================================

Gmusic Estudio debe sentirse como una academia musical premium, madura y ordenada.

No debe parecer:
- Una app infantil.
- Un dashboard saturado.
- Una landing pública.
- Un videojuego de recompensas superficiales.

Debe comunicar:
- Estudio.
- Constancia.
- Progreso.
- Disciplina musical.
- Acompañamiento para el alumno y confianza para los padres.

---

# ============================================================
# ETAPA 01 — GMUSIC WELCOME V1
# ============================================================

## ESTADO

Prioridad inmediata.

Estado correcto:
LISTO PARA IMPLEMENTACIÓN VISUAL V1.

No marcar todavía como “producción final” hasta validar:
- Responsive.
- Estados reales del micrófono.
- Navegación interna.
- Consistencia visual.
- Integración con el flujo post-login.

## COMPONENTE BASE

GmusicWelcome.tsx

## FUNCIÓN PRINCIPAL

Recibir al alumno después de iniciar sesión.
Preparar su entorno de estudio para guitarra.
Mostrar racha mínima.
Mostrar progreso mínimo sin saturar.
Dirigir al alumno a continuar su ruta diaria.

## HEADER INTERNO

Usar navegación autenticada, no navegación pública.

Links:

[Mi Estudio] · [Mi Camino] · [Mi Progreso] · [Comunidad]

Estado activo:
[Mi Estudio]

Perfil alumno:
Carlos
Mes 2 · Nodo 3 de 6

No incluir:
- Ver planes
- Contacto
- Inicio público
- Elementos de landing comercial

## BIENVENIDA

H1:
“¡Hola, Carlos! Tu estudio musical está listo para hoy.”

Subtexto:
“4 días seguidos practicando. Vamos por el quinto.”

El tono debe ser sobrio, motivador y premium.

## WIDGET AUDIO / GUITARRA V1

La V1 está enfocada 100% en guitarra.

No utilizar:
- WebMidi.js.
- Mensajes de teclado.
- Mensajes de piano.
- Mensajes MIDI.

Usar lógica de micrófono/audio.

Estados:

1. Estado pending:
Botón oro:
“Preparar estudio”

Acción:
Solicitar permiso de micrófono mediante getUserMedia({ audio: true }).

2. Estado granted:
Título:
“Modo guitarra listo”

Microcopy:
“Micrófono listo para práctica.”

Visual:
Indicador sutil oro/verde.

3. Estado denied:
Título:
“Audio no preparado”

Microcopy:
“Ve a configuración del navegador para habilitar el micrófono.”

Visual:
Ícono apagado en gris.

Regla:
No bloquear el acceso a “Mi Camino” si el micrófono no está activo.

Razón:
El alumno puede revisar su ruta, teoría o progreso sin micrófono.
El micrófono solo debe ser obligatorio cuando una lección específica requiera audio interactivo.

## GRID DE ENFOQUE

Jerarquía visual estricta:

1. Tarjeta principal — Oro
Título:
“Continuar mi Camino”

Botón:
“Entrar al camino”

Función:
Acción principal de la pantalla.

2. Tarjeta secundaria — Carbón
Título:
“Desafío del Día”

Función:
Práctica breve para mantener racha.

3. Tarjeta terciaria — Outline
Título:
“Laboratorio de Práctica”

Función:
Repaso libre sin avanzar de nivel.

Regla:
El Laboratorio no debe competir visualmente con “Continuar mi Camino”.

## MÉTRICAS MÍNIMAS

Mostrar solamente métricas compactas:

- Racha: 4 días.
- Nodo actual: Acordes abiertos.
- Progreso del mes: 38%.

Ubicación:
Bajo la bienvenida o junto al widget de audio.

No incluir en Welcome:
- Dashboard completo.
- Camino potencial detallado.
- Gráficos grandes.
- Panel de padres.
- Ranking.
- Comunidad activa.

Las métricas completas pertenecen a Etapa 03 — Mi Progreso.

---

# ============================================================
# ETAPA 02 — MI CAMINO / MAPA SERPENTEANTE
# ============================================================

## ESTADO

Siguiente etapa.
No implementar todavía dentro de Welcome.

## COMPONENTE BASE

GmusicPath.tsx

## FUNCIÓN

Mostrar la ruta pedagógica de guitarra de 12 meses mediante un mapa visual serpenteante, secuencial y premium.

## ELEMENTOS APROBADOS PARA ETAPA 02

- Camino vertical serpenteante.
- Línea oro mate con baja opacidad.
- Separadores por módulos/meses.
- Nodos completados.
- Nodos activos.
- Nodos bloqueados.
- Tooltip de lección.
- Botón “Iniciar lección”.
- Tipos de nodos:
  - Video conceptual.
  - Laboratorio de audio.
  - Recompensa descargable.
- Desafío de nivelación por módulo.

## REGLA

Todo lo relacionado con:
- Nodos.
- Tonal.js.
- Validación de audio por lección.
- Ruta de 12 meses.
- Desafío de nivelación.
- Mapa serpenteante.

Pertenece a Etapa 02, no a Etapa 01.

---

# ============================================================
# ETAPA 03 — MI PROGRESO
# ============================================================

## ESTADO

Planificado a futuro.

## COMPONENTE BASE

GmusicProgress.tsx

## FUNCIÓN

Concentrar las métricas completas del alumno y entregar evidencia de avance para padres.

Elementos futuros:
- Camino potencial.
- Progreso real vs progreso ideal.
- Historial de rachas.
- Minutos practicados.
- Reportes para padres.
- Certificados o hitos formativos.

Regla:
No meter esta densidad de información dentro de Welcome.

---

# ============================================================
# ETAPA 04 — COMUNIDAD
# ============================================================

## ESTADO

Posterior.

## COMPONENTE BASE

GmusicCommunity.tsx

## FUNCIÓN

Crear pertenencia, acompañamiento y motivación social madura.

Elementos futuros:
- Club de práctica.
- Ligas de constancia.
- Proyectos abiertos.
- Feedback de la academia.
- Desafíos colectivos.

Regla:
No reutilizar una CommunityPage existente sin alinearla antes a la estética interna premium de Gmusic Estudio.

---

# ============================================================
# REGLA DE IMPLEMENTACIÓN
# ============================================================

La implementación debe avanzar en este orden:

1. Gmusic Welcome V1.
2. Mi Camino / Mapa Serpenteante.
3. Mi Progreso.
4. Comunidad.

Si una funcionalidad pertenece a una etapa futura, no se implementa ahora.
Solo se puede dejar como placeholder, enlace futuro o nota documentada.

Etapa actual:
ETAPA 01 — GMUSIC WELCOME V1

Foco único:
Construir la pantalla de bienvenida interna del alumno.

---

# ============================================================
# DECISIÓN FINAL
# ============================================================

Roadmap aprobado.

Se toma de Gemini:
- La visión de producto.
- La arquitectura por etapas.
- La estética premium.
- El alcance conceptual de Mi Camino, Mi Progreso y Comunidad.

Se toma de Cursor:
- La regla de no mezclar etapas.
- El foco estricto en Welcome V1.
- La separación entre app interna y landing pública.
- La validación de alcance antes de implementar.

Resultado:
Avanzar ahora solo con ETAPA 01 — GMUSIC WELCOME V1.