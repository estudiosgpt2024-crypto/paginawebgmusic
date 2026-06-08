import type { DashboardResponse } from "./types";

export interface DashboardPracticeView {
  title: string;
  typeLabel: string;
  description: string;
}

export interface DashboardViewModel {
  userName: string;
  streakLabel: string;
  xpTotal: number;
  weeklyGain: number;
  consistencyStatus: string;
  progressPercentLabel: string;
  progressPercent: number;
  currentNodeTitle: string;
  phaseLabel: string;
  nextPractice: DashboardPracticeView | null;
  pathComplete: boolean;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function nonNegative(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

export function derivePhaseLabel(levelLabel: string, pathLabel: string): string {
  const monthMatch = pathLabel.match(/Mes (\d+)/);
  const month = monthMatch?.[1] ?? "1";
  return `${levelLabel} · Mes ${month}`;
}

export function mapDashboardToViewModel(response: DashboardResponse): DashboardViewModel {
  const progressPercent = clampPercent(response.moduleProgress.percentCompleted);
  const streakDays = nonNegative(response.streak.currentDays);
  const xpTotal = nonNegative(response.xp.total);
  const weeklyGain = nonNegative(response.xp.earnedThisWeek);

  return {
    userName: response.user.name,
    streakLabel: `${streakDays} días`,
    xpTotal,
    weeklyGain,
    consistencyStatus: response.streak.activeToday ? "En ritmo" : "Retoma hoy",
    progressPercentLabel: `${progressPercent}%`,
    progressPercent,
    currentNodeTitle: response.moduleProgress.currentNodeTitle,
    phaseLabel: derivePhaseLabel(response.user.levelLabel, response.user.pathLabel),
    nextPractice: response.nextPractice
      ? {
          title: response.nextPractice.title,
          typeLabel: response.nextPractice.typeLabel,
          description: response.nextPractice.description,
        }
      : null,
    pathComplete: response.nextPractice === null,
  };
}
