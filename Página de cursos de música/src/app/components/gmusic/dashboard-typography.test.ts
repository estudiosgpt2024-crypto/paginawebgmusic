import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const dashboardDir = join(root, "dashboard");
const welcomePage = join(root, "../../pages/GmusicWelcome.tsx");

const NEGATIVE_LETTER_SPACING = /letter-spacing:\s*-[\d.]+|tracking-\[-[\d.]+(?:px|em|rem|%)?\]/;

function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (/\.(tsx|ts|css)$/.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("dashboard typography — regla de oro", () => {
  it("no introduce letter-spacing negativo en el entorno del dashboard", () => {
    const sources = [...collectSourceFiles(dashboardDir), welcomePage];

    for (const filePath of sources) {
      const source = readFileSync(filePath, "utf8");
      assert.equal(
        NEGATIVE_LETTER_SPACING.test(source),
        false,
        `letter-spacing negativo detectado en ${filePath}`
      );
    }
  });
});
