import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StartLessonSessionHookState } from "../../../hooks/useStartLessonSession";
import type { LessonSessionStartResult } from "../../../services/gmusic-api/types";
import {
  buildSessionSuccessKey,
  resolveLessonSessionForPanel,
  resolveMatchingSuccessKey,
  resolveSessionModalVisibility,
} from "./path-lesson-panel-session";

const NODE_A = "node-a";
const NODE_B = "node-b";
const GEN_1 = 1;
const GEN_2 = 2;

const BASE_RESULT: LessonSessionStartResult = {
  kind: "created",
  session: {
    sessionId: "sess-1",
    nodeId: NODE_A,
    status: "STARTED",
    startedAt: "2026-06-08T15:00:00.000Z",
    expiresAt: "2026-06-08T18:00:00.000Z",
    exercises: [],
  },
};

function successState(
  nodeId: string,
  requestGeneration: number,
  result: LessonSessionStartResult = BASE_RESULT
): StartLessonSessionHookState {
  return { status: "success", nodeId, requestGeneration, result };
}

describe("resolveLessonSessionForPanel", () => {
  it("error de nodo A no aparece tras seleccionar nodo B", () => {
    const lessonSession: StartLessonSessionHookState = {
      status: "error",
      nodeId: NODE_A,
      requestGeneration: GEN_1,
      message: "Fallo en A",
    };

    const panelA = resolveLessonSessionForPanel(lessonSession, NODE_A);
    const panelB = resolveLessonSessionForPanel(lessonSession, NODE_B);

    assert.equal(panelA.sessionError, "Fallo en A");
    assert.equal(panelA.showRetry, true);
    assert.equal(panelB.sessionError, null);
    assert.equal(panelB.showRetry, false);
  });

  it("success de nodo A no afecta el panel de nodo B", () => {
    const lessonSession = successState(NODE_A, GEN_1);
    const panelB = resolveLessonSessionForPanel(lessonSession, NODE_B);

    assert.equal(panelB.sessionSuccess, null);
    assert.equal(resolveMatchingSuccessKey(lessonSession, NODE_B), null);
  });

  it("loading de A no deshabilita visualmente el botón de B", () => {
    const lessonSession: StartLessonSessionHookState = {
      status: "loading",
      nodeId: NODE_A,
      requestGeneration: GEN_1,
    };

    const panelA = resolveLessonSessionForPanel(lessonSession, NODE_A);
    const panelB = resolveLessonSessionForPanel(lessonSession, NODE_B);

    assert.equal(panelA.isStartingLesson, true);
    assert.equal(panelB.isStartingLesson, false);
  });

  it("idle no altera ningún panel", () => {
    const view = resolveLessonSessionForPanel({ status: "idle" }, NODE_A);
    assert.equal(view.isStartingLesson, false);
    assert.equal(view.sessionError, null);
    assert.equal(view.sessionSuccess, null);
  });
});

describe("coherencia retry por nodo", () => {
  it("retry visible solo en el nodo que originó el error", () => {
    const lessonSession: StartLessonSessionHookState = {
      status: "error",
      nodeId: NODE_A,
      requestGeneration: GEN_1,
      message: "No disponible",
    };

    assert.equal(resolveLessonSessionForPanel(lessonSession, NODE_A).showRetry, true);
    assert.equal(resolveLessonSessionForPanel(lessonSession, NODE_B).showRetry, false);
  });
});

describe("resolveSessionModalVisibility", () => {
  it("abre modal para un éxito nuevo del nodo seleccionado", () => {
    const key = buildSessionSuccessKey(NODE_A, GEN_1);
    const lessonSession = successState(NODE_A, GEN_1);

    assert.equal(resolveMatchingSuccessKey(lessonSession, NODE_A), key);
    assert.equal(resolveSessionModalVisibility(key, null), true);
  });

  it("cerrar modal no lo reabre en el siguiente render", () => {
    const key = buildSessionSuccessKey(NODE_A, GEN_1);

    assert.equal(resolveSessionModalVisibility(key, key), false);
  });

  it("cambiar A → B → A no reabre éxito antiguo ya descartado", () => {
    const lessonSession = successState(NODE_A, GEN_1);
    const keyA = resolveMatchingSuccessKey(lessonSession, NODE_A)!;

    let dismissed: string | null = null;
    let panelNodeId: string | null = NODE_A;

    assert.equal(resolveSessionModalVisibility(resolveMatchingSuccessKey(lessonSession, panelNodeId), dismissed), true);

    dismissed = keyA;
    assert.equal(resolveSessionModalVisibility(resolveMatchingSuccessKey(lessonSession, panelNodeId), dismissed), false);

    panelNodeId = NODE_B;
    assert.equal(resolveSessionModalVisibility(resolveMatchingSuccessKey(lessonSession, panelNodeId), dismissed), false);

    panelNodeId = NODE_A;
    assert.equal(resolveSessionModalVisibility(resolveMatchingSuccessKey(lessonSession, panelNodeId), dismissed), false);
  });

  it("nuevo éxito con otra generación sí abre modal", () => {
    const keyOld = buildSessionSuccessKey(NODE_A, GEN_1);
    const keyNew = buildSessionSuccessKey(NODE_A, GEN_2);
    const lessonSession = successState(NODE_A, GEN_2);

    assert.equal(resolveSessionModalVisibility(keyNew, keyOld), true);
    assert.equal(resolveMatchingSuccessKey(lessonSession, NODE_A), keyNew);
  });

  it("success de nodo distinto no abre modal en el panel actual", () => {
    const lessonSession = successState(NODE_A, GEN_1);

    assert.equal(resolveMatchingSuccessKey(lessonSession, NODE_B), null);
    assert.equal(resolveSessionModalVisibility(null, null), false);
  });
});

describe("simulación de renders consecutivos", () => {
  it("descartar y re-renderizar mantiene el modal cerrado", () => {
    const lessonSession = successState(NODE_A, GEN_1);
    const key = resolveMatchingSuccessKey(lessonSession, NODE_A)!;

    let dismissed: string | null = null;
    const render = () =>
      resolveSessionModalVisibility(resolveMatchingSuccessKey(lessonSession, NODE_A), dismissed);

    assert.equal(render(), true);
    dismissed = key;
    assert.equal(render(), false);
    assert.equal(render(), false);
  });
});
