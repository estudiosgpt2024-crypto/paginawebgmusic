export type RequestLoadOutcome<TViewModel> =
  | { type: "success"; viewModel: TViewModel }
  | { type: "error"; message: string }
  | { type: "aborted" };

export type RequestHookState<TViewModel> =
  | { status: "loading" }
  | { status: "success"; viewModel: TViewModel }
  | { status: "error"; message: string };

export type DashboardHookState = RequestHookState<
  import("../services/gmusic-api").DashboardViewModel
>;

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

export function outcomeToState<TViewModel>(
  outcome: RequestLoadOutcome<TViewModel>
): RequestHookState<TViewModel> | null {
  if (outcome.type === "aborted") return null;
  if (outcome.type === "error") return { status: "error", message: outcome.message };
  return { status: "success", viewModel: outcome.viewModel };
}

export function applyDashboardOutcome<TViewModel>(
  generation: number,
  manager: DashboardRequestManager,
  outcome: RequestLoadOutcome<TViewModel>
): RequestHookState<TViewModel> | null {
  if (!manager.isCurrent(generation)) return null;
  return outcomeToState(outcome);
}
