# Propuesta Visual y Técnica — Extracción de Componentes (Fase 3)

Esta especificación detalla el plan de refactorización para extraer los componentes del panel **Mi Estudio (GmusicWelcome.tsx)** en módulos atómicos y reutilizables. Este proceso simplifica el mantenimiento, facilita los tests visuales y mantiene la coherencia con `DESIGN.md`.

---

## Reglas de Extracción por Bloques (Comment Markers)

La separación de los bloques JSX **no debe guiarse por números de línea**, ya que estos pueden variar durante el desarrollo. En su lugar, el refactor debe identificar y extraer el código delimitado exactamente por las marcas de comentario (comment markers) del archivo:
- **`PUNTO 1 — Hero superior`**
- **`PUNTO 2 — Próxima práctica`**
- **`PUNTO 3 — Cards métricas`**
- **`PUNTO 4 — Desafío y Laboratorio`**

---

## Componentes a Extraer

### 0. PremiumCard (Componente Base)
*   **Destino:** `src/app/components/gmusic/dashboard/PremiumCard.tsx`
*   **Responsabilidad Visual:** Tarjeta contenedora base de Gmusic con degradados premium carbón y acentos oro de la marca.
*   **Props:**
    ```typescript
    import type { ReactNode, CSSProperties } from "react";

    interface PremiumCardProps {
      children: ReactNode;
      className?: string;
      accent?: boolean;
      style?: CSSProperties;
      padding?: string;
    }
    ```

### 1. WelcomeHeroCard
*   **Destino:** `src/app/components/gmusic/dashboard/WelcomeHeroCard.tsx`
*   **Responsabilidad Visual:** Renderizar el saludo centrado al alumno, indicador de racha activa y el estado visual del micrófono (audio).
*   **Props:**
    ```typescript
    interface WelcomeHeroCardProps {
      userName: string;
      streakLabel: string;
      practiceWeekLine: string;
      audioState: "pending" | "granted" | "denied";
      isCheckingPermission: boolean;
      audioLabel: string;
      onActivateAudio: () => void;
    }
    ```
*   **JSX a mover:** El bloque delimitado bajo el marcador de comentario `PUNTO 1`.

### 2. PracticeCard
*   **Destino:** `src/app/components/gmusic/dashboard/PracticeCard.tsx`
*   **Responsabilidad Visual:** Destacar la próxima lección del alumno como acción central (degradado oro oscuro y botón "Continuar mi Camino").
*   **Props:**
    ```typescript
    interface PracticeCardProps {
      title: string;
      typeLabel: string;
      description: string;
      onContinue: () => void;
    }
    ```
*   **JSX a mover:** El bloque delimitado bajo el marcador de comentario `PUNTO 2`.

### 3. MetricCard
*   **Destino:** `src/app/components/gmusic/dashboard/MetricCard.tsx`
*   **Responsabilidad Visual:** **Exclusivo para el renderizado de métricas en el dashboard** (Progreso, XP, etc.). No debe utilizarse como tarjeta genérica para otros propósitos.
*   **Props:**
    ```typescript
    import type { ReactNode } from "react";
    import type { LucideIcon } from "lucide-react";

    interface MetricCardProps {
      title: string;
      icon: LucideIcon;
      metricValue: string;
      metricUnit?: string;
      progressValue?: number; // Para la barra de progreso
      rightWidget?: ReactNode; // Widget del pulso de XP
      children?: ReactNode; // Tablas y footnotes específicos de la métrica
    }
    ```
*   **JSX a mover:** Las dos primeras tarjetas (Progreso y XP) bajo el marcador de comentario `PUNTO 3`.

### 4. QuoteCard
*   **Destino:** `src/app/components/gmusic/dashboard/QuoteCard.tsx`
*   **Responsabilidad Visual:** Bloque editorial premium itálica para citas inspiradoras.
*   **Props:**
    ```typescript
    interface QuoteCardProps {
      quoteText: string;
    }
    ```
*   **JSX a mover:** La tercera tarjeta de cita bajo el marcador de comentario `PUNTO 3`.

### 5. LockedFeatureCard
*   **Destino:** `src/app/components/gmusic/dashboard/LockedFeatureCard.tsx`
*   **Responsabilidad Visual:** Tarjeta visual de módulo bloqueado con opacidad del 72% y badge de "Próximamente".
*   **Props:**
    ```typescript
    import type { LucideIcon } from "lucide-react";

    interface LockedFeatureCardProps {
      icon: LucideIcon;
      eyebrow: string;
      description: string;
    }
    ```
*   **JSX a mover:** La función helper `LockedFeatureCard` y su renderizado bajo el marcador de comentario `PUNTO 4`.

---

## Límites y Responsabilidades de Código

### Responsabilidad de GmusicWelcome.tsx:
Para garantizar que los nuevos componentes se mantengan puros y desacoplados, la página contenedora **`GmusicWelcome.tsx` conserva en su totalidad**:
1.  **Lógica del Micrófono:** Consulta del estado de permisos del navegador y llamadas de acceso de audio.
2.  **Estado de Audio:** El estado local `audioState` y `isCheckingPermission`.
3.  **Navegación:** La lógica de navegación de rutas a través de la función `setPage`.
4.  **Datos Mock y Constantes:** Constantes como `DAILY_QUOTE`, `PRACTICE_WEEK_LINE` y la importación de `MOCK_USER`.

### Estrictamente PROHIBIDO tocar:
Durante esta fase de extracción, **NO se modificará ni alterará**:
*   `GmusicPath.tsx` (ni su lógica de camino).
*   Código de backend o endpoints.
*   Modelos de base de datos o esquemas de Prisma.
*   Documentos de arquitectura del motor de lecciones (`gmusic-learning-engine` / `.agents/skills`).
*   Configuración de rutas SEO del archivo `seo-routing.ts`.
*   Cualquier diseño visual perteneciente a etapas futuras (Fase 4 o posteriores).
