import { useState } from "react";
import { motion } from "motion/react";
import { OptimizedImage, getOptimizedImageUrl } from "../ui/OptimizedImage";

interface AlbumCardProps {
  album: any;
  onOpen: () => void;
  onPlay: () => void;
  activeAlbum?: string;
  playing?: boolean;
  onPlayTrack?: (track: any) => void;
}

export function AlbumCard({ album, onOpen, onPlay, activeAlbum, playing, onPlayTrack }: AlbumCardProps) {
  const [hov, setHov] = useState(false);
  const [showTracklist, setShowTracklist] = useState(false);
  const isActive = activeAlbum === album.title || (playing && activeAlbum === album.title);

  return (
    <motion.div
      onMouseEnter={() => { setHov(true); setShowTracklist(true); }}
      onMouseLeave={() => { setHov(false); setShowTracklist(false); }}
      onClick={onOpen}
      style={{ cursor: "pointer", position: "relative", width: "100%" }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div 
        style={{ 
          position: "relative", 
          aspectRatio: "1", 
          borderRadius: 20, 
          overflow: "hidden", 
          background: "#111", 
          marginBottom: 16,
          boxShadow: hov ? "0px 20px 40px rgba(0,0,0,0.5), 0px 10px 20px rgba(0,0,0,0.3)" : "0px 4px 10px rgba(0,0,0,0.2)",
          transition: "boxShadow 0.3s ease-out, border 0.3s ease-out",
          border: isActive ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <OptimizedImage
          src={getOptimizedImageUrl(album.image, 600)}
          alt={album.title}
          aspectRatio="1"
          objectFit="cover"
          style={{
            transition: "transform 0.6s ease-out",
            transform: hov ? "scale(1.08)" : "scale(1)"
          }}
          priority={false}
        />
        
        {/* Mini Tracklist en Hover - Glassmorphism */}
        {showTracklist && album.tracklist && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(8, 8, 8, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.2) transparent"
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, marginBottom: 3 }}>
                {album.title}
              </h4>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                {album.tracks} canciones • {album.duration}
              </p>
            </div>

            {/* Track List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {album.tracklist.slice(0, 6).map((track, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ background: "rgba(255,255,255,0.1)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPlayTrack) {
                      onPlayTrack({
                        id: album.id * 100 + track.n,
                        title: track.title,
                        artist: album.artist,
                        album: album.title,
                        image: album.image,
                        duration: track.duration,
                        audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(idx % 8) + 1}.mp3`
                      });
                    }
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    marginBottom: 2
                  }}
                >
                  {/* Play Button */}
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "rgba(37, 99, 235, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.15)";
                    e.currentTarget.style.background = "rgba(37, 99, 235, 1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(37, 99, 235, 0.9)";
                  }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>

                  {/* Track Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#fff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {track.n}. {track.title}
                    </div>
                  </div>

                  {/* Duration */}
                  <div style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    flexShrink: 0
                  }}>
                    {track.duration}
                  </div>
                </motion.div>
              ))}

              {/* Show more indicator */}
              {album.tracklist.length > 6 && (
                <div style={{
                  padding: "6px 10px",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                  fontStyle: "italic"
                }}>
                  +{album.tracklist.length - 6} canciones más
                </div>
              )}
            </div>

            {/* Play All Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              style={{
                marginTop: 10,
                padding: "11px 16px",
                background: "rgba(37, 99, 235, 0.9)",
                border: "none",
                borderRadius: 999,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37, 99, 235, 1)";
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(37, 99, 235, 0.9)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.35)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Reproducir álbum
            </button>
          </motion.div>
        )}

        {/* Indicador de reproducción activa */}
        {isActive && playing && !showTracklist && (
          <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 3, alignItems: "flex-end", height: 16 }}>
            {[1,2,3,4].map(i => (
              <div
                key={i}
                style={{
                  width: 3,
                  background: "#3B82F6",
                  borderRadius: 2,
                  animation: `waveBar ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                  height: `${30 + i * 15}%`,
                  boxShadow: "0 0 8px rgba(59,130,246,0.6)"
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div style={{ padding: "0 4px" }}>
        <motion.div 
          style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: hov ? "#3B82F6" : "#FFFFFF", 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            marginBottom: 4,
            transition: "color 0.2s ease"
          }}
        >
          {album.title}
        </motion.div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "#A1A1AA", fontWeight: 400 }}>{album.artist}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface CourseCardProps {
  course: any;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const [hov, setHov] = useState(false);
  
  return (
    <div 
      className="premium-card" 
      onMouseEnter={() => setHov(true)} 
      onMouseLeave={() => setHov(false)} 
      onClick={onClick}
      style={{ 
        background: "linear-gradient(145deg, rgba(20,20,28,.98) 0%, rgba(12,12,18,.99) 100%)", 
        border: `1.5px solid ${hov ? "rgba(37,99,235,.5)" : "rgba(255,255,255,.1)"}`, 
        borderRadius: 24, 
        overflow: "hidden", 
        cursor: "pointer", 
        position: "relative",
        boxShadow: hov 
          ? "0 25px 70px rgba(0,0,0,.8), 0 0 50px rgba(37,99,235,.2), inset 0 1px 0 rgba(255,255,255,.08)" 
          : "0 10px 30px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.03)"
      }}
    >
      {/* Animated gradient border effect */}
      {hov && (
        <div style={{
          position: "absolute",
          inset: -2,
          background: "linear-gradient(45deg, #2563eb, #fbbf24, #2563eb)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 3s ease infinite",
          borderRadius: 24,
          zIndex: -1,
          opacity: 0.6,
          filter: "blur(8px)"
        }} />
      )}
      
      {/* Imagen principal con overlay avanzado */}
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#0a0a0f" }}>
        <OptimizedImage
          src={getOptimizedImageUrl(course.image, 800)}
          alt={course.title}
          aspectRatio="16/9"
          objectFit="cover"
          style={{
            transition: "transform .8s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: hov ? "scale(1.15) rotate(2deg)" : "scale(1)",
            filter: hov ? "brightness(1.1) contrast(1.05)" : "brightness(1)"
          }}
          priority={false}
        />
        
        {/* Multi-layer gradient overlay */}
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          background: `
            linear-gradient(to bottom, 
              rgba(8,8,8,0) 0%, 
              rgba(8,8,8,.3) 40%,
              rgba(8,8,8,.85) 90%,
              rgba(8,8,8,.95) 100%)
          `,
          transition: "opacity .4s"
        }} />
        
        {/* Glassmorphism overlay on hover */}
        {hov && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(37,99,235,.08)",
            backdropFilter: "blur(4px)",
            animation: "fadeInUp 0.4s ease both"
          }} />
        )}
        
        {/* Badge de nivel con glassmorphism */}
        <div style={{ 
          position: "absolute", 
          top: 20, 
          left: 20, 
          padding: "8px 18px", 
          borderRadius: 24, 
          background: "rgba(37,99,235,.2)", 
          backdropFilter: "blur(20px)", 
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(37,99,235,.5)",
          fontSize: 11, 
          fontWeight: 800, 
          color: "#2563eb", 
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          boxShadow: "0 8px 24px rgba(37,99,235,.3), inset 0 1px 0 rgba(255,255,255,.2)",
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "transform .3s ease"
        }}>
          {course.level}
        </div>
        
        {/* Badge de precio con efecto premium */}
        <div style={{ 
          position: "absolute", 
          top: 20, 
          right: 20, 
          padding: "10px 20px", 
          borderRadius: 24, 
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)", 
          backgroundSize: "200% 100%",
          color: "#080808", 
          fontSize: 16, 
          fontWeight: 900,
          boxShadow: "0 8px 24px rgba(251,191,36,.4), inset 0 2px 0 rgba(255,255,255,.4)",
          border: "1px solid rgba(255,255,255,.3)",
          transform: hov ? "scale(1.08) rotate(-2deg)" : "scale(1)",
          transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: hov ? "shimmer 2s ease infinite" : "none"
        }}>
          ${course.price}
        </div>
        
        {/* Botón de play con efecto avanzado */}
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          opacity: hov ? 1 : 0, 
          transition: "opacity .5s ease" 
        }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, rgba(37,99,235,.95) 0%, rgba(29,78,216,.98) 100%)", 
            backdropFilter: "blur(20px)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            border: "3px solid rgba(255,255,255,.4)", 
            transform: hov ? "scale(1) rotate(0deg)" : "scale(.6) rotate(-90deg)", 
            transition: "all .5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: "0 12px 40px rgba(37,99,235,.5), inset 0 2px 0 rgba(255,255,255,.3)",
            animation: "pulse 2s ease-in-out infinite"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        
        {/* Particle effect on hover */}
        {hov && (
          <>
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                style={{
                  position: "absolute",
                  top: `${20 + i * 30}%`,
                  left: `${20 + i * 20}%`,
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  boxShadow: "0 0 10px rgba(251,191,36,.8)",
                  animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Contenido de la card */}
      <div style={{ padding: "28px 28px 32px", position: "relative" }}>
        {/* Categoría badge */}
        <div style={{ 
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 16,
          background: "rgba(37,99,235,.1)",
          border: "1px solid rgba(37,99,235,.3)",
          fontSize: 10, 
          fontWeight: 800, 
          color: "#2563eb", 
          textTransform: "uppercase", 
          letterSpacing: "2px",
          marginBottom: 16
        }}>
          {course.tags[0]}
        </div>
        
        {/* Título con gradiente */}
        <h3 style={{ 
          fontSize: 22, 
          fontWeight: 800, 
          marginBottom: 14, 
          lineHeight: 1.25,
          letterSpacing: "-0.5px",
          background: "linear-gradient(135deg, #fff 0%, #e0e0e0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {course.title}
        </h3>
        
        {/* Instructor con avatar mejorado */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12, 
          marginBottom: 18,
          paddingBottom: 18,
          borderBottom: "1px solid rgba(255,255,255,.06)"
        }}>
          <div style={{
            position: "relative",
            width: 42,
            height: 42
          }}>
            {/* Animated ring */}
            <div style={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb 0%, #fbbf24 100%)",
              opacity: hov ? 1 : 0,
              transition: "opacity .4s",
              animation: hov ? "pulse 2s ease-in-out infinite" : "none"
            }} />
            <div style={{
              position: "relative",
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(37,99,235,.25) 0%, rgba(37,99,235,.1) 100%)",
              border: "2.5px solid rgba(37,99,235,.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(37,99,235,.2)"
            }}>
              <img 
                src={course.instructorImg} 
                alt="" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover" 
                }} 
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 2 }}>
              Instructor
            </div>
            <div style={{ fontSize: 14, color: "#ccc", fontWeight: 700 }}>
              {course.instructor}
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <p style={{ 
          fontSize: 14, 
          color: "#888", 
          lineHeight: 1.75, 
          marginBottom: 22,
          letterSpacing: "0.3px"
        }}>
          {course.description}
        </p>
        
        {/* Info: duración, estudiantes, rating con iconos premium */}
        <div style={{ 
          display: "flex", 
          gap: 24, 
          marginBottom: 24,
          fontSize: 13,
          color: "#777",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(37,99,235,.12)",
              border: "1px solid rgba(37,99,235,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span style={{ fontWeight: 600 }}>{course.duration}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(37,99,235,.12)",
              border: "1px solid rgba(37,99,235,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span style={{ fontWeight: 600 }}>{course.students.toLocaleString()}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(251,191,36,.15)",
              border: "1px solid rgba(251,191,36,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span style={{ color: "#fbbf24", fontWeight: 800, fontSize: 15 }}>{course.rating}</span>
          </div>
        </div>
        
        {/* Botón CTA con glassmorphism */}
        <button style={{
          width: "100%",
          padding: "16px 28px",
          borderRadius: 32,
          background: hov 
            ? "linear-gradient(135deg, rgba(37,99,235,.25) 0%, rgba(37,99,235,.15) 100%)"
            : "rgba(37,99,235,.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1.5px solid ${hov ? "rgba(37,99,235,.6)" : "rgba(37,99,235,.35)"}`,
          color: "#2563eb",
          fontSize: 15,
          fontWeight: 800,
          cursor: "pointer",
          transition: "all .4s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          boxShadow: hov 
            ? "0 8px 24px rgba(37,99,235,.25), inset 0 1px 0 rgba(255,255,255,.1)" 
            : "0 4px 12px rgba(37,99,235,.1)",
          position: "relative",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.color = "#2563eb";
          e.currentTarget.style.background = "rgba(37,99,235,.15)";
        }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>Explorar curso</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ position: "relative", zIndex: 1 }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          
          {/* Shimmer effect */}
          {hov && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)",
              animation: "shimmer 1.5s ease-in-out infinite"
            }} />
          )}
        </button>
      </div>
      
      {/* Bottom gradient overlay */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        background: "linear-gradient(to top, rgba(12,12,18,.4) 0%, transparent 100%)",
        pointerEvents: "none",
        opacity: hov ? 1 : 0,
        transition: "opacity .4s"
      }} />
    </div>
  );
}
