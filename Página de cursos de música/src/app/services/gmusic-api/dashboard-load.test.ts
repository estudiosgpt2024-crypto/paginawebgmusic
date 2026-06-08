import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadDashboardOnce } from "./dashboard-load";
import type { DashboardResponse } from "./types";
import { mapDashboardToViewModel } from "./map-dashboard";
import { GmusicApiError } from "./client";

const BASE_RESPONSE: DashboardResponse = {
  user: {
    id: "u1",
    name: "Carlos",
    timezone: "America/Santiago",
    levelLabel: "Fundamento",
    pathLabel: "Mes 1 · Nodo 1 de 3",
  },
  streak: { currentDays: 2, activeToday: true },
  xp: { total: 100, earnedThisWeek: 20 },
  moduleProgress: {
    moduleId: "m1",
    moduleTitle: "Fundamentos",
    percentCompleted: 10,
    currentNodeTitle: "Nodo A",
    completedNodes: 0,
    totalNodes: 3,
  },
  nextPractice: {
    nodeId: "n1",
    title: "Práctica",
    typeLabel: "Guiada",
    description: "Desc",
  },
};

describe("loadDashboardOnce", () => {
  it("solicitud abortada no produce error visual", async () => {
    const controller = new AbortController();
    controller.abort();

    const outcome = await loadDashboardOnce(controller.signal, {
      fetchDashboard: async () => BASE_RESPONSE,
      isDashboardMockEnabled: () => false,
      getMockDashboardResponse: () => BASE_RESPONSE,
      mapDashboardToViewModel,
    });

    assert.equal(outcome.type, "aborted");
  });

  it("retry exitoso reemplaza estado error", async () => {
    let attempts = 0;
    const fetchDashboard = async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new GmusicApiError("Servicio no disponible", 503, "INTERNAL_ERROR");
      }
      return BASE_RESPONSE;
    };

    const first = await loadDashboardOnce(new AbortController().signal, {
      fetchDashboard,
      isDashboardMockEnabled: () => false,
      getMockDashboardResponse: () => BASE_RESPONSE,
      mapDashboardToViewModel,
    });
    assert.equal(first.type, "error");

    const second = await loadDashboardOnce(new AbortController().signal, {
      fetchDashboard,
      isDashboardMockEnabled: () => false,
      getMockDashboardResponse: () => BASE_RESPONSE,
      mapDashboardToViewModel,
    });
    assert.equal(second.type, "success");
    if (second.type === "success") {
      assert.equal(second.viewModel.userName, "Carlos");
    }
  });
});

describe("respuestas obsoletas", () => {
  it("respuesta antigua no sobrescribe retry exitoso", async () => {
    const manager = await import("../../hooks/dashboard-request").then(
      (m) => new m.DashboardRequestManager()
    );

    let resolveSlow!: (value: DashboardResponse) => void;
    let callCount = 0;

    const fetchDashboard = async ({ signal }: { signal?: AbortSignal }) => {
      callCount += 1;
      if (callCount === 1) {
        return new Promise<DashboardResponse>((resolve, reject) => {
          signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
          resolveSlow = resolve;
        });
      }
      return BASE_RESPONSE;
    };

    const deps = {
      fetchDashboard,
      isDashboardMockEnabled: () => false,
      getMockDashboardResponse: () => BASE_RESPONSE,
      mapDashboardToViewModel,
    };

    const { generation: slowGeneration, signal: slowSignal } = manager.begin();
    const slowPromise = loadDashboardOnce(slowSignal, deps);

    const { generation: fastGeneration, signal: fastSignal } = manager.begin();
    const fastOutcome = await loadDashboardOnce(fastSignal, deps);

    assert.equal(fastOutcome.type, "success");
    assert.equal(manager.isCurrent(fastGeneration), true);
    assert.equal(manager.isCurrent(slowGeneration), false);

    resolveSlow(BASE_RESPONSE);
    const slowOutcome = await slowPromise;
    assert.equal(slowOutcome.type, "aborted");

    const appliedFast = manager.isCurrent(fastGeneration)
      ? fastOutcome.type === "success"
        ? { status: "success" as const, viewModel: fastOutcome.viewModel }
        : null
      : null;

    assert.notEqual(appliedFast, null);
    assert.equal(appliedFast?.viewModel.userName, "Carlos");
  });
});
