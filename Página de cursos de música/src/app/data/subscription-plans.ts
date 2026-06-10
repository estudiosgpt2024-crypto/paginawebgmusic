export type PlanId = "monthly" | "semester" | "annual";
export type BillingInterval = "month" | "semester" | "year";

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  /** null = precio no definido todavía. Mostrar "Próximamente" en la UI. */
  price: null;
  currency: "CLP";
  interval: BillingInterval;
  intervalLabel: string;
  savingsLabel: string | null;
  description: string;
  highlighted: boolean;
  /** Placeholder para integración con Flow. Sustituir por ID real al activar pagos. */
  flowPlanId: string;
}

export const SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Mensual",
    price: null,
    currency: "CLP",
    interval: "month",
    intervalLabel: "por mes",
    savingsLabel: null,
    description: "Acceso completo mes a mes. Cancela cuando quieras.",
    highlighted: false,
    flowPlanId: "GMUSIC_MONTHLY_V1",
  },
  {
    id: "semester",
    name: "Semestral",
    price: null,
    currency: "CLP",
    interval: "semester",
    intervalLabel: "por 6 meses",
    savingsLabel: "Más elegido",
    description: "Compromiso de 6 meses con acceso total a todos los mundos.",
    highlighted: true,
    flowPlanId: "GMUSIC_SEMESTER_V1",
  },
  {
    id: "annual",
    name: "Anual",
    price: null,
    currency: "CLP",
    interval: "year",
    intervalLabel: "por año",
    savingsLabel: "Mayor ahorro",
    description: "Un año completo para dominar la guitarra desde cero.",
    highlighted: false,
    flowPlanId: "GMUSIC_ANNUAL_V1",
  },
] as const;

export function getPlanById(id: PlanId): SubscriptionPlan {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}
