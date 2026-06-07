 DISEÑO — Lo que debes mejorar
1. Responsive mobile (crítico)
Cada sección necesita breakpoints. En Figma crea frames para 3 tamaños:

Desktop: 1440px
Tablet: 768px
Mobile: 390px

Reglas por sección:
Hero: En mobile, font-size del H1 baja de 64px a 36px. Los dos botones se apilan verticalmente (column, gap 12px). Padding lateral: 24px.
Sección Música (álbumes): El scroll horizontal horizontal está bien en mobile, pero reduce minWidth de cada card de 240px a 160px.
InteractiveLevelSelector: En mobile cambia de horizontal a vertical stack — cada nivel ocupa 100% de ancho, altura fija 120px, el activo se expande a 200px.
Sección Comunidad: El grid 45fr 55fr colapsa a una columna en mobile. La imagen va primero, el texto debajo.
Footer: El grid 2fr 1fr 1fr 1fr colapsa a 2 columnas en tablet y 1 columna en mobile.

2. Spacing y jerarquía visual
El proyecto usa demasiados tamaños distintos de fuente ad-hoc. Establece este sistema tipográfico:
TokenTamañoPesoUsoDisplay64px600Hero H1H152px500Section titlesH238px400SubseccionesH324px700Card titlesBody16px400PárrafosSmall13px400Labels, captions

3. Mejora visual de la Navbar
Actualmente la navbar no tiene blur/glassmorphism al hacer scroll. Diseña un estado "scrolled":

Background: rgba(8,8,8,0.85) + backdrop-filter: blur(20px)
Transición suave 300ms
Borde inferior: 1px solid rgba(255,255,255,0.08)

