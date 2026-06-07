import { Guitar } from "lucide-react";
import { GM_TEXT, GM_TEXT_SEC, GM_GOLD, GM_GOLD_MATT, GM_BORDER } from "../tokens";
import { PATH_BADGE, countPathProgress, PATH_MODULES } from "../../../data/gmusic-path-data";

export function PathPageIntro() {
  const { completed, total } = countPathProgress(PATH_MODULES);

  return (
    <div className="mb-6 lg:mb-10">
      <p
        className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
        style={{ color: "rgba(212, 175, 55, 0.55)" }}
      >
        Ruta de guitarra · {PATH_BADGE.level}
      </p>
      <h1
        className="text-2xl md:text-4xl font-semibold mb-2 tracking-tight"
        style={{ color: GM_TEXT, fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Mi Camino
      </h1>
      <p className="text-base md:text-lg mb-5 max-w-xl leading-relaxed" style={{ color: GM_TEXT_SEC }}>
        Tu ruta de guitarra, paso a paso. Cada módulo construye técnica, oído y continuidad en la práctica.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs border"
          style={{
            borderColor: GM_BORDER,
            color: GM_TEXT_SEC,
            background: "rgba(18, 18, 18, 0.5)",
          }}
        >
          <Guitar className="w-3.5 h-3.5" style={{ color: GM_GOLD }} />
          <span>{PATH_BADGE.instrument}</span>
          <span style={{ color: GM_GOLD_MATT }}>·</span>
          <span>{PATH_BADGE.month}</span>
        </div>
        <span className="text-xs" style={{ color: "rgba(160,160,165,0.7)" }}>
          {completed} de {total} pasos completados
        </span>
      </div>
    </div>
  );
}
