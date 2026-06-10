import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const probarPageSource = readFileSync(join(root, "ProbarPage.tsx"), "utf8");

describe("ProbarPage — navegación pública", () => {
  it("evita rutas legacy y redirige al home de planes", () => {
    assert.equal(probarPageSource.includes('setPage("dashboard")'), false);
    assert.equal(probarPageSource.includes('setPage("curriculum")'), false);
    assert.equal(probarPageSource.includes('setPage("lesson")'), false);
    assert.equal(
      probarPageSource.includes('navigateToHomeSection(setPage, "planes")'),
      true,
    );
  });
});
