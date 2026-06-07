
const GUITAR_IMG = "https://images.unsplash.com/photo-1522008224169-e5992bed5fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

// Gold particle data — positions & animation params defined once (no random on render)
const PARTICLES = [
  { x: 8,  y: 12, size: 1.8, dur: 18, delay: 0,   opacity: 0.35 },
  { x: 23, y: 45, size: 1.2, dur: 24, delay: 3,   opacity: 0.25 },
  { x: 67, y: 8,  size: 2.2, dur: 20, delay: 6,   opacity: 0.3  },
  { x: 82, y: 33, size: 1.4, dur: 28, delay: 1,   opacity: 0.2  },
  { x: 14, y: 68, size: 1.6, dur: 22, delay: 9,   opacity: 0.28 },
  { x: 91, y: 72, size: 1.0, dur: 16, delay: 4,   opacity: 0.22 },
  { x: 45, y: 85, size: 2.0, dur: 26, delay: 11,  opacity: 0.32 },
  { x: 55, y: 22, size: 1.3, dur: 19, delay: 7,   opacity: 0.2  },
  { x: 76, y: 56, size: 1.7, dur: 23, delay: 2,   opacity: 0.26 },
  { x: 33, y: 90, size: 1.1, dur: 30, delay: 14,  opacity: 0.18 },
  { x: 5,  y: 37, size: 1.5, dur: 21, delay: 5,   opacity: 0.24 },
  { x: 62, y: 63, size: 2.4, dur: 25, delay: 8,   opacity: 0.15 },
  { x: 89, y: 18, size: 1.2, dur: 17, delay: 12,  opacity: 0.28 },
  { x: 40, y: 50, size: 1.0, dur: 27, delay: 0.5, opacity: 0.16 },
  { x: 18, y: 78, size: 1.9, dur: 29, delay: 16,  opacity: 0.22 },
  { x: 71, y: 40, size: 1.3, dur: 20, delay: 3.5, opacity: 0.19 },
  { x: 50, y: 5,  size: 1.6, dur: 24, delay: 10,  opacity: 0.3  },
  { x: 95, y: 88, size: 1.1, dur: 18, delay: 13,  opacity: 0.17 },
];

export function AmbientBackground() {
  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-60px) translateX(8px); opacity: 0; }
        }
        @keyframes floatDrift {
          0%   { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
          15%  { opacity: 1; }
          50%  { transform: translateY(-30px) translateX(-6px) scale(1.2); }
          85%  { opacity: 1; }
          100% { transform: translateY(-55px) translateX(4px) scale(0.8); opacity: 0; }
        }
      `}</style>

      {/* Layer 1: Radial gradient base */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 60% at 50% 20%, #161410 0%, #0a0a0a 45%, #050505 100%),
          radial-gradient(ellipse 40% 50% at 20% 80%, #0f0d08 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 70%, #0d0c08 0%, transparent 55%)
        `,
      }} />

      {/* Layer 2: Guitar strings photo — blurred overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `url(${GUITAR_IMG})`,
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        filter: "blur(10px) grayscale(100%)",
        opacity: 0.045,
        mixBlendMode: "overlay",
        transform: "scale(1.05)", // prevents blur edges from showing
      }} />

      {/* Layer 3: Vignette — darkens edges */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
      }} />

      {/* Layer 4: Subtle horizontal light band */}
      <div style={{
        position: "fixed", top: "28%", left: 0, right: 0, zIndex: 0, pointerEvents: "none",
        height: 240,
        background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(201,168,76,0.025) 0%, transparent 70%)",
      }} />

      {/* Layer 5: Floating gold particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#C9A84C",
              opacity: p.opacity,
              animation: `${i % 2 === 0 ? "floatUp" : "floatDrift"} ${p.dur}s ${p.delay}s infinite ease-in-out`,
              boxShadow: `0 0 ${p.size * 2}px rgba(201,168,76,0.6)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
