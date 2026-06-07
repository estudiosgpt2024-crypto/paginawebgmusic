Reporte QA — Gmusic Estudio v1
Alcance: Home (GmusicLanding.tsx), Navbar, /probar, tokens, routing y docs de referencia.
Método: Revisión estática de código y docs (sin cambios).
Nota: .claude/commands/qa.md no existe; el checklist se derivó de CURSOR-CONTEXT.md, 01.3-PROBAR-SCOPE.md, 01.4-HOME-VS-01.1.md y design-system/tokens.css.

Resumen ejecutivo
Área	Pasa	Falla	Bloqueantes
Visual
14
11
3
Copy
9
8
4
Estructura
8
14
5
Veredicto v1: La Home está mayormente alineada visualmente, pero el embudo principal está roto (CTAs “Probar gratis” no van a /probar, y /probar no existe en código). Hay copy no aprobado en Comunidad y documentación desactualizada respecto al repo real.

1. VISUAL
✅ Pasa
Check	Archivo:Línea
Fondo global #080808
GmusicLanding.tsx:44, App.tsx:82, index.css:14
Secciones alternas #080808 ↔ #0D0D0D
GmusicLanding.tsx:245,317,469,598
Dorado principal #C9A84C en CTAs
GmusicLanding.tsx:5,126,583
Texto cálido #F5F0E8 en titulares
GmusicLanding.tsx:7,89
H1/H2 en Playfair Display
GmusicLanding.tsx:86-101
Botones Home con borderRadius: 2
GmusicLanding.tsx:126,142,367,582,663
Imágenes con borderRadius: 4
GmusicLanding.tsx:187,390
Input contacto borderRadius: 2
GmusicLanding.tsx:652
Sin azul #2563EB en Home/Navbar/Academia
GmusicLanding.tsx, Navbar.tsx, InteractiveLevelSelector.tsx
section-py ~120px
GmusicLanding.tsx:246,318,470,599
MusicPlayer oculto en Home
App.tsx:156-165 (solo renderiza si currentPage !== "home")
Navbar scrolled con blur y borde sutil
Navbar.tsx:52-56
Academia selector usa dorado y radius 2px/4px
InteractiveLevelSelector.tsx:72,113,189,213
❌ Falla
Check	Archivo:Línea	Detalle
Logo navbar radius estándar 2px
Navbar.tsx:66
borderRadius: 8 (token --radius-sm: 2px)
Logo footer radius
GmusicLanding.tsx:715
borderRadius: 6
Fuente body Inter no cargada
fonts.css:1
Solo importa Playfair + Outfit; no Inter
Fuente global distinta al sistema
App.tsx:82
fontFamily: 'Outfit' en lugar de Inter
Tokens CSS no conectados al app
index.css:1-4
No importa design-system/tokens.css; src/styles/tokens.css no existe
CSS legacy azul + pill activo
index.css:77-80,101,121
.btn-p usa #2563eb y border-radius: 32px
Shadcn radius conflictivo
theme.css:33
--radius: 0.625rem (~10px) vs sistema 2px
Hero sin responsive
GmusicLanding.tsx:59-62
Grid fijo 55fr 45fr, padding 80px; sin breakpoints
Comunidad sin responsive
GmusicLanding.tsx:322-324
Grid fijo 40fr 60fr
Planes sin responsive
GmusicLanding.tsx:515-517
Grid 3 columnas fijo
Clases responsive huérfanas
GmusicLanding.tsx (todo el archivo)
Sin className; reglas en responsive.css:7-71 no aplican
Animación floating card inválida
GmusicLanding.tsx:212
Prop animate-loop no es API válida de Motion
2. COPY
✅ Pasa
Check	Archivo:Línea
Eyebrow hero aprobado
GmusicLanding.tsx:79
H1 “Aprende música con constancia.”
GmusicLanding.tsx:91
Subtítulo “Empieza con guitarra…”
GmusicLanding.tsx:100-101
Texto botón “Probar gratis” (hero)
GmusicLanding.tsx:134
Texto botón “Conocer academia”
GmusicLanding.tsx:151
Microcopy sin tarjeta / 7 min / método
GmusicLanding.tsx:160-164
Nav labels correctos
Navbar.tsx:41-47
Planes sin precios inventados
GmusicLanding.tsx:501-558 (“Próximamente”)
Contacto con tono adecuado
GmusicLanding.tsx:624-630
❌ Falla
Check	Archivo:Línea	Detalle
CTA hero destino incorrecto
GmusicLanding.tsx:124
“Probar gratis” hace scrollTo("planes"); spec: setPage("probar") (CURSOR-CONTEXT.md:172)
CTA planes destino incorrecto
GmusicLanding.tsx:580,590
“Probar gratis” hace scrollTo("contacto")
Hero body desalineado
GmusicLanding.tsx:111-113
Texto corto custom; pendiente vs 01.1 (01.4-HOME-VS-01.1.md:28)
Testimonio sin aprobar
GmusicLanding.tsx:425
Cita de “Miguel” inventada
Atribución testimonio sin aprobar
GmusicLanding.tsx:435
“Miguel · Alumno activo”
Indicador social no aprobado
GmusicLanding.tsx:459-460
“Alumnos activos este mes” (prohibido inventar cifras sociales; aunque no pone número, el widget implica métrica)
/probar copy completo ausente
—
ProbarPage.tsx no existe; copy de 01.3-PROBAR-SCOPE.md:26-32 sin implementar
Fuente copy maestra ausente
—
docs/etapas/01-publico-deseo/01.1-COPY-CONVERSION.md no existe en repo
<title> y meta genéricos
index.html:8-9
Título/description en inglés genérico, no Gmusic
3. ESTRUCTURA
✅ Pasa
Check	Archivo:Línea
Home renderiza GmusicLanding
App.tsx:85-94
5 secciones con IDs ancla correctos
GmusicLanding.tsx:47,243,316,468,597
Navbar apunta a mismos IDs
Navbar.tsx:11,41-47
Footer nav coherente
GmusicLanding.tsx:739
Ruta community existe
App.tsx:144-146
Legacy no expuesto en nav principal
Navbar.tsx:41-47
InteractiveLevelSelector integrado en Academia
GmusicLanding.tsx:296
Entry point usa App.tsx
main.tsx:3-6
❌ Falla
Check	Archivo:Línea	Detalle
ProbarPage.tsx no existe
—
Referenciado en CURSOR-CONTEXT.md:107, 01.3-PROBAR-SCOPE.md:66
Ruta probar ausente
App.tsx
No hay currentPage === "probar"
MusicPlayer no excluye /probar
App.tsx:156
Condición solo !== "home"; spec pide excluir también probar
seo-routing.ts ausente
—
Referenciado en docs pero no en repo
Academia salta a legacy
InteractiveLevelSelector.tsx:55
setPage("instrument-courses") — fuera del embudo v1
“Iniciar sesión” sin acción
Navbar.tsx:109-121,156-162
Botón sin onClick / sin AuthModal
Estructura objetivo no migrada
—
No existe src/app/components/marketing/sections/
routes.tsx código muerto
routes.tsx:1-77
No usado; apunta a HomePage legacy
HomePage.tsx huérfana con copy prohibido
HomePage.tsx:65
“★ 4.9 · 2.8k reseñas” (cifra social inventada)
Docs dicen /probar ✅ pero código ❌
01.3-PROBAR-SCOPE.md:40-41
Tabla de implementación desactualizada
Archivos de contexto faltantes
—
01.1-COPY-CONVERSION.md, 01.2-IMPLEMENTACION.md, DECISIONES.md, design-system/MASTER.md, docs/FIGMA-CODIGO-CONTEXTO.md
.md en raíz del proyecto
—
ATTRIBUTIONS.md, README.md, etc. en raíz vs docs/ (CURSOR-CONTEXT.md:245)
Comando /qa sin definición
—
.claude/commands/qa.md no existe
4. Flujos secundarios (impacto v1)
Si el usuario hace clic en “Ver la comunidad” (GmusicLanding.tsx:365) o elige nivel en Academia:

