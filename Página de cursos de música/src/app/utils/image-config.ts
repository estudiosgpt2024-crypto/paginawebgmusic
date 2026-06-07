// Configuración centralizada para imágenes optimizadas

export const IMAGE_SIZES = {
  thumbnail: 100,
  small: 200,
  medium: 400,
  large: 600,
  xlarge: 800,
  hero: 1200,
} as const;

export const IMAGE_QUALITY = {
  low: 60,
  medium: 75,
  high: 85,
  max: 95,
} as const;

// Configuración por tipo de imagen
export const IMAGE_CONFIG = {
  albumCover: {
    sizes: {
      card: IMAGE_SIZES.large,
      detail: IMAGE_SIZES.xlarge,
      player: IMAGE_SIZES.small,
    },
    quality: IMAGE_QUALITY.high,
  },
  courseThumbnail: {
    sizes: {
      card: IMAGE_SIZES.xlarge,
      detail: IMAGE_SIZES.hero,
      list: IMAGE_SIZES.medium,
    },
    quality: IMAGE_QUALITY.high,
  },
  instructorAvatar: {
    sizes: {
      small: IMAGE_SIZES.thumbnail,
      medium: IMAGE_SIZES.small,
    },
    quality: IMAGE_QUALITY.medium,
  },
  hero: {
    sizes: {
      mobile: IMAGE_SIZES.large,
      desktop: IMAGE_SIZES.hero,
    },
    quality: IMAGE_QUALITY.high,
  },
} as const;

// URLs de fallback por tipo de contenido
export const FALLBACK_IMAGES = {
  album: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzExMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjNTU1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlPC90ZXh0Pjwvc3ZnPg==',
  course: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzExMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjNTU1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdXJzZSBpbWFnZTwvdGV4dD48L3N2Zz4=',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzExMSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjNTU1Ii8+PHBhdGggZD0iTTIwIDgwIFEyMCA2MCA1MCA2MCBRODMCA2MCA4MCA4MCIgZmlsbD0iIzU1NSIvPjwvc3ZnPg==',
} as const;

// Detectar si la URL es de Unsplash para aplicar optimizaciones específicas
export function isUnsplashImage(url: string): boolean {
  return url.includes('unsplash.com') || url.includes('images.unsplash.com');
}

// Generar srcset para imágenes responsivas
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  if (!isUnsplashImage(baseUrl)) return '';

  return sizes
    .map(size => {
      const url = new URL(baseUrl);
      url.searchParams.set('w', size.toString());
      url.searchParams.set('q', '80');
      url.searchParams.set('auto', 'format');
      return `${url.toString()} ${size}w`;
    })
    .join(', ');
}

// Precarga de imágenes críticas
export function preloadCriticalImages(urls: string[]) {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Cache simple de imágenes en memoria
class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50;

  set(key: string, value: string) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();
