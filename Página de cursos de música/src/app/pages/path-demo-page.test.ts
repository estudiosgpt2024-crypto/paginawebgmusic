import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildDemoModules, DEMO_PATH_NODE_ID } from "./PathDemoPage";
import { PATH_MODULES } from "../data/gmusic-path-data";

const root = dirname(fileURLToPath(import.meta.url));
const appSource = readFileSync(join(root, "../App.tsx"), "utf8");
const demoPageSource = readFileSync(join(root, "./PathDemoPage.tsx"), "utf8");
const selectorSource = readFileSync(
  join(root, "../components/music/InteractiveLevelSelector.tsx"),
  "utf8"
);

describe("PathDemoPage — camino demo público", () => {
  it("buildDemoModules deja solo el primer nodo activo como demo-n1", () => {
    const modules = buildDemoModules(PATH_MODULES);
    const allNodes = modules.flatMap((mod) => mod.nodes);
    const demoNode = allNodes.find((node) => node.id === DEMO_PATH_NODE_ID);

    assert.equal(demoNode?.status, "active");
    assert.equal(demoNode?.title, "Tu guitarra y postura");
    assert.equal(allNodes.filter((node) => node.status === "active").length, 1);
    assert.equal(allNodes.filter((node) => node.status === "locked").length, allNodes.length - 1);
  });

  it("App monta PathDemoPage en mi-camino-demo sin StudentZoneGuard", () => {
    assert.equal(appSource.includes('currentPage === "mi-camino-demo"'), true);
    assert.equal(appSource.includes("<PathDemoPage setPage={handlePageChange} />"), true);
    assert.doesNotMatch(
      appSource,
      /currentPage === "mi-camino-demo"[\s\S]{0,180}StudentZoneGuard/
    );
  });

  it("InteractiveLevelSelector navega al camino demo", () => {
    assert.equal(selectorSource.includes('setPage("mi-camino-demo")'), true);
  });

  it("PathDemoPage conecta la clase gratuita y CTA de planes", () => {
    assert.equal(demoPageSource.includes("allowLockedSelection"), true);
    assert.equal(demoPageSource.includes('navigateToHomeSection(setPage, "planes")'), true);
    assert.equal(demoPageSource.includes("setPage(PUBLIC_FREE_LESSON_PAGE)"), true);
    assert.equal(demoPageSource.includes("LockedDemoNodePanel"), true);
  });
});
