import type { CSSProperties, ReactNode } from "react";
import { GM_SURFACE } from "../tokens";

const CARD_BORDER = "rgba(255,255,255,0.06)";
const CARD_SHADOW = "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset";

export interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  style?: CSSProperties;
  padding?: string;
}

export function PremiumCard({
  children,
  className = "",
  accent = false,
  style,
  padding = "28px 30px",
}: PremiumCardProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: 20,
        padding,
        background: accent
          ? "linear-gradient(145deg, rgba(21,21,21,0.98) 0%, rgba(14,14,14,0.98) 100%)"
          : `linear-gradient(160deg, ${GM_SURFACE} 0%, #111111 100%)`,
        border: accent ? "1px solid rgba(212,175,55,0.22)" : `1px solid ${CARD_BORDER}`,
        boxShadow: CARD_SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
