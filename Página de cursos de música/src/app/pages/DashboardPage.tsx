import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProfileHeader } from "../components/dashboard/ProfileHeader";
import { ProgressBlock } from "../components/dashboard/ProgressBlock";
import { DisciplinePhrase } from "../components/dashboard/DisciplinePhrase";
import { CaminoPotencial } from "../components/dashboard/CaminoPotencial";
import { CofreVirtual } from "../components/dashboard/CofreVirtual";
import { RankingWidget } from "../components/dashboard/RankingWidget";
import { VideollamadaWidget } from "../components/dashboard/VideollamadaWidget";
import { VideoPlayer } from "../components/dashboard/VideoPlayer";
import { GOLD, WHITE_WARM, BORDER } from "../components/marketing/tokens";

// Mock student data
const STUDENT = {
  name: "Carlos M.",
  avatar: null,
  level: "Fundamento",
  month: 2,
  streak: 11,
  xp: 1240,
  weeklyExercisesDone: 4,
  weeklyExercisesTotal: 5,
  modules: [
    { title: "Postura y afinación", progress: 100, done: true },
    { title: "Acordes abiertos", progress: 100, done: true },
    { title: "Cambio de acordes", progress: 72, done: false },
    { title: "Rasgueo básico", progress: 30, done: false },
    { title: "Primera canción", progress: 0, done: false },
  ],
  ranking: 4,
  totalStudents: 38,
  criticalDrop: false,
  highScore: true,
};

interface DashboardPageProps {
  setPage: (page: string) => void;
}

export function DashboardPage({ setPage }: DashboardPageProps) {
  const [cofreOpen, setCofreOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: WHITE_WARM }}>
      {/* Top bar */}
      <div style={{
        height: 56, borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,8,8,0.92)", backdropFilter: "blur(12px)",
      }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: WHITE_WARM }}>
          Gmusic <span style={{ color: GOLD, fontWeight: 400 }}>Estudio</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "Inter,sans-serif" }}>
            {STUDENT.level} · Mes {STUDENT.month}
          </span>
          <button
            onClick={() => setPage("home")}
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.35)",
              fontSize: 12, cursor: "pointer", fontFamily: "Inter,sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 80px" }}>
        {/* Row 1: Profile + Discipline phrase */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <ProfileHeader student={STUDENT} />
          <DisciplinePhrase />
        </div>

        {/* Row 2: Progress + Video player */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>
          <ProgressBlock student={STUDENT} onCofreOpen={() => setCofreOpen(true)} />
          <VideoPlayer setPage={setPage} />
        </div>

        {/* Row 3: Camino potencial full width */}
        <div style={{ marginBottom: 20 }}>
          <CaminoPotencial student={STUDENT} />
        </div>

        {/* Row 4: Ranking + Videollamada */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <RankingWidget student={STUDENT} />
          <VideollamadaWidget student={STUDENT} />
        </div>
      </div>

      <AnimatePresence>
        {cofreOpen && <CofreVirtual onClose={() => setCofreOpen(false)} xp={80} />}
      </AnimatePresence>
    </div>
  );
}
