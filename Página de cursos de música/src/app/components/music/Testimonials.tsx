import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "María Fernández",
    instrument: "Guitarra acústica",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    text: "En 3 meses toqué mi primera canción completa. El feedback de los instructores marcó una diferencia real en mi técnica.",
    stars: 5,
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    instrument: "Producción musical",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    text: "Nunca pensé que aprendería Ableton tan rápido. La metodología es clara y los proyectos prácticos son increíbles.",
    stars: 5,
  },
  {
    id: 3,
    name: "Lucía Ramírez",
    instrument: "Piano & Jazz",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
    text: "La comunidad me cambió todo. Encontré músicos con quienes colaborar y el nivel de los cursos es realmente profesional.",
    stars: 5,
  },
];

function StarRow() {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ setPage }: { setPage: (p: string) => void }) {
  return (
    <section style={{
      position: "relative",
      padding: "100px 0 120px",
      background: "linear-gradient(180deg, #000000 0%, #03070E 30%, #060C1A 55%, #03070E 80%, #000000 100%)",
      overflow: "hidden",
    }}>
      {/* Glow central */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(37,99,235,0.09) 0%, transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span style={{ display: "inline-block", padding: "5px 16px", background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.28)", borderRadius: 24, color: "#3B82F6", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 20 }}>
            ALUMNOS VERIFICADOS
          </span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 500, letterSpacing: "-1.5px", lineHeight: 1.15, color: "#FFFFFF", margin: "0 0 16px" }}>
            Lo que dicen quienes<br />ya encontraron su sonido.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, lineHeight: 1.65, maxWidth: 440, margin: "0 auto" }}>
            Más de 2,800 músicos ya están creciendo con Gmusic. Estas son sus historias.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(37,99,235,0.12)" }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20,
                padding: "28px 28px 24px",
                cursor: "default",
                transition: "box-shadow 0.3s ease",
              }}
            >
              {/* Badge "Alumno verificado" */}
              <div style={{
                position: "absolute", top: -12, right: 20,
                background: "#FBBF24", color: "#0A0A0A",
                fontSize: 11, fontWeight: 800, padding: "4px 12px",
                borderRadius: 999, letterSpacing: "0.5px",
              }}>
                ✓ Alumno verificado
              </div>

              {/* Estrellas */}
              <div style={{ marginBottom: 16 }}>
                <StarRow />
              </div>

              {/* Texto */}
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.65, marginBottom: 24, minHeight: 72 }}>
                "{t.text}"
              </p>

              {/* Avatar + nombre */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(59,130,246,0.3)" }}
                />
                <div>
                  <div style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{t.instrument}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 14px 44px rgba(251,191,36,0.4)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 17 }}
            onClick={() => setPage("courses")}
            style={{ height: 52, padding: "0 40px", borderRadius: 999, background: "#FBBF24", color: "#0A0A0A", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 6px 24px rgba(251,191,36,0.22)" }}
          >
            Ver los 6 cursos disponibles →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
