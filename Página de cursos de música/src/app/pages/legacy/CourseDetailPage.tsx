import { useState } from "react";
import { motion } from "motion/react";
import { OptimizedImage, getOptimizedImageUrl } from "../../components/ui/OptimizedImage";
import { Avatar } from "../../components/ui/avatar";
import { IMAGE_CONFIG } from "../../utils/image-config";

interface CourseDetailPageProps {
  course: any;
  setPage: (page: string) => void;
  onShowAuth: () => void;
  onShowCheckout: () => void;
  userState: "anonymous" | "registered" | "premium";
}

export function CourseDetailPage({ course, setPage, onShowAuth, onShowCheckout, userState }: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState("contenido");
  const [playingPreview, setPlayingPreview] = useState(false);

  const curriculum = [
    {
      section: 1,
      title: "Fundamentos del Fingerstyle",
      lessons: [
        { id: 1, title: "Introducción al Fingerstyle", duration: "8:24", free: true },
        { id: 2, title: "Posición de la mano derecha", duration: "12:15", free: false },
        { id: 3, title: "Patrones básicos P-I-M-A", duration: "15:40", free: false },
        { id: 4, title: "Ejercicios de independencia", duration: "18:22", free: false }
      ]
    },
    {
      section: 2,
      title: "Técnicas Avanzadas",
      lessons: [
        { id: 5, title: "Hammer-on y Pull-off", duration: "14:30", free: false },
        { id: 6, title: "Armónicos naturales", duration: "11:45", free: false },
        { id: 7, title: "Slap y percusión", duration: "16:20", free: false },
        { id: 8, title: "Tapping con dedos", duration: "13:55", free: false }
      ]
    },
    {
      section: 3,
      title: "Repertorio Completo",
      lessons: [
        { id: 9, title: "Estudio #1 - Canon en D", duration: "22:10", free: false },
        { id: 10, title: "Estudio #2 - Blackbird Style", duration: "19:35", free: false },
        { id: 11, title: "Estudio #3 - Classical Gas", duration: "25:40", free: false },
        { id: 12, title: "Proyecto Final - Tu composición", duration: "30:00", free: false }
      ]
    }
  ];

  const reviews = [
    { id: 1, name: "María González", avatar: "https://i.pravatar.cc/150?img=1", rating: 5, date: "Hace 2 semanas", comment: "El mejor curso de fingerstyle que he tomado. Ana explica cada detalle con claridad y los ejercicios progresivos son perfectos." },
    { id: 2, name: "Carlos Ruiz", avatar: "https://i.pravatar.cc/150?img=3", rating: 5, date: "Hace 1 mes", comment: "Llevaba años tocando guitarra pero nunca había dominado el fingerstyle. Después de este curso mi técnica mejoró increíblemente." },
    { id: 3, name: "Laura Martínez", avatar: "https://i.pravatar.cc/150?img=5", rating: 4, date: "Hace 3 semanas", comment: "Muy bueno, aunque hubiera preferido más ejemplos de canciones populares. Aún así, totalmente recomendable." }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080808", paddingBottom: 100 }}>
      {/* Hero con video preview */}
      <div style={{
        position: "relative",
        height: "85vh",
        background: "#000",
        overflow: "hidden"
      }}>
        {/* Video/Imagen de fondo */}
        <div style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden"
        }}>
          <OptimizedImage
            src={getOptimizedImageUrl(course.image, IMAGE_CONFIG.courseThumbnail.sizes.detail)}
            alt={course.title}
            objectFit="cover"
            style={{
              filter: playingPreview ? "blur(0)" : "blur(8px)",
              opacity: playingPreview ? 1 : 0.3,
              transition: "all 0.4s"
            }}
            priority={true}
          />
        </div>

        {/* Overlay gradiente */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 50%, rgba(8,8,8,0.9) 100%)"
        }} />

        {/* Botón volver */}
        <button
          onClick={() => setPage("courses")}
          style={{
            position: "absolute",
            top: 100,
            left: 40,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
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
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>

        {/* Contenido principal */}
        <div style={{
          position: "relative",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 80
        }}>
          {/* Info del curso */}
          <div style={{ flex: 1, maxWidth: 600 }}>
            {/* Badge de nivel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(37,99,235,0.2)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(37,99,235,0.4)",
                padding: "8px 18px",
                borderRadius: 20,
                marginBottom: 20
              }}
            >
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#2563eb",
                textTransform: "uppercase",
                letterSpacing: "2px"
              }}>
                {course.level}
              </span>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(38px, 5vw, 56px)",
                fontWeight: 500,
                color: "#fff",
                marginBottom: 20,
                lineHeight: 1.1,
                letterSpacing: "-1.5px"
              }}
            >
              {course.title}
            </motion.h1>

            {/* Descripción */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
                marginBottom: 30
              }}
            >
              {course.description} Aprenderás desde los patrones básicos hasta técnicas avanzadas que te permitirán tocar piezas complejas con fluidez y expresión.
            </motion.p>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 32,
                paddingBottom: 28,
                borderBottom: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <Avatar
                src={course.instructorImg}
                alt={course.instructor}
                size="medium"
                style={{
                  border: "3px solid rgba(37,99,235,0.5)"
                }}
              />
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
                  Instructor
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
                  {course.instructor}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "flex",
                gap: 40,
                marginBottom: 40
              }}
            >
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>
                  {course.rating}★
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Calificación
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                  {course.students.toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Estudiantes
                </div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
                  {course.duration}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  Duración total
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              {userState === "premium" ? (
                <button
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    color: "#fff",
                    padding: "18px 40px",
                    borderRadius: 20,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}
                >
                  Continuar aprendiendo
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
              ) : (
                <>
                  <button
                    onClick={userState === "anonymous" ? onShowAuth : onShowCheckout}
                    style={{
                      background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                      border: "none",
                      color: "#000",
                      padding: "18px 40px",
                      borderRadius: 20,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxShadow: "0 8px 32px rgba(251,191,36,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(251,191,36,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,0.4)";
                    }}
                  >
                    Comprar curso • ${course.price}
                  </button>

                  <button
                    onClick={() => setPlayingPreview(!playingPreview)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#fff",
                      padding: "18px 32px",
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Ver clase gratis
                  </button>
                </>
              )}
            </motion.div>

            {/* Garantía */}
            {userState !== "premium" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  marginTop: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Garantía de 30 días • Acceso de por vida
              </motion.div>
            )}
          </div>

          {/* Video preview placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              flex: 1,
              maxWidth: 600,
              display: playingPreview ? "block" : "none"
            }}
          >
            <div style={{
              aspectRatio: "16/9",
              background: "#000",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative"
            }}>
              <img
                src={course.image}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.4)"
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: 4 }}>
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs de contenido */}
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "60px 40px 0"
      }}>
        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          gap: 40,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: 48
        }}>
          {["contenido", "reseñas", "instructor"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                padding: "0 0 16px 0",
                borderBottom: activeTab === tab ? "3px solid #2563eb" : "3px solid transparent",
                transition: "all 0.3s",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "contenido" && (
          <div style={{ maxWidth: 900 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 32
            }}>
              Contenido del curso
            </h2>

            {curriculum.map((section) => (
              <div
                key={section.section}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 20
                }}
              >
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 20
                }}>
                  Sección {section.section}: {section.title}
                </h3>

                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: lesson.free ? "rgba(16,185,129,0.05)" : "transparent",
                      border: lesson.free ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                      marginBottom: 8,
                      transition: "all 0.2s",
                      cursor: lesson.free ? "pointer" : "default",
                      opacity: lesson.free || userState === "premium" ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (lesson.free || userState === "premium") {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = lesson.free ? "rgba(16,185,129,0.05)" : "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {lesson.free || userState === "premium" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      )}
                      <span style={{
                        fontSize: 15,
                        color: lesson.free || userState === "premium" ? "#fff" : "rgba(255,255,255,0.4)"
                      }}>
                        {lesson.title}
                      </span>
                      {lesson.free && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#10b981",
                          background: "rgba(16,185,129,0.15)",
                          padding: "4px 10px",
                          borderRadius: 12,
                          textTransform: "uppercase",
                          letterSpacing: "1px"
                        }}>
                          Gratis
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)"
                    }}>
                      {lesson.duration}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "reseñas" && (
          <div style={{ maxWidth: 900 }}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 16
              }}>
                Reseñas de estudiantes
              </h2>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 24
              }}>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 700, color: "#fbbf24" }}>
                    {course.rating}
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                    de 5 estrellas
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", width: 80 }}>
                        {stars} estrellas
                      </span>
                      <div style={{
                        flex: 1,
                        height: 6,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: stars === 5 ? "85%" : stars === 4 ? "12%" : "3%",
                          height: "100%",
                          background: "#fbbf24",
                          borderRadius: 10
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: 28,
                  marginBottom: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                  <Avatar
                    src={review.avatar}
                    alt={review.name}
                    size="small"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                      {review.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < review.rating ? "#fbbf24" : "rgba(255,255,255,0.2)", fontSize: 14 }}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7
                }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "instructor" && (
          <div style={{ maxWidth: 900 }}>
            <div style={{
              display: "flex",
              gap: 40,
              alignItems: "flex-start"
            }}>
              <Avatar
                src={course.instructorImg}
                alt={course.instructor}
                size="large"
                style={{
                  width: 160,
                  height: 160,
                  border: "4px solid rgba(37,99,235,0.5)"
                }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 12
                }}>
                  {course.instructor}
                </h2>
                <p style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.8,
                  marginBottom: 24
                }}>
                  Guitarrista profesional con más de 15 años de experiencia en fingerstyle. Ha enseñado a más de 10,000 estudiantes y es reconocida por su método progresivo y detallado.
                </p>
                <div style={{ display: "flex", gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                      12
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      Cursos
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>
                      10K+
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      Estudiantes
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
                      4.8★
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      Calificación
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
