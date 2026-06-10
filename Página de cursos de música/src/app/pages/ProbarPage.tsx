import { useState } from "react";
import { motion } from "motion/react";
import { GOLD, GOLD_SOFT, WHITE_WARM, TEXT_SEC } from "../components/marketing/tokens";
import { navigateToHomeSection } from "../utils/public-home-navigation";

interface ProbarPageProps {
  setPage?: (page: string) => void;
}

export function ProbarPage({ setPage }: ProbarPageProps) {
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", height: 50, padding: "0 18px",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === field ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 2, color: WHITE_WARM,
    fontSize: 15, fontFamily: "Inter, sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 24px 80px",
    }}>
      {/* Glow ambiental */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.04) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 480 }}>
        {!submitted ? (
          /* ── Estado A: Formulario ── */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 500,
              letterSpacing: "3px", textTransform: "uppercase",
              color: GOLD, fontFamily: "Inter, sans-serif", marginBottom: 20,
            }}>
              Clase gratuita
            </span>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 400, letterSpacing: "-1px", lineHeight: 1.15,
              color: WHITE_WARM, margin: "0 0 14px",
            }}>
              Conoce el método Gmusic
            </h1>

            <p style={{
              color: TEXT_SEC, fontSize: 16, lineHeight: 1.7,
              fontFamily: "Inter, sans-serif", margin: "0 0 40px",
            }}>
              Déjanos tu nombre y correo para ver la clase gratuita.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                required
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                onFocus={() => setFocused("nombre")}
                onBlur={() => setFocused(null)}
                style={inputStyle("nombre")}
              />
              <input
                type="email"
                required
                placeholder="Correo"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                style={inputStyle("email")}
              />
              <motion.button
                type="submit"
                whileHover={{ background: GOLD_SOFT, boxShadow: "0 10px 32px rgba(201,168,76,0.35)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  height: 50, borderRadius: 2, marginTop: 4,
                  background: GOLD, color: "#080808",
                  fontSize: 13, fontWeight: 700, border: "none",
                  cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Ver la clase gratis
              </motion.button>
            </form>

            <p style={{
              color: "rgba(255,255,255,0.18)", fontSize: 12,
              fontFamily: "Inter, sans-serif", marginTop: 16, textAlign: "center",
            }}>
              Sin spam. Sin tarjeta. Solo la clase.
            </p>
          </motion.div>
        ) : (
          /* ── Estado B: Video placeholder ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 500,
              letterSpacing: "3px", textTransform: "uppercase",
              color: GOLD, fontFamily: "Inter, sans-serif", marginBottom: 20,
            }}>
              Tu clase está lista
            </span>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 400, letterSpacing: "-0.8px", lineHeight: 1.2,
              color: WHITE_WARM, margin: "0 0 8px",
            }}>
              Cómo funciona tu camino de guitarra en Gmusic
            </h1>

            <p style={{
              color: TEXT_SEC, fontSize: 14,
              fontFamily: "Inter, sans-serif", margin: "0 0 28px",
            }}>
              7–8 min · Método completo
            </p>

            {/* Placeholder 16:9 */}
            <div style={{
              width: "100%", aspectRatio: "16/9",
              background: "#111111",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: 4,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 2,
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={GOLD}><path d="M5 3l14 9-14 9V3z" /></svg>
              </div>
              <span style={{
                color: "rgba(255,255,255,0.2)", fontSize: 11,
                fontFamily: "Inter, sans-serif", letterSpacing: "2px",
                textTransform: "uppercase",
              }}>
                Video · Etapa 02
              </span>
            </div>

            {setPage && (
              <motion.button
                whileHover={{ background: GOLD_SOFT, boxShadow: "0 10px 32px rgba(201,168,76,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateToHomeSection(setPage, "planes")}
                style={{
                  width: "100%", height: 50, marginTop: 20, borderRadius: 2,
                  background: GOLD, color: "#080808",
                  fontSize: 13, fontWeight: 700, border: "none",
                  cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Quiero acceder al plan completo →
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
