import type { CSSProperties, ReactNode } from "react";
import { DASH_TOKENS } from "../tokens";

export type PremiumCardElevation = "rest" | "raised";

export interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  elevation?: PremiumCardElevation;
  style?: CSSProperties;
  padding?: string;
}

function resolvePremiumCardStyle(
  accent: boolean,
  elevation: PremiumCardElevation
): CSSProperties {
  const isRaised = elevation === "raised";

  if (accent && isRaised) {
    return {
      borderRadius: DASH_TOKENS.radiusCardRaised,
      background: DASH_TOKENS.surfaceAccent,
      border: `1.5px solid ${DASH_TOKENS.borderAccentStrong}`,
      boxShadow: `${DASH_TOKENS.shadowRaised}, ${DASH_TOKENS.shadowAccentInset}`,
    };
  }

  if (accent) {
    return {
      borderRadius: DASH_TOKENS.radiusCard,
      background: `linear-gradient(145deg, rgba(21, 21, 21, 0.98) 0%, rgba(14, 14, 14, 0.98) 100%)`,
      border: `1px solid ${DASH_TOKENS.borderAccent}`,
      boxShadow: DASH_TOKENS.shadowRest,
    };
  }

  return {
    borderRadius: isRaised ? DASH_TOKENS.radiusCardRaised : DASH_TOKENS.radiusCard,
    background: isRaised ? DASH_TOKENS.surface2 : DASH_TOKENS.surfaceMetric,
    border: `1px solid ${DASH_TOKENS.borderRest}`,
    boxShadow: isRaised ? DASH_TOKENS.shadowRaised : DASH_TOKENS.shadowRest,
  };
}

export function PremiumCard({
  children,
  className = "",
  accent = false,
  elevation = "rest",
  style,
  padding = "28px 30px",
}: PremiumCardProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        padding,
        ...resolvePremiumCardStyle(accent, elevation),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
