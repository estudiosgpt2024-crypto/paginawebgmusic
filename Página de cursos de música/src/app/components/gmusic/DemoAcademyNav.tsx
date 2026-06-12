import { Home, Map, GraduationCap, BarChart2 } from "lucide-react";

const GOLD = "#C9A84C";

type DemoTab = "inicio" | "mi-camino" | "mi-estudio" | "mi-progreso";

interface DemoAcademyNavProps {
  activeTab: DemoTab;
  completedCount: number;
  onTabChange: (tab: DemoTab) => void;
}

const TABS = [
  { id: "inicio" as DemoTab, label: "Inicio", Icon: Home },
  { id: "mi-camino" as DemoTab, label: "Mi Camino", Icon: Map },
  { id: "mi-estudio" as DemoTab, label: "Mi Estudio", Icon: GraduationCap },
  { id: "mi-progreso" as DemoTab, label: "Mi Progreso", Icon: BarChart2 },
] as const;

export function DemoAcademyNav({ activeTab, completedCount, onTabChange }: DemoAcademyNavProps) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.98)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        const showBadge = id === "mi-progreso" && completedCount > 0;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "14px 24px",
              background: "transparent",
              border: "none",
              borderBottom: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
              color: isActive ? GOLD : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "color 0.2s",
              fontFamily: "Inter,sans-serif",
              minWidth: 80,
            }}
          >
            <Icon size={18} />
            <span style={{ fontSize: 10, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              {label}
            </span>
            {showBadge && (
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 12,
                  fontSize: 9,
                  fontWeight: 700,
                  color: GOLD,
                  fontFamily: "Inter,sans-serif",
                  background: "rgba(201,168,76,0.15)",
                  borderRadius: 8,
                  padding: "1px 5px",
                }}
              >
                {completedCount}/5
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
