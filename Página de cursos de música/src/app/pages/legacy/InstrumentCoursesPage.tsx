import { useState } from "react";
import { motion } from "motion/react";

interface InstrumentCoursesPageProps {
  level: string;
  instrument: string;
  setPage: (page: string) => void;
}

const INSTRUMENT_INFO = {
  guitarra: { name: "Guitarra", icon: "🎸", color: "#c8b06a" }
};

const LEVEL_INFO = {
  fundamento: { label: "Fundamento", subtitle: "LA BASE", color: "#c8b06a", icon: "🌱" },
  tecnica: { label: "Técnica", subtitle: "EL CONTROL", color: "#c8b06a", icon: "🔥" },
  crea: { label: "Crea", subtitle: "LA EXPRESIÓN", color: "#c8b06a", icon: "✨" }
};

// Hitos del progreso
const MILESTONES = [
  { id: 1, name: "COMPRENSIÓN", xp: 300 },
  { id: 2, name: "HÁBITO", xp: 600 },
  { id: 3, name: "MANIFESTACIÓN", xp: 1000 }
];

// Lecciones para Guitarra
const GUITAR_LESSONS = [
  {
    id: 1,
    title: "El Latido Constante",
    description: "Sincronizar un golpe simple con el pulso",
    status: "completed",
    xp: 100,
    position: "left"
  },
  {
    id: 2,
    title: "Primera Cuerda al Aire",
    description: "Reconocer el sonido de la primera cuerda",
    status: "completed",
    xp: 50,
    position: "right"
  },
  {
    id: 3,
    title: "Postura Correcta",
    description: "Alinear cuerpo, mano y guitarra",
    status: "completed",
    xp: 70,
    position: "left"
  },
  {
    id: 4,
    title: "Dedos en Acción",
    description: "Presionar las cuerdas con precisión",
    status: "active",
    xp: 80,
    position: "right"
  },
  {
    id: 5,
    title: "Acorde de Do Mayor",
    description: "Tu primer acorde completo",
    status: "locked",
    xp: 100,
    position: "left"
  },
  {
    id: 6,
    title: "Transición Suave",
    description: "Cambiar entre dos acordes sin pausa",
    status: "locked",
    xp: 120,
    position: "right"
  },
  {
    id: 7,
    title: "Rasgueo Básico",
    description: "Movimiento continuo de la mano derecha",
    status: "locked",
    xp: 90,
    position: "left"
  },
  {
    id: 8,
    title: "Ritmo en Tiempo",
    description: "Mantener un patrón constante",
    status: "locked",
    xp: 110,
    position: "right"
  },
  {
    id: 9,
    title: "Melodía Simple",
    description: "Tocar una secuencia de notas individuales",
    status: "locked",
    xp: 100,
    position: "left"
  },
  {
    id: 10,
    title: "Tu Primera Canción",
    description: "Integra todo lo aprendido en una pieza completa",
    status: "locked",
    xp: 150,
    position: "right",
    isMilestone: true
  }
];

