import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { normalizeDashboardProgressPercent } from "./normalize-dashboard-progress";

const dashboardRoot = dirname(fileURLToPath(import.meta.url));
const metricCardSource = readFileSync(join(dashboardRoot, "MetricCard.tsx"), "utf8");
const lockedCardSource = readFileSync(join(dashboardRoot, "LockedFeatureCard.tsx"), "utf8");
const tokensCssSource = readFileSync(
  join(dashboardRoot, "../../../../../design-system/tokens.css"),
  "utf8"
);
const indexCssSource = readFileSync(join(dashboardRoot, "../../../../styles/index.css"), "utf8");

describe("normalizeDashboardProgressPercent", () => {
  it("clamp entre 0 y 100 y rechaza valores no finitos", () => {
    assert.equal(normalizeDashboardProgressPercent(-12), 0);
    assert.equal(normalizeDashboardProgressPercent(140), 100);
    assert.equal(normalizeDashboardProgressPercent(Number.NaN), 0);
    assert.equal(normalizeDashboardProgressPercent(Number.POSITIVE_INFINITY), 0);
    assert.equal(normalizeDashboardProgressPercent(42.7), 42.7);
  });
});

describe("MetricCard — LED de progreso", () => {
  it("usa track nativo con clip y LED condicional", () => {
    assert.match(metricCardSource, /dash-progress-track/);
    assert.match(metricCardSource, /dash-progress-fill/);
    assert.match(metricCardSource, /dash-progress-led/);
    assert.match(metricCardSource, /normalizeDashboardProgressPercent/);
    assert.match(metricCardSource, /showLed &&/);
  });

  it("expone tokens de progreso con glow drop-shadow en CSS", () => {
    assert.match(tokensCssSource, /--dash-progress-led-color:\s*#38bdf8/);
    assert.match(tokensCssSource, /--dash-progress-led-glow:[\s\S]*drop-shadow/);
    assert.match(indexCssSource, /\.dash-progress-track[\s\S]*overflow:\s*hidden/);
    assert.match(indexCssSource, /\.dash-progress-track[\s\S]*border-radius:\s*999px/);
    const ledBlock = indexCssSource.match(/\.dash-progress-led\s*\{[^}]+\}/)?.[0] ?? "";
    assert.notEqual(ledBlock, "");
    assert.match(ledBlock, /filter:\s*var\(--dash-progress-led-glow\)/);
    assert.match(ledBlock, /will-change:\s*transform,\s*opacity/);
    assert.doesNotMatch(ledBlock, /box-shadow/);
  });
});

describe("LockedFeatureCard — contraste WCAG AA", () => {
  it("usa tokens locked sin opacity global ni pointer-events none", () => {
    assert.match(lockedCardSource, /dash-locked-card/);
    assert.match(tokensCssSource, /--dash-surface-locked:\s*#0d0d0d/);
    assert.match(tokensCssSource, /--dash-locked-text:\s*#7a7a7a/);
    assert.match(tokensCssSource, /--dash-locked-text-muted:\s*#555555/);
    assert.doesNotMatch(lockedCardSource, /pointer-events:\s*none/);
    assert.doesNotMatch(lockedCardSource, /opacity:\s*0\.6/);
  });

  it("candado Lucide hereda currentColor con strokeWidth 1.5", () => {
    assert.match(lockedCardSource, /strokeWidth=\{1\.5\}/);
    assert.match(lockedCardSource, /dash-locked-card__lock/);
    assert.match(indexCssSource, /\.dash-locked-card__lock[\s\S]*color:\s*var\(--dash-locked-text-muted\)/);
  });
});
