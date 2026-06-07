# Guía de Optimización de Imágenes

## 📋 Resumen de Mejoras Implementadas

Esta aplicación ahora cuenta con un sistema completo de optimización de imágenes que incluye:

### ✅ Características Principales

1. **Lazy Loading Inteligente**
   - Carga diferida de imágenes fuera del viewport
   - Precarga de imágenes críticas (above-the-fold)
   - Placeholders con efecto shimmer mientras cargan

2. **Optimización de URLs (Unsplash)**
   - Redimensionamiento automático según contexto
   - Ajuste de calidad por tipo de imagen
   - Parámetros de formato automático (WebP cuando disponible)

3. **Manejo de Errores**
   - Fallback automático a imagen de respaldo
   - Iconos SVG inline para errores
   - Sin romper la UI si una imagen falla

4. **Performance**
   - Cache en memoria de URLs procesadas
   - Intersection Observer para detección de viewport
   - Transiciones suaves al cargar

5. **Accesibilidad**
   - Alt text obligatorio en todos los componentes
   - Loading states visibles
   - Respeta las preferencias de motion del usuario

---

## 🎨 Componentes Disponibles

### `OptimizedImage`

Componente base para todas las imágenes. Reemplaza el tag `<img>` estándar.

```tsx
import { OptimizedImage, getOptimizedImageUrl } from '../ui/OptimizedImage';

<OptimizedImage
  src={getOptimizedImageUrl(album.image, 600)}
  alt="Album cover"
  aspectRatio="1"
  objectFit="cover"
  priority={false}
/>
```

**Props:**
- `src`: URL de la imagen
- `alt`: Texto alternativo (obligatorio)
- `priority`: Si es true, carga inmediatamente sin lazy loading
- `fallbackSrc`: URL de respaldo si falla la carga
- `aspectRatio`: Mantiene proporción (ej: "16/9", "1", "4/3")
- `objectFit`: Cómo ajustar la imagen ('cover' | 'contain' | etc)

### `Avatar`

Componente especializado para imágenes de perfil/instructor.

```tsx
import { Avatar } from '../ui/Avatar';

<Avatar
  src={instructor.image}
  alt={instructor.name}
  size="medium"
/>
```

**Props:**
- `src`: URL de la imagen
- `alt`: Nombre del instructor
- `size`: 'small' (40px) | 'medium' (64px) | 'large' (96px)

---

## 🛠️ Utilidades

### `getOptimizedImageUrl(url, width, quality)`

Optimiza URLs de Unsplash con parámetros de tamaño y calidad.

```tsx
// Antes
<img src="https://images.unsplash.com/photo-123456.jpg?w=600&q=80" />

// Ahora
<OptimizedImage
  src={getOptimizedImageUrl(originalUrl, 600, 80)}
  alt="Description"
/>
```

### `generateSrcSet(baseUrl, sizes)`

Genera srcset para imágenes responsivas.

```tsx
const srcset = generateSrcSet(imageUrl, [400, 800, 1200]);
// Resultado: "url?w=400 400w, url?w=800 800w, url?w=1200 1200w"
```

### `preloadCriticalImages(urls)`

Precarga imágenes que aparecerán inmediatamente en la pantalla.

```tsx
useEffect(() => {
  preloadCriticalImages([
    heroImage,
    firstAlbumCover,
    currentTrackImage
  ]);
}, []);
```

---

## 📐 Configuración de Tamaños

En `/src/app/utils/image-config.ts`:

```tsx
export const IMAGE_CONFIG = {
  albumCover: {
    sizes: {
      card: 600,      // Tarjetas en grids
      detail: 800,    // Página de detalle
      player: 200,    // Player de música
    },
    quality: 85,
  },
  courseThumbnail: {
    sizes: {
      card: 800,      // Tarjetas de cursos
      detail: 1200,   // Hero de curso
      list: 400,      // Vista de lista
    },
    quality: 85,
  },
  instructorAvatar: {
    sizes: {
      small: 100,     // Avatares pequeños
      medium: 200,    // Avatares normales
    },
    quality: 75,
  },
}
```

