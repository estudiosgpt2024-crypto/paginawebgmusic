Aquí tienes las respuestas directas para armar los .md de cada comando, y lo que aún falta en el repo.

1. 01.1-COPY-CONVERSION.md — ¿existe?
Sí, ya existe y está cerrado.

Campo	Valor
Ruta
docs/etapas/01-publico-deseo/01.1-COPY-CONVERSION.md
Estado
APROBADO v1 (2026-06-04)
Uso
Copy literal para implementación y comandos de copy
Incluye: hero, subhero, CTAs, método, clase gratis, CTA final, nav, y bloque /probar (líneas 134–141).

No hay que construirlo desde cero. Solo conviene:

Un .md de comando que apunte a este archivo como fuente.
Actualizar notas si la Home en código ya no usa todas las secciones de 01.1 (hoy hay Academia/Comunidad; 01.1 habla de Método, Programas, Clase gratis, Testimonios).
2. design-system/MASTER.md — ¿tokens listos para exportar desde Figma?
En código: sí, documentados.
En Figma: no está en el repo (no hay export JSON ni Variables Figma commiteadas).

Qué hay	Dónde
Tokens en Markdown
design-system/MASTER.md
Tokens en CSS
src/styles/landing-premium.css (--bg-base, --gold-primary, etc.)
Handoff Figma↔código
docs/FIGMA-CODIGO-CONTEXTO.md (tabla nombres Figma ↔ CSS)
tokens.css dedicado
No existe (pendiente si quieres 1:1 con Figma Variables)
Para tus comandos: puedes decir que los tokens están listos para crear variables en Figma con los nombres de FIGMA-CODIGO-CONTEXTO.md, pero no que ya estén exportados desde Figma.

Falta para contexto completo:


 Archivo design-system/figma-variables.json o captura de variables Figma (cuando Juan las tenga).

 design-system/tokens.css espejo de MASTER.md (opcional, recomendado).

 Alinear Figma si el diseño “mejor” usa valores distintos a #C9A84C / #080808.
3. Scope exacto de /probar — qué hay hoy vs qué dice el producto
Definido en documentación (01.1 + DECISIONES)
Landing "Probar gratis" → /probar
  → Formulario: Nombre + Email
  → Botón: "Ver la clase gratis"
  → Post-submit: video método Juan 7–8 min (título aprobado)
  → Después (producto futuro): siguiente lección bloqueada → registro + plan
Copy aprobado en 01.1 (sección /probar):

Título: Conoce el método Gmusic
Subtítulo: Déjanos tu nombre y correo para ver la clase gratuita.
Campos: Nombre · Correo
Botón: Ver la clase gratis
Video: Cómo funciona tu camino de guitarra en Gmusic (7–8 min)
Implementado hoy en código (ProbarPage.tsx)
Paso	¿Existe?	Detalle
Ruta /probar
✅
seo-routing.ts + App.tsx (currentPage === "probar")
Form nombre + email
✅
Validación HTML required
Envío a backend / Supabase
❌
Solo trackEvent("form_submitted") + estado local
Mostrar video tras submit
✅
Misma página, estado submitted === true
Video real (URL/archivo)
❌
Placeholder 16:9 + texto “Etapa 02”
Redirige a registro
❌
No hay CTA “Crear cuenta” ni redirect a auth
Redirige a otra URL
❌
Todo en una página, dos estados
Player musical inferior
❌ oculto
Correcto en home y probar
Estilos = design system v2
⚠️ parcial
Dorado sí; inputs radius 12px / botón pill (no 2px del MASTER)
Respuesta corta para tu .md de comando:

/probar v1 = lead magnet de una sola página: formulario (nombre + email) → en la misma ruta, bloque de video placeholder. Sin persistencia, sin registro automático, sin redirect. Registro/pago = Etapa 02–03.

Lo que te falta para completar contexto (checklist para .md por comando)
Ya puedes escribir comandos con esto
Recurso	Estado
01.1-COPY-CONVERSION.md
✅ Listo
01.2-IMPLEMENTACION.md
✅ Registro implementación
DECISIONES.md (etapa 01)
✅ Producto + embudo
design-system/MASTER.md
✅ Tokens dev
FIGMA-CODIGO-CONTEXTO.md
✅ Orden Figma/código
00-MASTER.md
✅ Mapa etapas 01–08
Conviene crear o actualizar (gaps)
Archivo sugerido	Por qué
docs/etapas/01-publico-deseo/01.3-PROBAR-SCOPE.md
No existe un doc solo de /probar (scope actual vs futuro, estados, analytics, sin backend).
docs/etapas/01-publico-deseo/01.4-HOME-VS-01.1.md
La Home en código ≠ secciones de 01.1; evita que un comando implemente copy viejo.
design-system/tokens.css + nota en MASTER
Para comandos “usa tokens”, no landing-premium.css suelto.
docs/etapas/02-enganche-gratis/01-PROBAR-VIDEO.md
Etapa 02 está “pendiente”; cerrar video real + embed + lead storage.
Prompt por comando en docs/etapas/01-publico-deseo/prompts/
Solo hay 01-copy-hero-guitarra.md; faltan prompts para /probar, design system, Figma sync.
Figma: página 02 — /probar
Si Figma es fuente visual, frame desktop/mobile de probar.
Desalineaciones a documentar en un .md (no bloquean, pero confunden)
Tema	01.1 / docs viejos	Código actual
Nav
Programas · Testimonios
Academia · Comunidad · Contacto
CTA secundario hero
Ver programa → #programas
Conocer academia → #academia
Secciones Home
Método, Clase gratis, Testimonios
Academia (mapa), Comunidad, Planes, Contacto
Hero body
Subhero largo 01.1
Texto corto distinto en landing
Para comandos: define una fuente por capa:

Copy conversión: 01.1 (salvo aprobación nueva).
Layout/secciones: Figma o FIGMA-CODIGO-CONTEXTO.md + MASTER.md.
/probar: 01.1 § /probar + tabla “implementado hoy” arriba.
Plantilla mínima para tu .md del comando /probar
Puedes copiar esto:


## Precondición
- Copy: docs/etapas/01-publico-deseo/01.1-COPY-CONVERSION.md § Página /probar
- Visual: design-system/MASTER.md + frame Figma "02 — /probar" (si existe)
## Scope v1 (implementado)
1. Ruta /probar, sin MusicPlayer
2. Estado A: form (nombre, email) → submit
3. Estado B: título video aprobado + placeholder 16:9
4. Analytics: form_submitted (sin backend)
## Fuera de scope v1
- Guardar lead en Supabase/CRM
- Video URL real (Etapa 02)
- Redirect a registro o checkout
- Lección bloqueada post-video
## Archivos
- src/app/pages/ProbarPage.tsx
- src/app/utils/seo-routing.ts
- src/app/App.tsx