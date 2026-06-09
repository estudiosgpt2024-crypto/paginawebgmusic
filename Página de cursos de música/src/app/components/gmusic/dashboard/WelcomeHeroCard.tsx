import { Flame, Mic } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { GM_GOLD, GM_TEXT_SEC } from "../tokens";

export interface WelcomeHeroCardProps {
  userName: string;
  practiceWeekLine: string;
  streakLabel: string;
  audioLabel: string;
  audioState: "pending" | "granted" | "denied";
  isCheckingPermission: boolean;
  onRequestAudio: () => void;
}

export function WelcomeHeroCard({
  userName,
  practiceWeekLine,
  streakLabel,
  audioLabel,
  audioState,
  isCheckingPermission,
  onRequestAudio,
}: WelcomeHeroCardProps) {
  return (
    <PremiumCard
      className="w-full"
      padding="20px 24px"
      style={{
        borderRadius: 20,
        background: "linear-gradient(145deg, #121212 0%, #0c0c0c 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset",
      }}
    >
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 text-left">
          <p
            className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em]"
            style={{ color: GM_GOLD }}
          >
            {practiceWeekLine}
          </p>
          <h1
            className="text-xl font-normal leading-tight text-white lg:text-[28px]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              letterSpacing: 0,
            }}
          >
            Hola, {userName}. Tu práctica está lista.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:shrink-0 lg:justify-end">
          <div
            className="flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-3.5 py-1.5 text-xs font-semibold"
            style={{ color: GM_GOLD }}
          >
            <Flame className="h-4 w-4 shrink-0 fill-current text-[#C9A84C]" />
            <span>Racha activa: {streakLabel}</span>
          </div>

          {!isCheckingPermission && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{
                background:
                  audioState === "granted"
                    ? "rgba(212,175,55,0.08)"
                    : "rgba(255,255,255,0.03)",
                border:
                  audioState === "granted"
                    ? "1px solid rgba(212,175,55,0.2)"
                    : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                className={`inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${audioState === "granted" ? "bg-[#C9A84C]" : "bg-zinc-600"}`}
                aria-hidden
              />
              <Mic
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: audioState === "granted" ? GM_GOLD : GM_TEXT_SEC }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: audioState === "granted" ? GM_GOLD : GM_TEXT_SEC }}
              >
                {audioLabel}
              </span>
              {audioState === "pending" && (
                <button
                  type="button"
                  onClick={onRequestAudio}
                  className="ml-1.5 cursor-pointer rounded-md px-2 py-0.5 text-[9px] font-bold transition-colors hover:bg-[#C9A84C]/25"
                  style={{ background: "rgba(212,175,55,0.12)", color: GM_GOLD }}
                >
                  Activar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </PremiumCard>
  );
}
