import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

export interface LockedFeatureCardProps {
  icon: LucideIcon;
  eyebrow: string;
  description: string;
}

export function LockedFeatureCard({ icon: Icon, eyebrow, description }: LockedFeatureCardProps) {
  return (
    <PremiumCard
      padding="30px 32px"
      style={{
        background: "linear-gradient(160deg, #0d0d0d 0%, #070707 100%)",
        border: "1px solid rgba(255,255,255,0.02)",
        transition: "border-color 0.3s ease",
      }}
      className="hover:border-white/[0.05] group"
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[#C9A84C]/10"
          style={{
            background: "rgba(201,168,76,0.05)",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          <Icon className="w-[20px] h-[20px] text-[#C9A84C]/60 group-hover:text-[#C9A84C]/90" />
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="text-[9px] uppercase tracking-[0.18em] font-bold px-3 py-1.5 rounded-full"
            style={{
              color: "rgba(201,168,76,0.8)",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            Próximamente
          </span>
          <Lock
            className="w-4.5 h-4.5 text-[#C9A84C]/50 group-hover:text-[#C9A84C]/80 transition-colors"
            strokeWidth={1.5}
          />
        </div>
      </div>
      <p
        className="text-[10px] uppercase tracking-[0.2em] mb-2 font-bold"
        style={{ color: "rgba(180,180,185,0.78)" }}
      >
        {eyebrow}
      </p>
      <h3
        className="text-xl font-semibold mb-2.5 text-zinc-200 group-hover:text-white transition-colors"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        Próximamente
      </h3>
      <p className="text-[14px] leading-relaxed group-hover:text-zinc-300 transition-colors" style={{ color: "rgba(180,180,185,0.88)" }}>
        {description}
      </p>
    </PremiumCard>
  );
}
