import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  canAdvanceFreeFundamentoLesson,
  nextFreeFundamentoLessonPhase,
} from "../../utils/free-fundamento-lesson";
import {
  navigateToHomeSection,
  scrollToHomeSection,
} from "../../utils/public-home-navigation";

const root = dirname(fileURLToPath(import.meta.url));
const selectorSource = readFileSync(join(root, "InteractiveLevelSelector.tsx"), "utf8");
const heroSource = readFileSync(join(root, "../marketing/sections/HeroSection.tsx"), "utf8");
const planesSource = readFileSync(join(root, "../marketing/sections/PlanesSection.tsx"), "utf8");
const academiaSource = readFileSync(join(root, "../marketing/sections/AcademiaSection.tsx"), "utf8");
const appSource = readFileSync(join(root, "../../App.tsx"), "utf8");
const previewSource = readFileSync(join(root, "../../pages/FundamentoPreviewPage.tsx"), "utf8");
const lessonSource = readFileSync(join(root, "../../pages/FreeFundamentoLessonPage.tsx"), "utf8");

const LEGACY_PUBLIC_TARGETS = ["probar", "dashboard", "curriculum", "lesson"] as const;

function assertNoLegacyNavigation(source: string, componentName: string) {
  for (const target of LEGACY_PUBLIC_TARGETS) {
    assert.equal(
      source.includes(`setPage("${target}")`),
      false,
      `${componentName} no debe navegar a ${target}`
    );
  }
}

describe("HeroSection — funnel público A2", () => {
  it("Ver clase gratuita navega a fundamento-preview", () => {
    assert.equal(heroSource.includes("Ver clase gratuita"), true);
    assert.equal(heroSource.includes('setPage("fundamento-preview")'), true);
  });

  it("no usa Probar gratis ni setPage probar", () => {
    assert.equal(heroSource.includes("Probar gratis"), false);
    assert.equal(heroSource.includes('setPage("probar")'), false);
    assertNoLegacyNavigation(heroSource, "HeroSection");
  });
});

describe("PlanesSection — funnel público A2", () => {
  it("Ver clase gratuita navega a fundamento-preview", () => {
    assert.equal(planesSource.includes("Ver clase gratuita"), true);
    assert.equal(planesSource.includes('setPage("fundamento-preview")'), true);
  });

  it("no usa Probar gratis ni setPage probar", () => {
    assert.equal(planesSource.includes("Probar gratis"), false);
    assert.equal(planesSource.includes('setPage("probar")'), false);
    assertNoLegacyNavigation(planesSource, "PlanesSection");
  });
});

describe("AcademiaSection — copy y aislamiento legacy", () => {
  it("no habla de elegir instrumento", () => {
    assert.equal(academiaSource.includes("instrumento"), false);
    assert.equal(academiaSource.includes("punto de partida dentro de la academia"), true);
  });

  it("no navega a páginas legacy", () => {
    assertNoLegacyNavigation(academiaSource, "AcademiaSection");
  });
});

describe("InteractiveLevelSelector — labels pedagógicos", () => {
  it("expone niveles superiores Básico, Intermedio y Avanzado", () => {
    assert.equal(selectorSource.includes("Nivel 1 · Básico"), true);
    assert.equal(selectorSource.includes("Nivel 2 · Intermedio"), true);
    assert.equal(selectorSource.includes("Nivel 3 · Avanzado"), true);
  });

  it("conserva nombres pedagógicos inferiores", () => {
    assert.equal(selectorSource.includes('title: "Fundamento"'), true);
    assert.equal(selectorSource.includes('title: "Técnica"'), true);
    assert.equal(selectorSource.includes('title: "Crea"'), true);
  });

  it("usa descripciones pedagógicas actualizadas", () => {
    assert.equal(
      selectorSource.includes("Postura, primeras notas y primeros acordes."),
      true
    );
    assert.equal(
      selectorSource.includes("Escalas, rasgueos, precisión, control y fluidez."),
      true
    );
    assert.equal(
      selectorSource.includes("Canciones, composición y expresión propia."),
      true
    );
  });

  it("no navega a páginas legacy", () => {
    assertNoLegacyNavigation(selectorSource, "InteractiveLevelSelector");
  });
});

