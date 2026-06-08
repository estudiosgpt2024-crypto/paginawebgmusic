import type { LucideIcon } from "lucide-react";
import { Activity } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { GM_GOLD, GM_TEXT_SEC } from "../tokens";

const METRIC_CARD_SHADOW =
  "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset, inset 0 0 0 1px rgba(201,168,76,0.08)";

const metricCardStyle = {
  background: "linear-gradient(165deg, #141414 0%, #0d0d0d 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 20,
  boxShadow: METRIC_CARD_SHADOW,
};

const PROGRESS_LED = "#38BDF8";

type MetricCardBaseProps = {
  icon: LucideIcon;
  eyebrow: string;
  className?: string;
};

export type ProgressMetricCardProps = MetricCardBaseProps & {
  variant: "progress";
  value: string;
  suffix: string;
  progressPercent: number;
  nodeTitle: string;
  phaseLabel: string;
};

export type XpMetricCardProps = MetricCardBaseProps & {
  variant: "xp";
  xpTotal: number;
  weeklyGain: number;
  consistencyStatus: string;
  exercisesUntilChest: number;
};

export type MetricCardProps = ProgressMetricCardProps | XpMetricCardProps;

export function MetricCard(props: MetricCardProps) {
  const { icon: Icon, eyebrow, className = "lg:col-span-4" } = props;

  if (props.variant === "progress") {
    return (
      <PremiumCard className={className} padding="32px 30px" style={metricCardStyle}>
        <div className="flex items-center gap-2.5 mb-5">
          <Icon className="w-4 h-4" style={{ color: GM_GOLD }} />
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold" style={{ color: GM_TEXT_SEC }}>
            {eyebrow}
          </p>
        </div>
        <div className="flex items-baseline gap-2.5 mb-6">
          <span className="text-6xl md:text-7xl font-extrabold leading-none tracking-normal text-white font-sans">
            {props.value}
          </span>
          <span className="text-sm font-medium uppercase tracking-[0.12em]" style={{ color: GM_TEXT_SEC }}>
            {props.suffix}
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden mb-6"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="relative h-full min-w-0 rounded-full"
            style={{
              width: `${props.progressPercent}%`,
              maxWidth: "100%",
              background: `linear-gradient(90deg, ${GM_GOLD} 0%, rgba(201,168,76,0.8) 100%)`,
              boxShadow: "0 0 10px rgba(201,168,76,0.3)",
            }}
          >
            {props.progressPercent > 0 && (
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: 5,
                  height: 5,
                  marginRight: 1,
                  background: PROGRESS_LED,
                  boxShadow: `0 0 6px rgba(56,189,248,0.85), 0 0 2px ${PROGRESS_LED}`,
                }}
                aria-hidden
              />
            )}
          </div>
        </div>
        <div
          className="flex flex-col gap-2 text-[13px] pt-1"
          style={{ color: "rgba(160,160,165,0.85)" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-white/60">Nodo actual</span>
            <span className="font-semibold text-white">{props.nodeTitle}</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/[0.04] pt-2">
            <span className="text-white/60">Fase</span>
            <span className="font-medium text-[#C9A84C]">{props.phaseLabel}</span>
          </div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className={className} padding="32px 30px" style={metricCardStyle}>
      <div className="flex justify-between items-start gap-4 h-full">
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Icon className="w-4 h-4" style={{ color: GM_GOLD }} />
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold" style={{ color: GM_TEXT_SEC }}>
                {eyebrow}
              </p>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold leading-none tracking-normal mb-1 text-white font-sans">
              {props.xpTotal.toLocaleString()}{" "}
              <span className="text-sm font-sans font-bold text-[#C9A84C]/90">XP</span>
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] mb-4 text-[#4a90e2]">
              +{props.weeklyGain} esta semana
            </p>
          </div>
          <div className="border-t border-white/[0.04] pt-4 mt-auto">
            <p className="text-[13px] mb-1.5" style={{ color: GM_TEXT_SEC }}>
              Constancia:{" "}
              <span className="font-semibold text-[#C9A84C]">{props.consistencyStatus}</span>
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: "rgba(160,160,165,0.8)" }}>
              Faltan {props.exercisesUntilChest} ejercicios para abrir tu cofre semanal.
            </p>
          </div>
        </div>
        <div className="relative w-[76px] h-[76px] shrink-0 flex items-center justify-center mt-3">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
            }}
          />
          <span
            className="absolute inset-2 rounded-full animate-pulse"
            style={{
              border: "1.5px solid rgba(201,168,76,0.25)",
              background: "rgba(201,168,76,0.02)",
            }}
          />
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.15)]"
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%)",
              border: "1.5px solid rgba(201,168,76,0.4)",
            }}
          >
            <Activity className="w-5 h-5 text-[#C9A84C]" />
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