Flujo	Problema	Archivo:Línea
Comunidad → CommunityPage
MusicPlayer azul aparece
App.tsx:156-165, MusicPlayer.tsx:103-129
Comunidad
CTAs/botones pill + azul protagonista
CommunityPage.tsx:148-363
Academia → instrument-courses
Entra a flujo legacy con precios/cifras
music-data.tsx:27-32, InstrumentCoursesPage.tsx
Esto no rompe la Home, pero desvía del embudo v1 y viola reglas visuales fuera del landing.

5. Bloqueantes para dar v1 por listo
Crear e integrar /probar — ProbarPage.tsx + ruta en App.tsx
Corregir CTAs “Probar gratis” — GmusicLanding.tsx:124 y :580
Eliminar o aprobar testimonio — GmusicLanding.tsx:425-435
Actualizar docs — 01.3-PROBAR-SCOPE.md y CURSOR-CONTEXT.md reflejan estado que el código no tiene
Cargar Inter — fonts.css:1 (tipografía body del design system)
6. Advertencias documentadas (no bloquean lanzamiento según 01.4)
Hero body pendiente de decisión (01.4-HOME-VS-01.1.md:28,38)
Secciones Método y Testimonios no existen en código (01.4-HOME-VS-01.1.md:31-32)
Radius legacy en componentes fuera del landing (AuthModal, CommunityPage, etc.)
Migración a marketing/sections/ diferida
Conclusión: La Home cumple en gran parte el sistema visual dorado/oscuro y el copy del hero está bien escrito, pero v1 no puede cerrarse hasta implementar /probar y arreglar los destinos de los CTAs principales. La documentación afirma que /probar ya está hecho; el código demuestra lo contrario.