# ============================================================
# INSTRUCCIÓN CORRECTIVA FIGMA — GMUSIC WELCOME V1
# BASADA EN AUDITORÍA FINAL DE CURSOR
# ============================================================

Estado actual:
NO CERRAR ETAPA 01.

Cursor auditó la implementación real y encontró que varios ajustes declarados como completados no están reflejados en el código.

La base visual de GmusicWelcome.tsx y el widget de audio están bien, pero la integración, rutas, placeholders y responsive no cumplen todavía el roadmap.

Objetivo:
Corregir únicamente los puntos bloqueantes detectados por Cursor.
No rediseñar la pantalla completa.
No avanzar a Etapa 02.
No crear mapa, nodos, dashboard ni comunidad funcional.

# ------------------------------------------------------------
# 1. APP.TSX — INTEGRAR GMUSICWELCOME REALMENTE
# ------------------------------------------------------------

Corregir App.tsx para que GmusicWelcome se renderice cuando el estado sea:

mi-estudio
o
welcome

Actualmente Cursor detectó que App.tsx sigue mostrando Navbar público siempre y que al ir a “mi-estudio” queda pantalla vacía + navbar público + MusicPlayer.

Implementar lógica clara:

- Si currentPage === "mi-estudio":
  Renderizar GmusicWelcome.

- En esa vista interna:
  No mostrar Navbar público.
  No mostrar MusicPlayer público.
  No mostrar navegación comercial.

La app interna debe tener solamente el header interno de GmusicWelcome.

# ------------------------------------------------------------
# 2. NAVBAR.TSX — PUENTE DESDE LANDING A MI ESTUDIO
# ------------------------------------------------------------

Agregar o corregir el botón “Mi Estudio” dentro del dropdown del perfil en Navbar.tsx.

Función:
setCurrentPage("mi-estudio")

Este botón solo actúa como puente desde la landing pública hacia el área privada.

Una vez dentro de GmusicWelcome, el Navbar público debe desaparecer.

# ------------------------------------------------------------
# 3. GMUSICWELCOME — PLACEHOLDERS INTERNOS CONTROLADOS
# ------------------------------------------------------------

Actualmente Cursor detectó que:

- Mi Camino llama setPage("mi-camino") pero no existe ruta.
- Mi Progreso llama setPage("mi-progreso") pero no existe ruta.
- Comunidad llama "community" y carga CommunityPage legacy.
- Desafío y Laboratorio aparecen activos sin disabled ni placeholder real.

Corregir así:

## Mi Camino

Cuando el usuario haga click en:
- Nav “Mi Camino”
- CTA “Continuar mi Camino”

Debe abrir un modal o placeholder interno elegante:

“Próximamente — Etapa 02”
“Mi Camino estará disponible en la siguiente etapa.”

No debe navegar a ruta inexistente.
No debe cargar curriculum.
No debe cargar courses.
No debe romper pantalla.

## Mi Progreso

Click en nav “Mi Progreso”:

Mostrar modal/placeholder:

“Próximamente — Etapa 03”
“Las métricas completas estarán disponibles en Mi Progreso.”

## Comunidad

Click en nav “Comunidad”:

Mostrar modal/placeholder:

“Próximamente — Etapa 04”
“La comunidad se activará en una etapa posterior.”

No cargar CommunityPage legacy.

## Desafío del Día

Debe quedar disabled o con estado “Próximamente”.

No debe parecer botón activo si no hace nada.

## Laboratorio de Práctica

Debe quedar disabled o con estado “Próximamente”.

No debe parecer botón activo si no hace nada.

# ------------------------------------------------------------
# 4. RESPONSIVE REAL
# ------------------------------------------------------------

Cursor detectó que no hay responsive real en GmusicWelcome.tsx.

Corregir layout:

Desktop:
- Mantener diseño premium.
- Tarjeta “Continuar mi Camino” dominante.
- Desafío peso medio.
- Laboratorio peso terciario.

Mobile:
- Layout 1 columna.
- Header interno con hamburger o navegación horizontal controlada.
- Orden visual obligatorio:
  1. Bienvenida.
  2. CTA principal “Continuar mi Camino”.
  3. Widget audio.
  4. Métricas mínimas.
  5. Desafío del Día.
  6. Laboratorio de Práctica.

No debe quedar:
Bienvenida → Widget → Métricas → Grid.

El CTA principal debe aparecer antes que el widget en mobile.

# ------------------------------------------------------------
# 5. WIDGET AUDIO — MANTENER
# ------------------------------------------------------------

Cursor dio PASS al widget audio.

No rehacer.

Solo mantener:

- Estados pending / granted / denied.
- getUserMedia({ audio: true }) solo tras click.
- Copy guitarra.
- Sin WebMidi.
- Sin MIDI.
- Sin piano.
- Sin teclado.
- No bloquear navegación.

Ajuste menor permitido:
Unificar texto pending si hace falta:
Título: “Prepara tu estudio”
Botón: “Preparar estudio”

# ------------------------------------------------------------
# 6. DOCUMENTO DE AUDITORÍA
# ------------------------------------------------------------

Crear realmente el archivo:

/src/imports/pasted_text/gmusic-welcome-v1-auditoria.md

Debe reflejar el estado real del código, no solo una declaración ideal.

Incluir:

- Qué archivos se tocaron.
- Qué checks pasan.
- Qué rutas quedaron como placeholders.
- Confirmación de que no se adelantó Etapa 02.
- Confirmación de que Navbar público y MusicPlayer no aparecen en Mi Estudio.

# ------------------------------------------------------------
# 7. PROHIBIDO EN ESTA CORRECCIÓN
# ------------------------------------------------------------

No implementar:

- Mapa serpenteante.
- Nodos.
- Tonal.js.
- Ruta de 12 meses.
- Dashboard completo.
- Camino Potencial.
- Panel de padres.
- Comunidad funcional.
- CommunityPage legacy dentro de la app interna.
- WebMidi.
- Piano.
- Teclado.

# ------------------------------------------------------------
# 8. CRITERIO DE ENTREGA
# ------------------------------------------------------------

Después de corregir, entregar resumen con evidencia por archivo:

- App.tsx:
  Qué cambió para renderizar GmusicWelcome y ocultar Navbar/MusicPlayer.

- Navbar.tsx:
  Qué cambió para agregar puente “Mi Estudio”.

- GmusicWelcome.tsx:
  Qué cambió en placeholders, responsive y navegación interna.

- gmusic-welcome-v1-auditoria.md:
  Confirmar que existe y que refleja el código real.

# ------------------------------------------------------------
# ESTADO FINAL ESPERADO
# ------------------------------------------------------------

GmusicWelcome V1 solo podrá volver a auditoría Cursor cuando:

1. Mi Estudio renderice realmente GmusicWelcome.
2. No aparezca Navbar público en área interna.
3. No aparezca MusicPlayer público en área interna.
4. CTA principal abra placeholder Etapa 02.
5. Mi Progreso y Comunidad sean placeholders controlados.
6. Desafío y Laboratorio estén disabled o “Próximamente”.
7. Responsive esté corregido.
8. El documento de auditoría exista realmente.

Hasta entonces:

ETAPA 01 — NO CERRADA.