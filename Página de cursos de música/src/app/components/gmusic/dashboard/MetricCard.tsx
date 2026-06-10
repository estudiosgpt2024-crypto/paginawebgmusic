import type { LucideIcon } from "lucide-react";
import { Activity } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { normalizeDashboardProgressPercent } from "./normalize-dashboard-progress";
import { GM_GOLD, GM_TEXT_SEC } from "../tokens";

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
  exercisesUntilChest?: number;
  onChestClick?: () => void;
};

export type MetricCardProps = ProgressMetricCardProps | XpMetricCardProps;

export function MetricCard(props: MetricCardProps) {
  const { icon: Icon, eyebrow, className = "lg:col-span-4" } = props;

  if (props.variant === "progress") {
    const progressPercent = normalizeDashboardProgressPercent(props.progressPercent);
    const showLed = progressPercent > 0;

    return (
      <PremiumCard className={className} padding="32px 30px">
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
        <div className="dash-progress-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="dash-progress-fill" style={{ width: `${progressPercent}%`, maxWidth: "100%" }}>
            {showLed && <span className="dash-progress-led" aria-hidden="true" />}
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
    <PremiumCard className={className} padding="32px 30px">
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
            {props.onChestClick ? (
              <button
                type="button"
                onClick={props.onChestClick}
                className="mt-1 cursor-pointer rounded-lg border border-[rgba(201,168,76,0.28)] bg-[rgba(201,168,76,0.08)] px-3 py-2 text-[12px] font-semibold text-[#C9A84C] transition-colors hover:bg-[rgba(201,168,76,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]"
              >
                Abrir cofre 🎁
              </button>
            ) : (
              <p className="text-[12px] leading-relaxed" style={{ color: "rgba(160,160,165,0.8)" }}>
                {props.exercisesUntilChest != null
                  ? `Faltan ${props.exercisesUntilChest} ejercicios para abrir tu cofre semanal.`
                  : "Tu actividad semanal se refleja en el XP que acumulas."}
              </p>
            )}
          </div>
        </div>
        <div
          className="relative w-[76px] h-[76px] shrink-0 flex items-center justify-center mt-3 rounded-full"
          style={{
            background: "var(--dash-surface-2)",
            border: "1px solid var(--dash-border-accent)",
          }}
        >
          <Activity className="w-5 h-5 text-[#C9A84C]" />
        </div>
      </div>
    </PremiumCard>
  );
}
