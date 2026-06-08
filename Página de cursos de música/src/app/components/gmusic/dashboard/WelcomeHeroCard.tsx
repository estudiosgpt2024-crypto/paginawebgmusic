import { Flame, Mic } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { GM_GOLD, GM_TEXT, GM_TEXT_SEC } from "../tokens";

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
      padding="24px 32px"
      style={{
        borderRadius: 20,
        background: "linear-gradient(145deg, #121212 0%, #0c0c0c 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset",
      }}
    >
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <p
          className="text-[9px] uppercase tracking-[0.25em] mb-2 font-bold"
          style={{ color: GM_GOLD }}
        >
          Tu práctica de hoy
        </p>

        <h1
          className="font-normal mb-3"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: 0,
            lineHeight: 1.2,
          }}
        >
          <span className="font-semibold text-xl md:text-2xl text-white inline-block mr-2">
            Hola, {userName}.
          </span>
          <span className="text-lg md:text-xl inline-block">
            <em style={{ color: GM_GOLD, fontStyle: "italic", fontWeight: 500 }}>
              Tu práctica de hoy
            </em>{" "}
            <span style={{ color: GM_TEXT, fontWeight: 500 }}>está lista.</span>
          </span>
        </h1>

        <p className="text-xs md:text-sm mb-4 text-zinc-400 font-medium">{practiceWeekLine}</p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <div
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]"
            style={{ color: GM_GOLD }}
          >
            <Flame className="w-4 h-4 shrink-0 fill-current animate-pulse text-[#C9A84C]" />
            <span>Racha activa: {streakLabel}</span>
          </div>

          {!isCheckingPermission && (
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
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
              <span className="flex h-1.5 w-1.5 relative shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${audioState === "granted" ? "bg-[#C9A84C]" : "bg-zinc-500"}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${audioState === "granted" ? "bg-[#C9A84C]" : "bg-zinc-600"}`}
                />
              </span>
              <Mic
                className="w-3.5 h-3.5 shrink-0"
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
                  className="text-[9px] font-bold px-2 py-0.5 rounded-md ml-1.5 hover:bg-[#C9A84C]/25 transition-colors cursor-pointer"
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
