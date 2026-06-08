import { ACTIVE_NODE_PANEL } from "../../data/gmusic-path-data";
import { MOCK_USER } from "../../data/mock-user";
import type { DashboardResponse } from "./types";

/** Fallback explícito de desarrollo — solo cuando VITE_USE_DASHBOARD_MOCK=true. */
export function getMockDashboardResponse(): DashboardResponse {
  return {
    user: {
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      timezone: "America/Santiago",
      levelLabel: MOCK_USER.levelLabel,
      pathLabel: MOCK_USER.pathLabel,
    },
    streak: {
      currentDays: MOCK_USER.streakDays,
      activeToday: true,
    },
    xp: {
      total: MOCK_USER.xp,
      earnedThisWeek: 180,
    },
    moduleProgress: {
      moduleId: "mock-module",
      moduleTitle: "Ritmo y rasgueo",
      percentCompleted: MOCK_USER.monthlyProgress,
      currentNodeTitle: MOCK_USER.currentNodeTitle,
      completedNodes: MOCK_USER.currentNode,
      totalNodes: MOCK_USER.totalNodesInMonth,
    },
    nextPractice: {
      nodeId: "mock-node",
      title: ACTIVE_NODE_PANEL.title,
      typeLabel: ACTIVE_NODE_PANEL.typeLabel,
      description: ACTIVE_NODE_PANEL.description,
    },
  };
}