export function InstrumentCoursesPage({ level, instrument, setPage }: InstrumentCoursesPageProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const instrumentData = INSTRUMENT_INFO[instrument] || INSTRUMENT_INFO.guitarra;
  const levelData = LEVEL_INFO[level] || LEVEL_INFO.fundamento;

  // Solo mostrar diseño para guitarra
  if (instrument !== "guitarra") {
    return (
      <div style={{
        minHeight: "100vh",
        paddingTop: 140,
        background: "#0a0a0a"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 36, marginBottom: 20 }}>
            Próximamente
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>
            El contenido para {instrumentData.name} estará disponible pronto.
          </p>
          <button
            onClick={() => setPage("instrument-selector")}
            style={{
              background: "#c8b06a",
              border: "none",
              color: "#000",
              padding: "14px 28px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Volver a instrumentos
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de intro con imagen de guitarra
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Botón volver flotante */}
        <button
          onClick={() => setPage("home")}
          style={{
            position: "absolute",
            top: 100,
            left: 40,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
            padding: "10px 20px",
            borderRadius: 24,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s",
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>

        {/* Contenido central */}
        <div style={{
          maxWidth: 1200,
          width: "100%",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          flexWrap: "wrap"
        }}>
          {/* Imagen de guitarra */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: "relative",
              maxWidth: 500,
              flex: 1,
              minWidth: 300
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80"
              alt="Guitarra"
              style={{
                width: "100%",
                height: "auto",
                filter: "drop-shadow(0 20px 60px rgba(200,176,106,0.3))",
                borderRadius: 24
              }}
            />
          </motion.div>

          {/* Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              flex: 1,
              minWidth: 320,
              maxWidth: 500
            }}
          >
            {/* Badge de nivel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `${levelData.color}15`,
                border: `1px solid ${levelData.color}40`,
                padding: "8px 16px",
                borderRadius: 20,
                marginBottom: 24
              }}
            >
              <span style={{ fontSize: 20 }}>{levelData.icon}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: levelData.color,
                textTransform: "uppercase",
                letterSpacing: "2px"
              }}>
                {levelData.label}
              </span>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(42px, 6vw, 64px)",
                fontWeight: 500,
                color: "#fff",
                marginBottom: 20,
                lineHeight: 1.1,
                letterSpacing: "-1.5px"
              }}
            >
              Aprende Guitarra
            </motion.h1>

            {/* Descripción */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                marginBottom: 32
              }}
            >
              Domina la guitarra desde cero con un método paso a paso inspirado en las mejores plataformas de aprendizaje. Cada lección está diseñada para construir tu confianza y técnica.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              style={{
                display: "flex",
                gap: 32,
                marginBottom: 40
              }}
            >
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#c8b06a", marginBottom: 4 }}>
                  10
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Lecciones
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#c8b06a", marginBottom: 4 }}>
                  1000
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  XP Total
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#c8b06a", marginBottom: 4 }}>
                  3
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Hitos
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap"
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIntro(false)}
                style={{
                  background: "linear-gradient(135deg, #c8b06a 0%, #d4c078 100%)",
                  border: "none",
                  color: "#0a0a0a",
                  padding: "16px 40px",
                  borderRadius: 20,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 8px 32px rgba(200,176,106,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                Comenzar mi camino
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  padding: "16px 32px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                Ver detalles del curso
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Glow decorativo */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(200,176,106,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(80px)"
        }} />
      </motion.div>
    );
  }

  // Calcular progreso
  const totalXP = GUITAR_LESSONS.filter(l => l.status === "completed").reduce((sum, l) => sum + l.xp, 0);
  const progressPercent = (totalXP / 1000) * 100;

  // Determinar qué hito está activo
  const currentMilestone = MILESTONES.findIndex(m => totalXP < m.xp);
  const activeMilestoneIndex = currentMilestone === -1 ? MILESTONES.length : currentMilestone;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      paddingBottom: 100
    }}>
      {/* Header con selector de instrumentos */}
      <div style={{
        position: "fixed",
        top: 70,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "24px 0"
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px"
        }}>
          {/* Header row: botón volver + título guitarra */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32
          }}>
            <button
              onClick={() => setPage("home")}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                padding: "10px 20px",
                borderRadius: 24,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </button>

            {/* Badge de Guitarra */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(200,176,106,0.1)",
              border: "1px solid rgba(200,176,106,0.3)",
              padding: "10px 24px",
              borderRadius: 24
            }}>
              <span style={{ fontSize: 20 }}>🎸</span>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#c8b06a",
                textTransform: "uppercase",
                letterSpacing: "1.5px"
              }}>
                GUITARRA
              </span>
            </div>

            <div style={{ width: 100 }} />
          </div>

          {/* Barra de progreso con hitos */}
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}>
              <span style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 700
              }}>
                RESONANCIA TOTAL
              </span>
              <span style={{
                fontSize: 13,
                color: "#c8b06a",
                fontWeight: 700
              }}>
                {totalXP} / 1000 XP
              </span>
            </div>

            {/* Barra de progreso */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: "100%",
                height: 6,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 20,
                overflow: "hidden"
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #c8b06a 0%, #d4c078 100%)",
                    borderRadius: 20
                  }}
                />
              </div>

              {/* Hitos */}
              <div style={{
                position: "absolute",
                top: -8,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between"
              }}>
                {MILESTONES.map((milestone, index) => {
                  const milestoneProgress = (milestone.xp / 1000) * 100;
                  const isReached = totalXP >= milestone.xp;
                  const isActive = index === activeMilestoneIndex;

                  return (
                    <div
                      key={milestone.id}
                      style={{
                        position: "absolute",
                        left: `${milestoneProgress}%`,
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: isActive ? [1, 1.15, 1] : 1,
                        }}
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0
                        }}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: isReached ? "#c8b06a" : "rgba(255,255,255,0.1)",
                          border: isActive ? "3px solid #c8b06a" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: isReached ? "0 0 20px rgba(200,176,106,0.6)" : "none"
                        }}
                      >
                        {isReached && (
                          <div style={{ fontSize: 10, color: "#0a0a0a" }}>✓</div>
                        )}
                      </motion.div>
                      <span style={{
                        fontSize: 9,
                        color: isReached ? "#c8b06a" : "rgba(255,255,255,0.3)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        whiteSpace: "nowrap"
                      }}>
                        {milestone.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Path de lecciones */}
      <div style={{ paddingTop: 240 }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px",
          position: "relative"
        }}>
          {/* Lecciones */}
          {GUITAR_LESSONS.map((lesson, index) => {
            const isLeft = lesson.position === "left";
            const nextLesson = GUITAR_LESSONS[index + 1];

            return (
              <div key={lesson.id} style={{ marginBottom: 140, position: "relative" }}>
                {/* Línea conectora vertical */}
                {nextLesson && (
                  <div style={{
                    position: "absolute",
                    left: "50%",
                    top: 50,
                    width: 3,
                    height: 140,
                    background: lesson.status === "completed"
                      ? "linear-gradient(to bottom, #c8b06a 0%, rgba(200,176,106,0.3) 100%)"
                      : "rgba(255,255,255,0.08)",
                    transform: "translateX(-50%)",
                    zIndex: 0
                  }} />
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  gap: 60
                }}>
                  {/* Card de lección a la izquierda */}
                  {isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredId(lesson.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        flex: 1,
                        maxWidth: 420,
                        background: lesson.status === "locked"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(200,176,106,0.05)",
                        border: `1px solid ${lesson.status === "locked" ? "rgba(255,255,255,0.05)" : "rgba(200,176,106,0.2)"}`,
                        borderRadius: 20,
                        padding: 24,
                        cursor: lesson.status === "locked" ? "not-allowed" : "pointer",
                        opacity: lesson.status === "locked" ? 0.4 : 1,
                        transition: "all 0.3s",
                        boxShadow: hoveredId === lesson.id && lesson.status !== "locked"
                          ? "0 8px 32px rgba(200,176,106,0.2)"
                          : "none"
                      }}
                    >
                      {/* Badge de estado */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16
                      }}>
                        <div style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: lesson.status === "completed" ? "#c8b06a" : lesson.status === "active" ? "#6ab4f0" : "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6
                        }}>
                          {lesson.status === "completed" && "✓ COMPLETADA"}
                          {lesson.status === "active" && "▶ EN PROGRESO"}
                          {lesson.status === "locked" && "🔒 BLOQUEADA"}
                        </div>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#c8b06a"
                        }}>
                          +{lesson.xp} XP
                        </div>
                      </div>

                      {/* Título y descripción */}
                      <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 22,
                        fontWeight: 500,
                        color: "#fff",
                        marginBottom: 8,
                        lineHeight: 1.2
                      }}>
                        {lesson.title}
                      </h3>
                      <p style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.6,
                        marginBottom: 20
                      }}>
                        {lesson.description}
                      </p>

                      {/* Botón de acción */}
                      {lesson.status !== "locked" && (
                        <button
                          style={{
                            background: lesson.status === "completed" ? "rgba(200,176,106,0.1)" : "#c8b06a",
                            border: lesson.status === "completed" ? "1px solid rgba(200,176,106,0.3)" : "none",
                            color: lesson.status === "completed" ? "#c8b06a" : "#0a0a0a",
                            padding: "10px 20px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            transition: "all 0.3s"
                          }}
                        >
                          {lesson.status === "completed" ? "REPASAR" : "CONTINUAR"}
                          <span style={{ fontSize: 14 }}>→</span>
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Nodo central */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    style={{
                      position: "relative",
                      zIndex: 10
                    }}
                  >
                    <div style={{
                      width: lesson.isMilestone ? 70 : 50,
                      height: lesson.isMilestone ? 70 : 50,
                      borderRadius: "50%",
                      background: lesson.status === "completed"
                        ? "linear-gradient(135deg, #c8b06a 0%, #d4c078 100%)"
                        : lesson.status === "active"
                        ? "radial-gradient(circle, rgba(200,176,106,0.3) 0%, rgba(200,176,106,0.1) 100%)"
                        : "rgba(255,255,255,0.05)",
                      border: lesson.status === "active"
                        ? "4px solid #c8b06a"
                        : lesson.status === "completed"
                        ? "3px solid rgba(255,255,255,0.2)"
                        : "2px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: lesson.isMilestone ? 32 : 24,
                      boxShadow: lesson.status === "active"
                        ? "0 0 40px rgba(200,176,106,0.6)"
                        : lesson.status === "completed"
                        ? "0 8px 30px rgba(200,176,106,0.3)"
                        : "none",
                      transition: "all 0.3s",
                      position: "relative"
                    }}>
                      {lesson.status === "completed" && (
                        <div style={{ color: "#0a0a0a", fontWeight: 700 }}>✓</div>
                      )}
                      {lesson.status === "active" && (
                        <div style={{ color: "#c8b06a", fontWeight: 700 }}>●</div>
                      )}
                      {lesson.status === "locked" && (
                        <div style={{ fontSize: lesson.isMilestone ? 24 : 18, color: "rgba(255,255,255,0.2)" }}>🔒</div>
                      )}

                      {/* Pulso para lección activa */}
                      {lesson.status === "active" && (
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 0, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{
                            position: "absolute",
                            inset: -12,
                            borderRadius: "50%",
                            border: "3px solid #c8b06a",
                            pointerEvents: "none"
                          }}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Card de lección a la derecha */}
                  {!isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredId(lesson.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        flex: 1,
                        maxWidth: 420,
                        background: lesson.status === "locked"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(200,176,106,0.05)",
                        border: `1px solid ${lesson.status === "locked" ? "rgba(255,255,255,0.05)" : "rgba(200,176,106,0.2)"}`,
                        borderRadius: 20,
                        padding: 24,
                        cursor: lesson.status === "locked" ? "not-allowed" : "pointer",
                        opacity: lesson.status === "locked" ? 0.4 : 1,
                        transition: "all 0.3s",
                        boxShadow: hoveredId === lesson.id && lesson.status !== "locked"
                          ? "0 8px 32px rgba(200,176,106,0.2)"
                          : "none"
                      }}
                    >
                      {/* Badge de estado */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16
                      }}>
                        <div style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: lesson.status === "completed" ? "#c8b06a" : lesson.status === "active" ? "#6ab4f0" : "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6
                        }}>
                          {lesson.status === "completed" && "✓ COMPLETADA"}
                          {lesson.status === "active" && "▶ EN PROGRESO"}
                          {lesson.status === "locked" && "🔒 BLOQUEADA"}
                        </div>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#c8b06a"
                        }}>
                          +{lesson.xp} XP
                        </div>
                      </div>

                      {/* Título y descripción */}
                      <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: 22,
                        fontWeight: 500,
                        color: "#fff",
                        marginBottom: 8,
                        lineHeight: 1.2
                      }}>
                        {lesson.title}
                      </h3>
                      <p style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.6,
                        marginBottom: 20
                      }}>
                        {lesson.description}
                      </p>

                      {/* Botón de acción */}
                      {lesson.status !== "locked" && (
                        <button
                          style={{
                            background: lesson.status === "completed" ? "rgba(200,176,106,0.1)" : "#c8b06a",
                            border: lesson.status === "completed" ? "1px solid rgba(200,176,106,0.3)" : "none",
                            color: lesson.status === "completed" ? "#c8b06a" : "#0a0a0a",
                            padding: "10px 20px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            transition: "all 0.3s"
                          }}
                        >
                          {lesson.status === "completed" ? "REPASAR" : "CONTINUAR"}
                          <span style={{ fontSize: 14 }}>→</span>
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Spacer para mantener centrado cuando no hay card */}
                  {isLeft ? <div style={{ flex: 1, maxWidth: 420 }} /> : <div style={{ flex: 1, maxWidth: 420 }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
