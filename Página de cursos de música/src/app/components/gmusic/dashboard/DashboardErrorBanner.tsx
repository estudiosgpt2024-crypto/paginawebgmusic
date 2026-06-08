import { RefreshCw } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { GM_GOLD, GM_TEXT_SEC } from "../tokens";

export interface DashboardErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function DashboardErrorBanner({ message, onRetry }: DashboardErrorBannerProps) {
  return (
    <PremiumCard
      className="w-full"
      padding="16px 20px"
      style={{
        borderRadius: 16,
        background: "rgba(40, 18, 18, 0.85)",
        border: "1px solid rgba(248, 113, 113, 0.25)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm leading-relaxed" style={{ color: GM_TEXT_SEC }}>
          {message}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#C9A84C]/20 cursor-pointer"
          style={{
            color: GM_GOLD,
            border: "1px solid rgba(201, 168, 76, 0.35)",
            background: "rgba(201, 168, 76, 0.08)",
          }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
      </div>
    </PremiumCard>
  );
}
