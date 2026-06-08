import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const practiceCardSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "PracticeCard.tsx"),
  "utf8"
);

describe("PracticeCard", () => {
  it("loading queda deshabilitada y no permite continuar", () => {
    assert.match(practiceCardSource, /isLoading\?: boolean/);
    assert.match(practiceCardSource, /isLoading={isLoading}/);
    assert.match(practiceCardSource, /disabled={isLoading}/);
  });
});
