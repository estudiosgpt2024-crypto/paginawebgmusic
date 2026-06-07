Leí CURSOR-CONTEXT.md y 01.3-PROBAR-SCOPE.md. Etapa 02 no tiene carpeta de docs aún; esto es el scope propuesto antes de tocar código.

Punto de partida (Etapa 01 — hecho)
/probar hoy es un lead magnet de dos estados en la misma página:

Estado A: nombre + correo → submit
Estado B: título aprobado + placeholder 16:9
Sin persistencia (solo setSubmitted(true) en cliente)
Sin video real
Sin redirect ni registro
Sin MusicPlayer
Etapa 02 no rediseña el flujo: solo hace que el submit guarde el lead y el Estado B reproduzca video real.

Qué necesita /probar para video real
1. Asset de producto (bloqueante humano)
Necesidad	Quién lo define
Video final 7–8 min (Cómo funciona tu camino de guitarra en Gmusic)
Juan / producción
Formato entregable (MP4, embed de YouTube/Vimeo, etc.)
Juan + hosting
¿Público, unlisted o “semi-privado”?
Producto
Sin URL o archivo definitivo no se puede cerrar Etapa 02.

2. Decisión de hosting y reproducción
Opciones típicas — hay que elegir una:

Opción	Pros	Contras
YouTube/Vimeo unlisted + iframe
Rápido, sin infra
Menos control de marca; el usuario puede copiar el link
Bunny / Cloudflare Stream / Mux
Player embebido, analytics, más control
Cuenta + costo
Supabase Storage + <video>
Mismo stack que el lead
Más trabajo; CDN/ancho de banda
Archivo estático en el deploy
Simple si el video es pequeño
Malo para 7–8 min; no escala
Recomendación de scope Etapa 02: embed (YouTube unlisted o Vimeo) — mínima fricción, sin backend de streaming.

3. Cambios de UI en Estado B (código, cuando toque)
Sustituir placeholder por reproductor 16:9 (iframe o <video>)
Mantener título y duración ya aprobados
Player acorde al design system (sin azul protagonista)
Estados UX mínimos:
Cargando
Error de carga (“No pudimos cargar el video”)
Opcional: poster/thumbnail antes de play
4. Comportamiento de acceso al video
Decisión de producto:

Modelo	Descripción
A — Gating suave (recomendado Etapa 02)
Submit → intentar guardar lead → si OK, mostrar video en la misma página
B — Gating estricto
Sin lead guardado, no hay video (ni siquiera con refresh)
C — Video público, lead paralelo
Siempre se muestra el video; el formulario es opt-in de contacto
El embudo actual sugiere A: el correo es la “moneda” para ver la clase.

5. Fuera de scope Etapa 02 (va a Etapa 03)
CTA “Crear cuenta” post-video
Lección bloqueada / siguiente paso
Redirect a registro o checkout
Email drip automático
Qué necesita /probar para guardar el lead
1. Decisión de almacenamiento
Docs apuntan a Supabase. Alternativas más ligeras si aún no hay proyecto:

Opción	Etapa 02 viable	Notas
Supabase (tabla leads)
✅ Ideal
Alineado con Etapa 03 (auth en el mismo stack)
Formspree / similar
✅ MVP rápido
Sin DB propia; difícil unificar con registro después
Google Sheet + Zapier
⚠️ Provisional
Solo para validar tráfico, no producto
Recomendación: Supabase si ya está en el roadmap de Etapa 03; si no hay proyecto aún, definir si Etapa 02 acepta un MVP con Formspree y migración después.

2. Schema mínimo del lead
leads
├── id            uuid, PK
├── nombre        text, not null
├── email         text, not null, unique o index
├── source        text  default 'probar'
├── created_at    timestamptz
└── (opcional)    utm_source, utm_campaign, user_agent
3. Flujo técnico en submit
Usuario envía formulario
  → validación cliente (ya existe)
  → POST a backend (Supabase insert o edge function)
  → si éxito: setSubmitted(true) + mostrar video
  → si error: mensaje en formulario, NO avanzar a video
Reglas de scope:

El video no debe mostrarse si el guardado falla (modelo A/B)
Duplicados: decidir si el mismo email puede re-ver el video (recomendado: sí, upsert o “ya registrado” sin error duro)
Sin email transaccional obligatorio en Etapa 02 (bienvenida = opcional/futuro)
4. Seguridad y legal (mínimo viable)
Item	Necesidad
Variables de entorno (.env)
URL + anon key de Supabase; nunca service role en cliente
RLS en Supabase
Solo INSERT en leads desde anon; sin SELECT público
Anti-spam
Honeypot o rate limit básico
Privacidad
Link a política de privacidad cerca del formulario (copy/legal)
Consentimiento
Checkbox o texto “Al enviar aceptas…” si legal lo pide
5. Analytics mínimos (recomendado en scope)
Eventos sin backend extra:

probar_form_submitted
probar_form_error
probar_video_play (opcional)
probar_video_complete (opcional)
Dependencias que debes resolver antes de implementar
Producto / Juan
URL o archivo del video definitivo
Proveedor de hosting del video (YouTube unlisted vs otro)
¿Supabase ya existe o se crea para Etapa 02?
Política de duplicados (mismo email reintenta)
Copy de error (“No pudimos guardar tu correo, intenta de nuevo”)
Infra
Proyecto Supabase (si aplica) + tabla leads + RLS
.env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
(Opcional) Edge Function si no quieres insert directo desde cliente
Diseño
Frame Figma Estado B con reproductor real (si Figma es fuente visual)
Estados error/carga del formulario y del video
Scope propuesto Etapa 02 — resumen ejecutivo
✅ Dentro
Guardar nombre + email en persistencia (Supabase recomendado)
Mostrar video real en Estado B tras guardado exitoso
Manejo de error en submit (quedarse en Estado A)
Mantener: misma página, sin redirect, sin MusicPlayer, copy aprobado de 01.3
Variables de entorno + RLS básico
❌ Fuera (Etapa 03+)
Registro / auth / suscripción
CTA post-video
Lección bloqueada
CRM avanzado, emails automáticos, webhooks
URL real /probar en router (puede ser Etapa 02 opcional o después)
Criterio de “Etapa 02 lista”
Submit con email válido → fila en leads
Mismo submit → video reproducible (no placeholder)
Submit fallido → usuario ve error, no ve video
Refresh tras éxito → comportamiento definido (localStorage “ya enviado” recomendado)
Siguiente paso recomendado (solo docs, sin código)
Crear docs/etapas/02-enganche-gratis/02.1-PROBAR-SCOPE.md con las 5 decisiones cerradas:

Hosting del video: ¿cuál?
Almacenamiento del lead: ¿Supabase o MVP Formspree?
Gating: ¿video solo si lead guardado OK?
Duplicados: ¿qué pasa si el email ya existe?
Persistencia de sesión: ¿localStorage para no repetir formulario?
Cuando tengas esas respuestas, el scope queda cerrado y se puede implementar sin ambigüedad. Si quieres, en el siguiente mensaje redacto ese .md con las opciones marcadas para que solo rellenes las decisiones.