import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GM_GOLD } from "../gmusic/tokens";
import { MOCK_USER, getUserLevelMonthLabel } from "../../data/mock-user";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

interface NavbarProps {
  currentPage?: string;
  setPage?: (page: string) => void;
  loggedIn?: boolean;
}

export function Navbar({ currentPage, setPage, loggedIn = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["hero", "academia", "comunidad", "planes", "contacto"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (currentPage && currentPage !== "home" && setPage) {
      setPage("home");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const menuItems: [string, string][] = [
    ["Inicio", "hero"],
    ["Academia", "academia"],
    ["Comunidad", "comunidad"],
    ["Ver planes", "planes"],
    ["Contacto", "contacto"],
  ];

  const initials = MOCK_USER.initials;

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 72, zIndex: 999,
        background: scrolled ? "rgba(8,8,8,0.92)" : "rgba(8,8,8,0.4)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <div style={{
          width: "100%", height: "100%", padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          maxWidth: 1440, margin: "0 auto", boxSizing: "border-box",
        }}>
          {/* Logo */}
          <div onClick={() => scrollToSection("hero")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GM_GOLD} strokeWidth="2" strokeLinecap="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: WHITE_WARM, letterSpacing: "-0.3px" }}>
              Gmusic <span style={{ color: GM_GOLD, fontWeight: 400 }}>Estudio</span>
            </span>
          </div>

          {/* Nav centro */}
          <nav className="gmusic-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {menuItems.map(([label, id]) => {
              const isActive = activeSection === id;
              return (
                <span key={label} onClick={() => scrollToSection(id)} style={{
                  color: isActive ? WHITE_WARM : "#6B6B6B",
                  fontSize: 13, fontWeight: 500, letterSpacing: "0.2px",
                  cursor: "pointer", transition: "color 0.15s ease", position: "relative",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = WHITE_WARM}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#6B6B6B"; }}
                >
                  {label}
                  {isActive && <span style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 3, height: 3, borderRadius: "50%", background: GM_GOLD, display: "block" }} />}
                </span>
              );
            })}
          </nav>

          {/* CTA derecha */}
          <div className="gmusic-ctas" style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            {loggedIn ? (
              /* Usuario logueado */
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: profileOpen ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${profileOpen ? "rgba(201,168,76,0.3)" : BORDER}`,
                  borderRadius: 2, padding: "0 14px 0 8px", height: 38,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 26, height: 26, borderRadius: 2,
                  background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontSize: 10, color: GM_GOLD, fontFamily: "Inter,sans-serif", fontWeight: 700 }}>{initials}</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, color: WHITE_WARM, fontFamily: "Inter,sans-serif", fontWeight: 500, lineHeight: 1.2 }}>
                    {MOCK_USER.name}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(201,168,76,0.6)", fontFamily: "Inter,sans-serif", letterSpacing: "0.5px" }}>
                    {getUserLevelMonthLabel()}
                  </div>
                </div>
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                  style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            ) : (
              /* Sin sesión */
              <button
                onClick={() => setPage && setPage("mi-estudio")}
                style={{
                  background: "rgba(0,0,0,0)", color: GM_GOLD, fontSize: 13, fontWeight: 500,
                  padding: "0 20px", height: 36, borderRadius: 2,
                  border: "1px solid rgba(201,168,76,0.35)", cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s", letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.65)"; e.currentTarget.style.background = "rgba(201,168,76,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.background = "rgba(0,0,0,0)"; }}
              >
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Hamburger mobile */}
          <button className="gmusic-hamburger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, color: "#fff" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: 72, left: 0, right: 0,
            background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${BORDER}`, padding: "16px 24px 24px",
            display: "flex", flexDirection: "column", gap: 4, zIndex: 998,
          }}>
            {menuItems.map(([label, id]) => (
              <button key={label} onClick={() => scrollToSection(id)} style={{
                background: "none", border: "none",
                color: activeSection === id ? WHITE_WARM : "#6B6B6B",
                fontSize: 16, fontWeight: 500, cursor: "pointer",
                textAlign: "left", padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>{label}</button>
            ))}
          </div>
        )}
      </header>

      {/* Profile panel — dropdown desde el navbar */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 997 }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed", top: 80, right: 48, zIndex: 998,
                width: 300,
                background: "rgba(17,17,17,0.97)", backdropFilter: "blur(20px)",
                border: `1px solid rgba(201,168,76,0.2)`,
                borderRadius: 4,
                boxShadow: "0 24px 48px rgba(0,0,0,0.7)",
              }}
            >
              {/* Header del panel */}
              <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 3,
                    background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: GM_GOLD }}>{initials}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: WHITE_WARM, fontWeight: 400 }}>
                      Bienvenido, {MOCK_USER.name}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(201,168,76,0.6)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>
                      {getUserLevelMonthLabel()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats compactas */}
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { icon: "🔥", value: MOCK_USER.streakDays, label: "racha" },
                  { icon: "⚡", value: `${MOCK_USER.xp.toLocaleString()}`, label: "XP" },
                  { icon: "✓", value: `${MOCK_USER.weeklyDone}/${MOCK_USER.weeklyTotal}`, label: "semana" },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "8px 4px", background: "rgba(255,255,255,0.02)", borderRadius: 2, border: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{stat.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: GM_GOLD }}>{stat.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Progreso semanal */}
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>Progreso semanal</span>
                  <span style={{ fontSize: 11, color: GM_GOLD, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>{MOCK_USER.weeklyDone}/{MOCK_USER.weeklyTotal}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${(MOCK_USER.weeklyDone / MOCK_USER.weeklyTotal) * 100}%`, height: "100%", background: GM_GOLD, borderRadius: 2, transition: "width 0.5s" }} />
                </div>
              </div>

              {/* Acciones */}
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <button
                  onClick={() => { setProfileOpen(false); setPage && setPage("mi-estudio"); }}
                  style={{
                    width: "100%", height: 38, borderRadius: 2,
                    background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)",
                    color: GM_GOLD, fontSize: 12, fontFamily: "Inter,sans-serif", fontWeight: 600,
                    cursor: "pointer", letterSpacing: "0.5px",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                  Mi Estudio
                </button>
                <button
                  onClick={() => { setProfileOpen(false); setPage && setPage("mi-camino"); }}
                  style={{
                    width: "100%", height: 36, borderRadius: 2,
                    background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`,
                    color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Inter,sans-serif",
                    cursor: "pointer", letterSpacing: "0.5px",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3z" /></svg>
                  Continuar curso
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  style={{
                    width: "100%", height: 32, borderRadius: 2,
                    background: "none", border: "none",
                    color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "Inter,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
