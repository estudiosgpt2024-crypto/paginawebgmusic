import type { StartLessonSessionHookState } from "../../../hooks/useStartLessonSession";
import type { LessonSessionStartResult } from "../../../services/gmusic-api/types";

export interface PanelLessonSessionView {
  isStartingLesson: boolean;
  sessionError: string | null;
  sessionSuccess: LessonSessionStartResult | null;
  showRetry: boolean;
}

const EMPTY_PANEL_SESSION: PanelLessonSessionView = {
  isStartingLesson: false,
  sessionError: null,
  sessionSuccess: null,
  showRetry: false,
};

export function buildSessionSuccessKey(nodeId: string, requestGeneration: number): string {
  return `${nodeId}#${requestGeneration}`;
}

export function resolveSessionModalVisibility(
  matchingSuccessKey: string | null,
  dismissedSuccessKey: string | null
): boolean {
  return matchingSuccessKey != null && matchingSuccessKey !== dismissedSuccessKey;
}

export function resolveMatchingSuccessKey(
  lessonSession: StartLessonSessionHookState,
  panelNodeId: string | null | undefined
): string | null {
  if (
    panelNodeId == null ||
    lessonSession.status !== "success" ||
    lessonSession.nodeId !== panelNodeId
  ) {
    return null;
  }
  return buildSessionSuccessKey(lessonSession.nodeId, lessonSession.requestGeneration);
}

export function resolveLessonSessionForPanel(
  lessonSession: StartLessonSessionHookState,
  panelNodeId: string | null | undefined
): PanelLessonSessionView {
  if (!panelNodeId || lessonSession.status === "idle") {
    return EMPTY_PANEL_SESSION;
  }

  if (lessonSession.status === "loading") {
    if (lessonSession.nodeId !== panelNodeId) return EMPTY_PANEL_SESSION;
    return { ...EMPTY_PANEL_SESSION, isStartingLesson: true };
  }

  if (lessonSession.status === "error") {
    if (lessonSession.nodeId !== panelNodeId) return EMPTY_PANEL_SESSION;
    return {
      ...EMPTY_PANEL_SESSION,
      sessionError: lessonSession.message,
      showRetry: true,
    };
  }

  if (lessonSession.nodeId !== panelNodeId) return EMPTY_PANEL_SESSION;
  return {
    ...EMPTY_PANEL_SESSION,
    sessionSuccess: lessonSession.result,
  };
}