describe("InteractiveLevelSelector — funnel Fundamento", () => {
  it("Fundamento abre fundamento-preview", () => {
    assert.equal(selectorSource.includes('setPage("fundamento-preview")'), true);
    assert.equal(selectorSource.includes("Ver clase gratuita"), true);
    assert.equal(selectorSource.includes('setPage("curriculum")'), false);
  });

  it("Técnica y Crea permanecen bloqueados como Próximamente", () => {
    assert.equal(selectorSource.includes("comingSoon: true"), true);
    assert.match(selectorSource, /id:\s*"tecnica"[\s\S]*comingSoon:\s*true/);
    assert.match(selectorSource, /id:\s*"crea"[\s\S]*comingSoon:\s*true/);
    assert.equal(selectorSource.includes("Próximamente"), true);
    assert.equal(selectorSource.includes('aria-disabled="true"'), true);
  });
});

describe("FundamentoPreviewPage", () => {
  it("abre la clase gratuita desde el CTA principal", () => {
    assert.equal(previewSource.includes('setPage("fundamento-free-lesson")'), true);
    assert.equal(previewSource.includes("Comenzar clase gratuita"), true);
    assert.equal(previewSource.includes("Tu guitarra y postura"), true);
    assert.equal(previewSource.includes("Fundamento"), true);
  });

  it("vuelve a Academia mediante home + #academia", () => {
    assert.equal(previewSource.includes('navigateToHomeSection(setPage, "academia")'), true);
    assert.equal(previewSource.includes("Volver a Academia"), true);
  });

  it("no usa radial-gradient decorativo ni letterSpacing negativo en títulos", () => {
    assert.equal(previewSource.includes("radial-gradient"), false);
    assert.equal(previewSource.includes("letterSpacing: \"-"), false);
    assert.equal(previewSource.includes("letterSpacing: 0"), true);
  });
});

describe("canAdvanceFreeFundamentoLesson", () => {
  it("rechaza null, vacío e IDs desconocidos", () => {
    assert.equal(canAdvanceFreeFundamentoLesson(null), false);
    assert.equal(canAdvanceFreeFundamentoLesson(""), false);
    assert.equal(canAdvanceFreeFundamentoLesson("unknown"), false);
    assert.equal(canAdvanceFreeFundamentoLesson("headstock-extra"), false);
  });

  it("acepta únicamente IDs presentes en FREE_FUNDAMENTO_LESSON_OPTIONS", () => {
    assert.equal(canAdvanceFreeFundamentoLesson("body"), true);
    assert.equal(canAdvanceFreeFundamentoLesson("neck"), true);
    assert.equal(canAdvanceFreeFundamentoLesson("headstock"), true);
  });
});

