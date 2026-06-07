import { useState } from "react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const GOLD = "#C9A84C";
const WHITE_WARM = "#F5F0E8";
const BORDER = "rgba(255,255,255,0.06)";

// Simula 8 semanas de progreso real vs ideal (3x/semana = 100% disciplina)
const buildData = (streak: number) => {
  return Array.from({ length: 9 }, (_, week) => {
    const ideal = Math.min(100, week * 12.5);
    const real = week === 0 ? 0 : Math.min(100, (week - 1) * 10 + (week <= 6 ? week * 2.5 : 8));
    return { week: `Sem ${week}`, ideal: Math.round(ideal), real: Math.round(real) };
  });
};

interface Student {
  streak: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(17,17,17,0.95)", border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: 3, padding: "10px 14px",
      }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Inter,sans-serif", marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: p.color }} />
            <span style={{ fontSize: 12, color: WHITE_WARM, fontFamily: "Inter,sans-serif" }}>
              {p.name}: <strong>{p.value}%</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CaminoPotencial({ student }: { student: Student }) {
  const data = buildData(student.streak);
  const currentReal = data[data.length - 3].real;
  const currentIdeal = data[data.length - 3].ideal;
  const gap = currentIdeal - currentReal;

  return (
    <div style={{
      background: "#111", border: `1px solid ${BORDER}`,
      borderRadius: 4, padding: "24px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 16, height: 1, background: GOLD, opacity: 0.5 }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>
              Tu camino potencial
            </span>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: WHITE_WARM, margin: 0, fontWeight: 400, letterSpacing: "-0.5px" }}>
            Dónde podrías estar
            <span style={{ color: "rgba(245,240,232,0.35)", fontWeight: 300 }}> si practicas 3×/semana</span>
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif", marginBottom: 4 }}>Brecha actual</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: gap > 20 ? "#E8836A" : GOLD }}>
            {gap}%
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif" }}>
            {gap > 20 ? "Puedes recuperarlo" : "Vas muy bien"}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="cp-gradIdeal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={GOLD} stopOpacity={0.12} />
              <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cp-gradReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6A9AE8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6A9AE8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis key="xaxis" dataKey="week" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif" }} axisLine={false} tickLine={false} />
          <YAxis key="yaxis" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)", fontFamily: "Inter,sans-serif" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip key="tooltip" content={<CustomTooltip />} />
          <Area key="area-ideal" type="monotone" dataKey="ideal" stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 3" fill="url(#cp-gradIdeal)" name="Potencial" dot={false} />
          <Area key="area-real" type="monotone" dataKey="real" stroke="#6A9AE8" strokeWidth={2} fill="url(#cp-gradReal)" name="Tu avance" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 20, height: 2, background: GOLD, borderRadius: 1, opacity: 0.7, borderTop: "1px dashed" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif" }}>Potencial (3×/semana)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 20, height: 2, background: "#6A9AE8", borderRadius: 1 }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Inter,sans-serif" }}>Tu avance real</span>
        </div>
      </div>

      {gap > 20 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 16, padding: "12px 16px",
            background: "rgba(232,131,106,0.06)", border: "1px solid rgba(232,131,106,0.2)",
            borderRadius: 3, display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, color: "rgba(232,131,106,0.85)", fontFamily: "Inter,sans-serif", lineHeight: 1.5 }}>
            Practicar 3 veces esta semana te acerca <strong>{Math.round(gap / 2)}%</strong> a tu potencial.
          </span>
        </motion.div>
      )}
    </div>
  );
}
