import { useState } from "react";
import { Guitar, Menu } from "lucide-react";
import { GM_GOLD, GM_SURFACE, GM_TEXT, GM_TEXT_SEC } from "./tokens";
import { MOCK_USER, getUserPathLabel } from "../../data/mock-user";

export type GmusicNavId = "estudio" | "camino" | "progreso" | "comunidad";

interface GmusicInternalHeaderProps {
  activeNav: GmusicNavId;
  setPage: (page: string) => void;
  onPlaceholder: (stage: string) => void;
}

const NAV_ITEMS: { id: GmusicNavId; label: string; page?: string; placeholder?: string }[] = [
  { id: "estudio", label: "Mi Estudio", page: "mi-estudio" },
  { id: "camino", label: "Mi Camino", page: "mi-camino" },
  { id: "progreso", label: "Mi Progreso", placeholder: "Etapa 03" },
  { id: "comunidad", label: "Comunidad", placeholder: "Etapa 04" },
];

const HEADER_BORDER = "rgba(255, 255, 255, 0.08)";

export function GmusicInternalHeader({ activeNav, setPage, onPlaceholder }: GmusicInternalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.page) setPage(item.page);
    else if (item.placeholder) onPlaceholder(item.placeholder);
    setMobileMenuOpen(false);
  };

  const navColor = (id: GmusicNavId) => (activeNav === id ? GM_GOLD : GM_TEXT_SEC);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: HEADER_BORDER,
        background: "rgba(10, 10, 10, 0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center min-h-[72px] gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.22)",
              }}
            >
              <Guitar className="w-4 h-4" style={{ color: GM_GOLD }} />
            </div>
            <span className="font-semibold text-base tracking-tight" style={{ color: GM_TEXT }}>
              Gmusic <span style={{ color: GM_GOLD, fontWeight: 500 }}>Estudio</span>
            </span>
          </div>

          {/* Nav — desktop centrada */}
          <nav className="hidden md:flex items-center justify-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? GM_GOLD : GM_TEXT_SEC,
                    background: active ? "rgba(212, 175, 55, 0.1)" : "transparent",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Perfil + hamburger */}
          <div className="flex items-center justify-end gap-2">
            <div
              className="hidden md:flex items-center gap-3 rounded-2xl px-4 py-2.5"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${HEADER_BORDER}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  background: "rgba(212, 175, 55, 0.12)",
                  color: GM_GOLD,
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                }}
              >
                {MOCK_USER.initials}
              </div>
              <div className="text-left leading-tight">
                <div className="text-sm font-medium" style={{ color: GM_TEXT }}>
                  {MOCK_USER.name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: GM_TEXT_SEC }}>
                  {getUserPathLabel()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{
                color: GM_GOLD,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${HEADER_BORDER}`,
              }}
              aria-label="Menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-5 py-4"
          style={{ borderColor: HEADER_BORDER, background: GM_SURFACE }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${HEADER_BORDER}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold"
              style={{ background: "rgba(212,175,55,0.12)", color: GM_GOLD }}
            >
              {MOCK_USER.initials}
            </div>
            <div>
              <div className="font-medium text-sm">{MOCK_USER.name}</div>
              <div className="text-xs mt-0.5" style={{ color: GM_TEXT_SEC }}>
                {getUserPathLabel()}
              </div>
            </div>
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium min-h-[44px] transition-colors"
                style={{
                  color: navColor(item.id),
                  background: activeNav === item.id ? "rgba(212,175,55,0.08)" : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
