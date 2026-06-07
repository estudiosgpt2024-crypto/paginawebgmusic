import { motion } from "motion/react";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

const MOCK_RANKING = [
  { name: "Ana V.", xp: 2140, streak: 22, position: 1 },
  { name: "Marcos R.", xp: 1890, streak: 18, position: 2 },
  { name: "Sofía L.", xp: 1560, streak: 14, position: 3 },
  { name: "Carlos M.", xp: 1240, streak: 11, position: 4, isMe: true },
  { name: "Diego P.", xp: 1180, streak: 9, position: 5 },
  { name: "Lucía T.", xp: 950, streak: 7, position: 6 },
];

interface Student {
  ranking: number;
  totalStudents: number;
  name: string;
}

export function RankingWidget({ student }: { student: Student }) {
  return (
    <div style={{
      background: "#111", border: `1px solid ${BORDER}`,
      borderRadius: 4, padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 1, background: GOLD, opacity: 0.5 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>
            Ranking · Esta semana
          </span>
        </div>
        <div style={{
          background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 2, padding: "3px 10px",
          fontSize: 11, color: GOLD, fontFamily: "Inter,sans-serif", fontWeight: 600,
        }}>
          #{student.ranking} de {student.totalStudents}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {MOCK_RANKING.map((user, i) => (
          <motion.div
            key={user.position}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
              borderRadius: 2,
              background: user.isMe ? "rgba(201,168,76,0.06)" : "transparent",
              border: `1px solid ${user.isMe ? "rgba(201,168,76,0.2)" : "transparent"}`,
            }}
          >
            {/* Position */}
            <div style={{
              width: 22, textAlign: "center",
              fontSize: user.position <= 3 ? 14 : 11,
              color: user.position === 1 ? "#FFD700" : user.position === 2 ? "#C0C0C0" : user.position === 3 ? "#CD7F32" : "rgba(255,255,255,0.2)",
              fontFamily: "Inter,sans-serif", fontWeight: 600,
            }}>
              {user.position <= 3 ? ["🥇", "🥈", "🥉"][user.position - 1] : user.position}
            </div>

            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: 2, flexShrink: 0,
              background: user.isMe ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${user.isMe ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: user.isMe ? GOLD : "rgba(255,255,255,0.3)",
              fontFamily: "Inter,sans-serif", fontWeight: 600,
            }}>
              {user.name.split(" ").map(w => w[0]).join("")}
            </div>

            <span style={{
              flex: 1, fontSize: 12, fontFamily: "Inter,sans-serif",
              color: user.isMe ? WHITE_WARM : "rgba(255,255,255,0.5)",
              fontWeight: user.isMe ? 600 : 400,
            }}>
              {user.name} {user.isMe && <span style={{ fontSize: 10, color: "rgba(201,168,76,0.5)" }}>(tú)</span>}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif" }}>🔥{user.streak}</span>
              <span style={{ fontSize: 11, color: user.isMe ? GOLD : "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", fontWeight: user.isMe ? 600 : 400 }}>
                {user.xp.toLocaleString()} xp
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <button style={{
        marginTop: 16, width: "100%", height: 36,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`,
        borderRadius: 2, color: "rgba(255,255,255,0.35)", cursor: "pointer",
        fontSize: 11, fontFamily: "Inter,sans-serif", letterSpacing: "0.5px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; e.currentTarget.style.color = GOLD; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Ver foro de la comunidad
      </button>
    </div>
  );
}
