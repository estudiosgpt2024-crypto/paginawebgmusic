import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

const PLACEHOLDER_SHIMMER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTExO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxYTE1YTE1O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTExO3N0b3Atb3BhY2l0eToxIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIGZyb209Ii00MDAgMCIgdG89IjQwMCAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

export function OptimizedImage({
  src,
  alt,
  priority = false,
  fallbackSrc,
  aspectRatio,
  objectFit = 'cover',
  className = '',
  style = {},
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(priority ? src : PLACEHOLDER_SHIMMER);
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    } else {
      setImgSrc(ERROR_IMG_SRC);
    }
  };

  const containerStyle = {
    position: 'relative' as const,
    aspectRatio: aspectRatio,
    overflow: 'hidden',
    ...style,
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoading ? 0 : 1,
  };

  return (
    <div style={containerStyle} className={className}>
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        style={imgStyle}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
      {isLoading && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#111',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
    </div>
  );
}

// Hook para precarga de imágenes críticas
export function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);
}

// Utilidad para generar URLs optimizadas de Unsplash
export function getOptimizedImageUrl(url: string, width?: number, quality: number = 80) {
  if (!url.includes('unsplash.com')) return url;

  const urlObj = new URL(url);
  if (width) urlObj.searchParams.set('w', width.toString());
  urlObj.searchParams.set('q', quality.toString());
  urlObj.searchParams.set('auto', 'format');
  urlObj.searchParams.set('fit', 'crop');

  return urlObj.toString();
}