---

## 🎯 Mejores Prácticas

### ✅ Hacer

```tsx
// ✅ Usar OptimizedImage con tamaño apropiado
<OptimizedImage
  src={getOptimizedImageUrl(course.image, 800)}
  alt={course.title}
  aspectRatio="16/9"
  priority={isAboveFold}
/>

// ✅ Marcar imágenes críticas como priority
<OptimizedImage
  src={heroImage}
  alt="Hero"
  priority={true}
/>

// ✅ Proporcionar fallbacks
<OptimizedImage
  src={userImage}
  alt="User"
  fallbackSrc={FALLBACK_IMAGES.avatar}
/>
```

### ❌ Evitar

```tsx
// ❌ No usar <img> directamente
<img src={course.image} alt="Course" />

// ❌ No omitir el alt text
<OptimizedImage src={image} alt="" />

// ❌ No usar tamaños muy grandes innecesariamente
<OptimizedImage
  src={getOptimizedImageUrl(thumbnailImage, 4000)}
  // thumbnails no necesitan 4000px
/>

// ❌ No marcar todo como priority
<OptimizedImage priority={true} /> // Solo para above-the-fold
```

---

## 🔄 Migración de Código Existente

### Antes:
```tsx
<img
  src={album.image}
  alt={album.title}
  style={{ width: '100%', objectFit: 'cover' }}
/>
```

### Después:
```tsx
import { OptimizedImage, getOptimizedImageUrl } from '../ui/OptimizedImage';

<OptimizedImage
  src={getOptimizedImageUrl(album.image, 600)}
  alt={album.title}
  aspectRatio="1"
  objectFit="cover"
  priority={false}
/>
```

---

## 📊 Mejoras de Performance Esperadas

Con estas optimizaciones deberías ver:

- **Reducción de 40-60%** en tamaño de imágenes descargadas
- **Mejora de 2-3 segundos** en tiempo de carga inicial
- **Scroll más fluido** gracias al lazy loading
- **Menos consumo de datos** para usuarios móviles
- **Mejor Core Web Vitals** (LCP, CLS)

---

## 🐛 Debugging

Si una imagen no carga:

1. Verifica la URL en Network tab del DevTools
2. Comprueba que `getOptimizedImageUrl` esté generando URLs válidas
3. Revisa si el error está siendo capturado (fallback visible)
4. Verifica que `alt` esté definido (componente lo requiere)

---

## 🚀 Próximos Pasos Recomendados

1. **Migrar todas las páginas** para usar `OptimizedImage`
2. **Implementar srcset** para imágenes hero responsivas
3. **Agregar blur placeholder** con thumbhash o blurhash
4. **Configurar Service Worker** para cachear imágenes offline
5. **Implementar Progressive JPEGs** para carga incremental

---

## 📝 Componentes Actualizados

Ya migrados a la nueva estructura:
- ✅ `AlbumCard` - Cards de álbumes
- ✅ `CourseCard` - Cards de cursos
- ✅ `VinylDisc` - Reproductor de vinilo
- ⏳ `GmusicLanding` - Pendiente
- ⏳ `CourseDetailPage` - Pendiente
- ⏳ `InstrumentCoursesPage` - Pendiente

---

## 💡 Ejemplos de Uso por Contexto

### Grid de Álbumes
```tsx
<OptimizedImage
  src={getOptimizedImageUrl(album.image, IMAGE_CONFIG.albumCover.sizes.card)}
  alt={`${album.title} by ${album.artist}`}
  aspectRatio="1"
  objectFit="cover"
/>
```

### Hero de Curso
```tsx
<OptimizedImage
  src={getOptimizedImageUrl(course.image, IMAGE_CONFIG.courseThumbnail.sizes.detail)}
  alt={course.title}
  aspectRatio="16/9"
  priority={true}
/>
```

### Avatar de Instructor
```tsx
<Avatar
  src={instructor.image}
  alt={instructor.name}
  size="medium"
/>
```

---

**Documentación creada:** Mayo 2026  
**Última actualización:** Mayo 2026
