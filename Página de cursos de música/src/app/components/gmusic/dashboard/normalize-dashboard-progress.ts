/** Normaliza porcentaje de progreso del dashboard entre 0 y 100. */
export function normalizeDashboardProgressPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