Agrega en la navbar: botón "Iniciar sesión" (outline) + "Comenzar gratis" (filled amarillo #FBBF24). Esto aumenta conversión inmediatamente.

4. Sección de Testimonios (faltante — alta prioridad)
Después de la sección de cursos, agrega una sección nueva. Layout: grid de 3 cards con este diseño cada una:

Fondo: rgba(255,255,255,0.03) + border rgba(255,255,255,0.06)
Border-radius: 20px
Contenido: avatar circular (40px) + nombre + instrumento + texto testimonial (max 120 chars) + 5 estrellas amarillas
Añade badge flotante amarillo: "Alumno verificado"


⚙️ CÓDIGO — Instrucciones de implementación
5. Limpiar el routing (hazlo YA, es rápido)
En tu proyecto, borra src/app/routes.tsx completo — no está siendo usado.
En App.tsx, la página de inicio apunta a GmusicLanding pero HomePage.tsx también existe sin conectarse. Debes elegir una: la landing de marketing es GmusicLanding — úsala como home. HomePage.tsx puede convertirse en la vista interna post-login (biblioteca de música).

6. Responsive — media queries que necesitas agregar
En cada componente que tiene grids fijos, agrega este patrón:
css/* En index.css o theme.css */
@media (max-width: 768px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(1, 1fr); }
  .hero-title { font-size: clamp(32px, 8vw, 56px); }
  .section-padding { padding: 60px 24px; }
  .community-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

7. TypeScript — tipos que faltan
En GmusicLanding.tsx, reemplaza la firma de la función:
ts// ANTES (sin tipos):
export function GmusicLanding({ onPlay, onPlayAlbum, currentTrack, playing, setPage, setAlbum })

// DESPUÉS:
interface Track { id: number; title: string; artist: string; album: string; image: string; duration: string; }
interface Album { id: number; title: string; artist: string; image: string; }

interface GmusicLandingProps {
  onPlay: (track: Track) => void;
  onPlayAlbum: (album: Album) => void;
  currentTrack: Track | null;
  playing: boolean;
  setPage: (page: string) => void;
  setAlbum: (album: Album) => void;
}
export function GmusicLanding({ onPlay, onPlayAlbum, currentTrack, playing, setPage, setAlbum }: GmusicLandingProps)

8. Reducir bundle — dependencias a eliminar
En package.json puedes borrar con seguridad estas dependencias sin romper nada visible:

@mui/material y @mui/icons-material (MUI no se usa, solo Radix)
@emotion/react y @emotion/styled (dependencias de MUI)
react-slick (usas Embla que es mejor)
react-dnd y react-dnd-html5-backend (no hay drag & drop implementado)
react-responsive-masonry (no usado)
canvas-confetti (no hay confetti en el proyecto)
cmdk (command palette sin implementar)

Esto reduce el bundle aprox. 40%.

9. TRACKS — preparar para audio real
En music-data.tsx, cada track necesita un campo audioUrl. Por ahora agrega URLs de demo gratuitas para que el player funcione:
tsexport const TRACKS = [
  { 
    id: 1, 
    title: "Into The Void", 
    artist: "The Resonance",
    // ... resto de campos ...
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  // Hay 8 canciones en SoundHelix (Song-1 a Song-8), úsalas todas
];
En MusicPlayer.tsx, conecta el audioUrl a un elemento <audio> con useRef para que el play/pause realmente funcione.

✍️ CONTENIDO — Mejoras de copy
10. Hero — copy más específico y con propuesta de valor clara
ANTES:

"Aprende, practica y crece dentro de un ecosistema diseñado para tu proceso musical."

DESPUÉS:

"Más de 2,800 músicos ya están aprendiendo con instructores certificados. Cursos desde nivel cero hasta profesional, con feedback real y comunidad activa."


11. CTAs — ser más específicos
SecciónCTA actualCTA mejoradoHero"Comenzar ahora""Ver cursos disponibles"Cursos"Comenzar mi proceso""Ver los 6 cursos →"Comunidad"Unirme a la comunidad""Unirme gratis hoy"Contacto"Enviar mensaje""Hablar con un instructor"

12. Sección de Cursos — agregar info de precio en contexto
Cada CourseCard ya muestra el precio ($89, $79, etc.). Agrega debajo del precio:

$120 (precio tachado, simula descuento)
"o 3 pagos de $X"
Badge: "🔥 Más popular" en el curso con más estudiantes


13. Footer — completar textos vacíos
Los links de Legal apuntan a #. Mientras no tengas páginas reales, crea páginas simples de:

Términos de uso — mínimo 300 palabras con estructura básica
Privacidad — indica qué datos recopilas (email, nombre)
Cookies — indica uso de cookies analíticas

Esto es importante para credibilidad y para no tener links rotos.

📈 ESTRATEGIA — Sin backend, igual puedes mejorar la conversión
14. Agregar página de precios (sin pago real)
Crea una nueva página PricingPage.tsx con 3 planes:
PlanPrecioFeaturesBásico$29/mesAcceso a 2 cursos, comunidadPro$59/mesTodos los cursos, feedback mensualAcademia$99/mesTodo + clases en vivo 1:1
El botón de cada plan puede abrir un modal que diga "Déjanos tu email y te contactamos" — eso te captura leads sin necesitar backend, usando mailto: o un servicio como Formspree (gratis, no necesitas backend).

15. Usar Formspree para el formulario (gratis, sin backend)
Regístrate en formspree.io gratis. Te da un endpoint como:
https://formspree.io/f/xwkgabcd
Cambia el handleSubmit de GmusicLanding.tsx:
tsconst handleSubmit = async (e) => {
  e.preventDefault();
  await fetch("https://formspree.io/f/TU_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  setFormSubmitted(true);
};
En 5 minutos tienes un formulario real que te llega al email. Cero backend.

16. SEO — agregar meta tags al index.html
html<meta name="description" content="Gmusic — Plataforma de cursos de música online. Aprende guitarra, piano, producción musical y más con instructores certificados." />
<meta name="keywords" content="cursos de música, aprender guitarra, piano online, producción musical" />
<meta property="og:title" content="Gmusic — Formación real para músicos reales" />
<meta property="og:description" content="Más de 2,800 músicos activos aprendiendo con los mejores instructores." />
<meta property="og:image" content="URL_DE_TU_IMAGEN_HERO" />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://tu-dominio.com" />

17. Agregar Google Analytics o Hotjar (sin backend)
Para saber dónde hace clic la gente, agrega al index.html:
Google Analytics (gratuito):
html<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
Hotjar (gratuito) — te graba sesiones de usuarios reales para ver dónde se pierden.