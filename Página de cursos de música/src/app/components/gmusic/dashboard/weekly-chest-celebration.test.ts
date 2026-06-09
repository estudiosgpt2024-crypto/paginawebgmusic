import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const dashboardRoot = dirname(fileURLToPath(import.meta.url));
const shellSource = readFileSync(join(dashboardRoot, "WeeklyChestCelebrationShell.tsx"), "utf8");
const indexCssSource = readFileSync(join(dashboardRoot, "../../../../styles/index.css"), "utf8");

describe("WeeklyChestCelebrationShell — Radix Dialog", () => {
  it("expone estado inmutable tipado con variantes del flujo", () => {
    assert.match(shellSource, /export type WeeklyChestCelebrationState/);
    assert.match(shellSource, /status: "idle"/);
    assert.match(shellSource, /status: "opening"/);
    assert.match(shellSource, /status: "reward-revealed"; readonly xpReward: number/);
    assert.match(shellSource, /status: "closing"/);
    assert.match(shellSource, /readonly status/);
  });

  it("usa Dialog del sistema y blindaje ARIA obligatorio", () => {
    assert.match(shellSource, /from "\.\.\/\.\.\/ui\/dialog"/);
    assert.match(shellSource, /<Dialog[\s\S]*open=\{isVisible\}/);
    assert.match(shellSource, /aria-labelledby="weekly-chest-title"/);
    assert.match(shellSource, /aria-describedby="weekly-chest-description"/);
    assert.match(shellSource, /id="weekly-chest-title"/);
    assert.match(shellSource, /id="weekly-chest-description"/);
    assert.match(shellSource, /DialogTitle/);
    assert.match(shellSource, /DialogDescription/);
  });

  it("integra Framer Motion en el contenido del diálogo", () => {
    assert.match(shellSource, /from "motion\/react"/);
    assert.match(shellSource, /<motion\./);
    assert.match(shellSource, /AnimatePresence/);
  });

  it("aplica overlay cinematográfico con fallback Safari y navegadores antiguos", () => {
    assert.match(indexCssSource, /weekly-chest-celebration-dialog/);
    assert.match(indexCssSource, /backdrop-filter:\s*blur\(var\(--dash-chest-overlay-blur\)\)/);
    assert.match(indexCssSource, /-webkit-backdrop-filter:\s*blur\(var\(--dash-chest-overlay-blur\)\)/);
    assert.match(indexCssSource, /@supports not[\s\S]*weekly-chest-celebration-dialog[\s\S]*--dash-chest-overlay-fallback/);
    assert.match(indexCssSource, /\.weekly-chest-celebration-dialog:focus-visible/);
  });
});
