import posthog from "posthog-js";

const enabled = Boolean(import.meta.env?.VITE_POSTHOG_KEY);

export const analytics = {
  demoCtaClicked: () =>
    enabled && posthog.capture("demo_cta_clicked"),

  semestralCtaClicked: () =>
    enabled && posthog.capture("semestral_cta_clicked"),

  demoLessonCompleted: (lessonId: number, lessonTitle: string) =>
    enabled &&
    posthog.capture("demo_lesson_completed", {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
    }),

  demoCompleted: () =>
    enabled && posthog.capture("demo_completed"),

  gateViewed: (locked: boolean) =>
    enabled && posthog.capture("gate_viewed", { locked }),

  planSelected: (tier: string, period: string, priceCLP: number, planId: string) =>
    enabled &&
    posthog.capture("plan_selected", {
      tier,
      period,
      price_clp: priceCLP,
      plan_id: planId,
    }),

  registroViewed: (planId: string) =>
    enabled && posthog.capture("registro_viewed", { plan_id: planId }),

  whatsappCtaClicked: (intent: "inscripcion" | "dudas", planId: string) =>
    enabled &&
    posthog.capture("whatsapp_cta_clicked", { intent, plan_id: planId }),
};
