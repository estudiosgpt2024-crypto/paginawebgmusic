import { motion } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

interface Student {
  name: string;
  avatar: null | string;
  level: string;
  month: number;
  streak: number;
  xp: number;
}

export function ProfileHeader({ student }: { student: Student }) {
  const initials = student.name.split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <div style={{
      background: "#111", border: `1px solid ${BORDER}`,
      borderRadius: 4, padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        {/* Avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: 4,
          background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: GOLD, fontWeight: 400 }}>
            {initials}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: WHITE_WARM, fontWeight: 400 }}>
            {student.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(201,168,76,0.7)", fontFamily: "Inter,sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginTop: 3 }}>
            {student.level} · Mes {student.month}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {/* Racha */}
        <div style={{
          background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: 3, padding: "12px 14px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>🔥</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: GOLD }}>{student.streak}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>días racha</div>
        </div>

        {/* XP */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`,
          borderRadius: 3, padding: "12px 14px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>⚡</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: WHITE_WARM }}>{student.xp.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>XP total</div>
        </div>

        {/* Nivel */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`,
          borderRadius: 3, padding: "12px 14px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>🎸</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: WHITE_WARM }}>Nv. 1</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>Guitarra</div>
        </div>
      </div>

      {/* Streak bar visual */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
          Esta semana
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
            <div key={day} style={{ flex: 1, textAlign: "center" }}>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                style={{
                  height: 28, borderRadius: 2,
                  background: i < 5 ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.05)",
                  border: i < 5 ? "1px solid rgba(201,168,76,0.4)" : `1px solid rgba(255,255,255,0.04)`,
                  transformOrigin: "bottom",
                }}
              />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif", marginTop: 4 }}>{day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
