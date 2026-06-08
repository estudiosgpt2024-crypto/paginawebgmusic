import type { DashboardLoadOutcome } from "../services/gmusic-api/dashboard-load";
import type { DashboardViewModel } from "../services/gmusic-api";

export type DashboardHookState =
  | { status: "loading" }
  | { status: "success"; viewModel: DashboardViewModel }
  | { status: "error"; message: string };

export class DashboardRequestManager {
  private generation = 0;
  private abortController: AbortController | null = null;

  begin(): { generation: number; signal: AbortSignal } {
    this.abortController?.abort();
    this.abortController = new AbortController();
    const generation = ++this.generation;
    return { generation, signal: this.abortController.signal };
  }

  dispose(): void {
    this.abortController?.abort();
    this.generation += 1;
  }

  isCurrent(generation: number): boolean {
    return generation === this.generation;
  }
}

export function outcomeToState(outcome: DashboardLoadOutcome): DashboardHookState | null {
  if (outcome.type === "aborted") return null;
  if (outcome.type === "error") return { status: "error", message: outcome.message };
  return { status: "success", viewModel: outcome.viewModel };
}

export function applyDashboardOutcome(
  generation: number,
  manager: DashboardRequestManager,
  outcome: DashboardLoadOutcome
): DashboardHookState | null {
  if (!manager.isCurrent(generation)) return null;
  return outcomeToState(outcome);
}
