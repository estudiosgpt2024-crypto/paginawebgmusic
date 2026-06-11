// src/app/data/subscription-plans.ts

export type PlanTier = "basico" | "plus" | "familiar";
export type BillingPeriod = "monthly" | "semester" | "annual";
export type PlanId = `${PlanTier}-${BillingPeriod}`;

export interface PlanTierDef {
  id: PlanTier;
  name: string;
  highlighted: boolean;
  badge: string | null;
  profiles: number;
  features: readonly string[];
  flowPlanIds: Readonly<Record<BillingPeriod, string>>;
}

export interface BillingPeriodDef {
  id: BillingPeriod;
  label: string;
  intervalLabel: string;
  savingsLabel: string | null;
}

export interface PlanPrice {
  /** Precio total cobrado en el período (lo que aparece en Flow). */
  totalPrice: number;
  /** Equivalente mensual para mostrar en UI. */
  pricePerMonth: number;
  currency: "CLP";
}

export const BILLING_PERIODS: readonly BillingPeriodDef[] = [
  {
    id: "monthly",
    label: "Mensual",
    intervalLabel: "por mes",
    savingsLabel: null,
  },
  {
    id: "semester",
    label: "Semestral",
    intervalLabel: "cada 6 meses",
    savingsLabel: "Ahorra 17%",
  },
  {
    id: "annual",
    label: "Anual",
    intervalLabel: "por año",
    savingsLabel: "Ahorra 25%",
  },
] as const;

export const PLAN_TIERS: readonly PlanTierDef[] = [
  {
    id: "basico",
    name: "Gmusic Básico",
    highlighted: false,
    badge: null,
    profiles: 1,
    features: [
      "1 perfil",
      "Ruta inicial de guitarra",
      "Clases guiadas",
      "Progreso y recompensas",
      "Acceso a fundamentos principales",
    ],
    flowPlanIds: {
      monthly: "GMUSIC_BASICO_MONTHLY_V1",
      semester: "GMUSIC_BASICO_SEMESTER_V1",
      annual: "GMUSIC_BASICO_ANNUAL_V1",
    },
  },
  {
    id: "plus",
    name: "Gmusic Plus",
    highlighted: true,
    badge: "Recomendado",
    profiles: 1,
    features: [
      "1 perfil",
      "Ruta completa de aprendizaje",
      "Fundamento → Técnica → Crea",
      "Ejercicios y retos prácticos",
      "Progreso, XP y racha",
      "Acceso prioritario a nuevos módulos",
    ],
    flowPlanIds: {
      monthly: "GMUSIC_PLUS_MONTHLY_V1",
      semester: "GMUSIC_PLUS_SEMESTER_V1",
      annual: "GMUSIC_PLUS_ANNUAL_V1",
    },
  },
  {
    id: "familiar",
    name: "Gmusic Familiar",
    highlighted: false,
    badge: null,
    profiles: 3,
    features: [
      "Hasta 3 perfiles",
      "Ideal para hermanos, padres e hijos",
      "Progreso separado por estudiante",
      "Ruta completa para cada perfil",
      "Mejor valor para aprender en casa",
    ],
    flowPlanIds: {
      monthly: "GMUSIC_FAMILIAR_MONTHLY_V1",
      semester: "GMUSIC_FAMILIAR_SEMESTER_V1",
      annual: "GMUSIC_FAMILIAR_ANNUAL_V1",
    },
  },
] as const;

export const PRICE_TABLE: Readonly<Record<PlanTier, Readonly<Record<BillingPeriod, PlanPrice>>>> = {
  basico: {
    monthly: { totalPrice: 6_990, pricePerMonth: 6_990, currency: "CLP" },
    semester: { totalPrice: 34_990, pricePerMonth: 5_832, currency: "CLP" },
    annual: { totalPrice: 59_990, pricePerMonth: 4_999, currency: "CLP" },
  },
  plus: {
    monthly: { totalPrice: 9_990, pricePerMonth: 9_990, currency: "CLP" },
    semester: { totalPrice: 49_990, pricePerMonth: 8_332, currency: "CLP" },
    annual: { totalPrice: 89_990, pricePerMonth: 7_499, currency: "CLP" },
  },
  familiar: {
    monthly: { totalPrice: 13_990, pricePerMonth: 13_990, currency: "CLP" },
    semester: { totalPrice: 69_990, pricePerMonth: 11_665, currency: "CLP" },
    annual: { totalPrice: 119_990, pricePerMonth: 9_999, currency: "CLP" },
  },
} as const;

export const VALID_PLAN_IDS: readonly PlanId[] = [
  "basico-monthly",
  "basico-semester",
  "basico-annual",
  "plus-monthly",
  "plus-semester",
  "plus-annual",
  "familiar-monthly",
  "familiar-semester",
  "familiar-annual",
];

export function getPlanTier(tier: PlanTier): PlanTierDef {
  const t = PLAN_TIERS.find((p) => p.id === tier);
  if (!t) throw new Error(`Unknown plan tier: ${tier}`);
  return t;
}

export function getBillingPeriod(period: BillingPeriod): BillingPeriodDef {
  const p = BILLING_PERIODS.find((b) => b.id === period);
  if (!p) throw new Error(`Unknown billing period: ${period}`);
  return p;
}

export function getPlanPrice(tier: PlanTier, period: BillingPeriod): PlanPrice {
  return PRICE_TABLE[tier][period];
}

export function parsePlanId(planId: PlanId): { tier: PlanTier; period: BillingPeriod } {
  const lastDash = planId.lastIndexOf("-");
  return {
    tier: planId.slice(0, lastDash) as PlanTier,
    period: planId.slice(lastDash + 1) as BillingPeriod,
  };
}

export function isValidPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (VALID_PLAN_IDS as readonly string[]).includes(value);
}

/** Helper de formato CLP para UI. Ejemplo: 9990 → "CLP 9.990" */
export function formatCLP(amount: number): string {
  return `CLP ${amount.toLocaleString("es-CL")}`;
}
