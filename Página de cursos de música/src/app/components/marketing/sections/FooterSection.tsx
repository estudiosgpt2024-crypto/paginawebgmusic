import { GOLD, WHITE_WARM } from "../tokens";

interface FooterSectionProps {
  scrollTo: (id: string) => void;
}

export function FooterSection({ scrollTo }: FooterSectionProps) {
  return (
    <footer style={{
      background: "#050505",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "60px 80px 40px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 6,
                background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: WHITE_WARM }}>
                Gmusic <span style={{ color: GOLD, fontWeight: 400 }}>Estudio</span>
              </span>
            </div>
            <p style={{ color: "#555", fontSize: 13, lineHeight: 1.7, maxWidth: 300, margin: 0, fontFamily: "Inter, sans-serif" }}>
              Academia online de guitarra. Un sistema de práctica diseñado
              para guitarristas que quieren avanzar con constancia.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 20, color: "#444", fontFamily: "Inter, sans-serif" }}>Navegación</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {([["Inicio", "hero"], ["Academia", "academia"], ["Comunidad", "comunidad"], ["Ver planes", "planes"], ["Contacto", "contacto"]] as [string, string][]).map(([label, id]) => (
                <span
                  key={label}
                  onClick={() => scrollTo(id)}
                  style={{ color: "#555", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "color 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = WHITE_WARM}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#555"}
                >{label}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 20, color: "#444", fontFamily: "Inter, sans-serif" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Términos", "Privacidad", "Cookies"].map((item) => (
                <span key={item} style={{ color: "#555", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "color 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = WHITE_WARM}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#555"}
                >{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ color: "#3A3A3A", fontSize: 12, margin: 0, fontFamily: "Inter, sans-serif" }}>© 2026 Gmusic Estudio. Todos los derechos reservados.</p>
          <p style={{ color: "#3A3A3A", fontSize: 12, margin: 0, fontFamily: "Inter, sans-serif" }}>
            Hecho con <span style={{ color: GOLD }}>♪</span> para guitarristas
          </p>
        </div>
      </div>
    </footer>
  );
}
