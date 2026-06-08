import { fetchDashboard } from "./dashboard";
import { GmusicApiError, isAbortError } from "./client";
import { isDashboardMockEnabled } from "./config";
import { getMockDashboardResponse } from "./mock-dashboard";
import { mapDashboardToViewModel, type DashboardViewModel } from "./map-dashboard";
import type { DashboardResponse } from "./types";

export type DashboardLoadOutcome =
  | { type: "success"; viewModel: DashboardViewModel }
  | { type: "error"; message: string }
  | { type: "aborted" };

export interface DashboardLoadDeps {
  fetchDashboard: (options?: { signal?: AbortSignal }) => Promise<DashboardResponse>;
  isDashboardMockEnabled: () => boolean;
  getMockDashboardResponse: () => DashboardResponse;
  mapDashboardToViewModel: typeof mapDashboardToViewModel;
}

const defaultDeps: DashboardLoadDeps = {
  fetchDashboard,
  isDashboardMockEnabled,
  getMockDashboardResponse,
  mapDashboardToViewModel,
};

export async function loadDashboardOnce(
  signal: AbortSignal,
  deps: DashboardLoadDeps = defaultDeps
): Promise<DashboardLoadOutcome> {
  if (deps.isDashboardMockEnabled()) {
    if (signal.aborted) return { type: "aborted" };
    return {
      type: "success",
      viewModel: deps.mapDashboardToViewModel(deps.getMockDashboardResponse()),
    };
  }

  try {
    const response = await deps.fetchDashboard({ signal });
    if (signal.aborted) return { type: "aborted" };
    return {
      type: "success",
      viewModel: deps.mapDashboardToViewModel(response),
    };
  } catch (error) {
    if (isAbortError(error) || signal.aborted) return { type: "aborted" };
    const message =
      error instanceof GmusicApiError
        ? error.message
        : "No pudimos cargar tu estudio. Comprueba la conexión e inténtalo de nuevo.";
    return { type: "error", message };
  }
}
