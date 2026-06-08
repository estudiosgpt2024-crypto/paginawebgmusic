import { apiGet } from "./client";
import { getApiBaseUrl } from "./config";
import type { DashboardResponse } from "./types";

export async function fetchDashboard(options?: {
  signal?: AbortSignal;
}): Promise<DashboardResponse> {
  return apiGet<DashboardResponse>(`${getApiBaseUrl()}/me/dashboard`, options);
}