describe("FreeFundamentoLessonPage", () => {
  it("requiere selección válida antes de continuar", () => {
    assert.equal(lessonSource.includes('type="radio"'), true);
    assert.equal(lessonSource.includes("disabled={!canContinue}"), true);
    assert.equal(lessonSource.includes("canAdvanceFreeFundamentoLesson"), true);
  });

  it("incluye imagen educativa de guitarra con alt descriptivo", () => {
    assert.equal(lessonSource.includes("FREE_FUNDAMENTO_GUITAR_IMAGE_URL"), true);
    assert.equal(lessonSource.includes("FREE_FUNDAMENTO_GUITAR_IMAGE_ALT"), true);
    assert.equal(lessonSource.includes('width={720}'), true);
    assert.equal(lessonSource.includes('height={405}'), true);
    assert.equal(lessonSource.includes("aspectRatio"), true);
  });

  it("ofrece Volver a Academia durante y después de la clase", () => {
    const matches = lessonSource.match(/Volver a Academia/g) ?? [];
    assert.equal(matches.length, 2);
    assert.equal(lessonSource.includes('navigateToHomeSection(setPage, "academia")'), true);
  });

  it("no califica ni muestra respuestas correctas", () => {
    assert.equal(lessonSource.includes("correct"), false);
    assert.equal(lessonSource.includes("LessonRunnerShell"), false);
    assert.equal(lessonSource.includes("useLessonRunner"), false);
  });

  it("no muestra XP, racha ni semana completada", () => {
    assert.equal(lessonSource.includes("XP"), false);
    assert.equal(lessonSource.includes("racha"), false);
    assert.equal(lessonSource.includes("Semana completada"), false);
    assert.equal(lessonSource.includes("CofreVirtual"), false);
  });

  it("no usa letterSpacing negativo en títulos", () => {
    assert.equal(lessonSource.includes("letterSpacing: \"-"), false);
    assert.equal(lessonSource.includes("letterSpacing: 0"), true);
  });

  it("muestra CTA de planes al completar", () => {
    assert.equal(
      nextFreeFundamentoLessonPhase("lesson"),
      "complete"
    );
    assert.equal(lessonSource.includes("Completaste tu primera clase gratuita"), true);
    assert.equal(lessonSource.includes("Conocer los planes"), true);
    assert.equal(lessonSource.includes('navigateToHomeSection(setPage, "planes")'), true);
  });
});

describe("App — rutas públicas del funnel", () => {
  it("registra fundamento-preview y fundamento-free-lesson sin DEV_LEGACY", () => {
    assert.equal(appSource.includes('currentPage === "fundamento-preview"'), true);
    assert.equal(appSource.includes('currentPage === "fundamento-free-lesson"'), true);
    assert.equal(
      /fundamento-preview[\s\S]*FundamentoPreviewPage/.test(appSource),
      true
    );
    assert.equal(
      /fundamento-free-lesson[\s\S]*FreeFundamentoLessonPage/.test(appSource),
      true
    );
    assert.equal(
      appSource.includes("DEV_LEGACY && currentPage === \"fundamento"),
      false
    );
  });

  it("no importa LessonRunnerShell ni páginas legacy del funnel", () => {
    assert.equal(previewSource.includes("LessonRunnerShell"), false);
    assert.equal(lessonSource.includes("LessonRunnerShell"), false);
    assert.equal(previewSource.includes("MOCK_USER"), false);
    assert.equal(lessonSource.includes("MOCK_USER"), false);
    assert.equal(previewSource.includes("CurriculumPage"), false);
    assert.equal(lessonSource.includes("PaywallModal"), false);
    assert.equal(lessonSource.includes("AuthModal"), false);
  });
});

describe("navigateToHomeSection", () => {
  it("navega a home y desplaza a la sección academia", () => {
    let nextPage = "fundamento-preview";
    let scrolledTo: string | null = null;

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        pageYOffset: 0,
        scrollTo() {},
        setTimeout(fn: () => void) {
          fn();
          return 0;
        },
      },
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        getElementById(id: string) {
          scrolledTo = id;
          return {
            getBoundingClientRect() {
              return { top: 200 };
            },
          };
        },
      },
    });

    try {
      navigateToHomeSection((page) => {
        nextPage = page;
      }, "academia", 0);
    } finally {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: previousWindow,
      });
      Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: previousDocument,
      });
    }

    assert.equal(nextPage, "home");
    assert.equal(scrolledTo, "academia");
  });

  it("desplaza a la sección planes", () => {
    let scrolledTo: string | null = null;

    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        pageYOffset: 0,
        scrollTo() {},
      },
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        getElementById(id: string) {
          scrolledTo = id;
          return {
            getBoundingClientRect() {
              return { top: 400 };
            },
          };
        },
      },
    });

    try {
      scrollToHomeSection("planes");
    } finally {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: previousWindow,
      });
      Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: previousDocument,
      });
    }

    assert.equal(scrolledTo, "planes");
  });
});
