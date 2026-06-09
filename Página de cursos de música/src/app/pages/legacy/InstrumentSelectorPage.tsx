import { useState } from "react";
import { motion } from "motion/react";

const INSTRUMENTS = [
  {
    id: "guitarra",
    name: "Guitarra",
    icon: "🎸",
    description: "Acústica, eléctrica, clásica. Desde acordes básicos hasta solos complejos.",
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1750131418942-1638bdc87b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGd1aXRhciUyMGNsb3NldXAlMjB3b29kfGVufDF8fHx8MTc3NjQ0MTUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    courses: 12,
    students: "8.5k"
  }
];

const LEVEL_INFO = {
  fundamento: { label: "Fundamento", subtitle: "LA BASE", color: "#3b82f6", icon: "🌱" },
  tecnica: { label: "Técnica", subtitle: "EL CONTROL", color: "#f59e0b", icon: "🔥" },
  crea: { label: "Crea", subtitle: "LA EXPRESIÓN", color: "#ec4899", icon: "✨" }
} as const;

interface InstrumentSelectorPageProps {
  level: string;
  setPage: (page: string) => void;
  setInstrument: (instrument: string) => void;
}

export function InstrumentSelectorPage({ level, setPage, setInstrument }: InstrumentSelectorPageProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const levelInfo = LEVEL_INFO[level as keyof typeof LEVEL_INFO] ?? LEVEL_INFO.fundamento;

  const handleInstrumentClick = (instrumentId: string) => {
    setInstrument(instrumentId);
    setPage("instrument-courses");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      paddingBottom: 100,
      background: "linear-gradient(to bottom, #080808 0%, #0a0f1e 50%, #080808 100%)"
    }}>
      {/* Hero compacto */}
      <div style={{ 
        maxWidth: 1400, 
        margin: "0 auto", 
        padding: "140px 40px 60px",
        position: "relative"
      }}>
        {/* Botón Volver */}
        <button 
          onClick={() => setPage("home")} 
          style={{ 
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 40,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver a etapas
        </button>

        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            marginBottom: 24,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)"
          }}
        >
          <span>Academia</span>
          <span>→</span>
          <span style={{ 
            color: levelInfo.color,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            {levelInfo.icon} {levelInfo.label}
          </span>
          <span>→</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Elige tu instrumento</span>
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 style={{ 
            fontFamily: "'Playfair Display',serif", 
            fontSize: "clamp(36px,5vw,58px)", 
            fontWeight: 500, 
            letterSpacing: "-1.8px",
            lineHeight: 1.1,
            marginBottom: 16,
            color: "#fff"
          }}>
            ¿Qué instrumento quieres dominar?
          </h1>
          <p style={{ 
            color: "rgba(255,255,255,0.45)", 
            fontSize: 17, 
            maxWidth: 580, 
            lineHeight: 1.7 
          }}>
            Cada instrumento tiene su propio camino. Elige el tuyo y accede a cursos diseñados específicamente para <span style={{ color: levelInfo.color, fontWeight: 600 }}>{levelInfo.label}</span>.
          </p>
        </motion.div>
      </div>

      {/* Grid de instrumentos */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 40px" }}>
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          {INSTRUMENTS.map((instrument, index) => (
            <motion.div
              key={instrument.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              onMouseEnter={() => setHoveredId(instrument.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleInstrumentClick(instrument.id)}
              style={{
                position: "relative",
                height: 280,
                borderRadius: 24,
                overflow: "hidden",
                cursor: "pointer",
                border: `1px solid ${hoveredId === instrument.id ? `${instrument.color}60` : 'rgba(255,255,255,0.06)'}`,
                background: "rgba(255,255,255,0.02)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: hoveredId === instrument.id ? "translateY(-8px)" : "translateY(0)",
                boxShadow: hoveredId === instrument.id ? `0 20px 60px ${instrument.color}25` : "0 4px 20px rgba(0,0,0,0.3)"
              }}
            >
              {/* Imagen de fondo */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${instrument.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: hoveredId === instrument.id ? 0.25 : 0.12,
                filter: "grayscale(50%)",
                transition: "all 0.4s"
              }} />

              {/* Gradiente overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.3) 100%)`
              }} />

              {/* Glow de color */}
              <motion.div
                animate={{ 
                  opacity: hoveredId === instrument.id ? 0.3 : 0,
                  scale: hoveredId === instrument.id ? 1.1 : 1
                }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  bottom: -60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: 180,
                  background: `radial-gradient(ellipse, ${instrument.color}60 0%, transparent 70%)`,
                  pointerEvents: "none",
                  filter: "blur(40px)"
                }}
              />

              {/* Contenido */}
              <div style={{
                position: "absolute",
                inset: 0,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <motion.div
                    animate={{ 
                      scale: hoveredId === instrument.id ? 1.15 : 1,
                      rotate: hoveredId === instrument.id ? 5 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ 
                      fontSize: 48,
                      filter: `drop-shadow(0 0 20px ${instrument.color}80)`,
                    }}
                  >
                    {instrument.icon}
                  </motion.div>

                  {/* Badge de cursos */}
                  <div style={{
                    background: `${instrument.color}15`,
                    border: `1px solid ${instrument.color}30`,
                    borderRadius: 12,
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: instrument.color,
                    backdropFilter: "blur(10px)"
                  }}>
                    {instrument.courses} cursos
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 32,
                    fontWeight: 600,
                    marginBottom: 10,
                    color: "#fff",
                    letterSpacing: "-0.5px"
                  }}>
                    {instrument.name}
                  </h3>
                  <p style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginBottom: 16
                  }}>
                    {instrument.description}
                  </p>

                  {/* Footer stats + CTA */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}>
                      <span style={{ fontSize: 16 }}>👥</span>
                      {instrument.students} estudiantes
                    </div>

                    <motion.div
                      animate={{
                        x: hoveredId === instrument.id ? 6 : 0,
                        opacity: hoveredId === instrument.id ? 1 : 0.6
                      }}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: instrument.color,
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      Ver cursos
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
