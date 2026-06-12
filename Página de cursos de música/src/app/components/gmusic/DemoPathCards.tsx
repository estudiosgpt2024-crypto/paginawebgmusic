import { useState, useRef, useEffect, type CSSProperties } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import type { PathNodeData } from "../../data/gmusic-path-types";

const WHITE_WARM = "#F5F0E8";
const GOLD = "#C9A84C";

const CARD_GRADIENTS: Record<number, string> = {
  1: "linear-gradient(160deg, #7a5810 0%, #C9A84C 100%)",
  2: "linear-gradient(160deg, #0d2040 0%, #1e4080 100%)",
  3: "linear-gradient(160deg, #0d2a1a 0%, #1a5030 100%)",
  4: "linear-gradient(160deg, #1e0d40 0%, #3a1a7a 100%)",
  5: "linear-gradient(160deg, #9a7010 0%, #e6c060 100%)",
};

function getLessonNumber(nodeId: string): number {
  const m = /^demo-node-(\d)$/.exec(nodeId);
  return m && m[1] ? parseInt(m[1], 10) : 1;
}

export interface DemoPathCardsProps {
  nodes: PathNodeData[];
  allowLockedSelection?: boolean;
  onStartLesson: (lessonNumber: number) => void;
  onLockedClick: (title: string) => void;
}

export function DemoPathCards({
  nodes,
  allowLockedSelection = false,
  onStartLesson,
  onLockedClick,
}: DemoPathCardsProps) {
  const initialFocus = Math.max(0, nodes.findIndex((n) => n.status === "active"));
  const [focusedIdx, setFocusedIdx] = useState(initialFocus);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRefs.current[focusedIdx];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [focusedIdx]);

  const goTo = (idx: number) => setFocusedIdx(Math.max(0, Math.min(nodes.length - 1, idx)));

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: 8 }}>
      {focusedIdx > 0 && (
        <button
          onClick={() => goTo(focusedIdx - 1)}
          aria-label="Clase anterior"
          style={arrowButtonStyle("left")}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <div
        ref={containerRef}
        className="gmusic-carousel"
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          padding: "20px 80px",
          alignItems: "center",
        }}
      >
        <style>{`.gmusic-carousel::-webkit-scrollbar { display: none; }`}</style>

        {nodes.map((node, i) => {
          const lessonNum = getLessonNumber(node.id);
          const isFocused = i === focusedIdx;
          const isCompleted = node.status === "completed";
          const isActive = node.status === "active";
          const isLocked = node.status === "locked";
          const gradient = CARD_GRADIENTS[lessonNum] ?? CARD_GRADIENTS[1];

          return (
            <motion.div
              key={node.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              animate={{
                scale: isFocused ? 1 : 0.82,
                opacity: isFocused ? 1 : isLocked ? 0.22 : 0.38,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => {
                if (!isFocused) {
                  goTo(i);
                  return;
                }
                if (isLocked) {
                  if (allowLockedSelection) onLockedClick(node.title);
                  return;
                }
                onStartLesson(lessonNum);
              }}
              style={{
                flexShrink: 0,
                width: 260,
                minHeight: 360,
                borderRadius: 16,
                background: gradient,
                border: isFocused
                  ? `2px solid ${isCompleted ? "rgba(76,175,80,0.6)" : "rgba(201,168,76,0.5)"}`
                  : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                padding: "24px 20px 20px",
                scrollSnapAlign: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: isFocused ? "0 16px 48px rgba(0,0,0,0.5)" : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -8,
                  right: 12,
                  fontSize: 100,
                  fontFamily: "'Playfair Display',serif",
                  color: "rgba(255,255,255,0.07)",
                  fontWeight: 700,
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {lessonNum}
              </div>

              <div style={{ marginBottom: 24, alignSelf: "flex-start" }}>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontFamily: "Inter,sans-serif",
                    color: isCompleted ? "#4CAF50" : isActive ? GOLD : "rgba(255,255,255,0.3)",
                    border: `1px solid ${isCompleted ? "rgba(76,175,80,0.4)" : isActive ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: 3,
                    padding: "3px 8px",
                  }}
                >
                  {isCompleted ? "Completada" : isActive ? "Disponible" : "Bloqueada"}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 20,
                    color: "rgba(255,255,255,0.95)",
                    fontWeight: 400,
                    lineHeight: 1.25,
                    marginBottom: 10,
                  }}
                >
                  {node.title}
                </div>
                {!isLocked && node.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "Inter,sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {node.description}
                  </div>
                )}
                {isLocked && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Inter,sans-serif",
                    }}
                  >
                    <Lock size={12} />
                    Completa la clase anterior
                  </div>
                )}
                {node.duration && !isLocked && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "Inter,sans-serif",
                      marginTop: 8,
                      letterSpacing: "0.8px",
                    }}
                  >
                    {node.duration}
                  </div>
                )}
              </div>

              {isFocused && !isLocked && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartLesson(lessonNum);
                  }}
                  style={{
                    marginTop: 20,
                    width: "100%",
                    height: 44,
                    borderRadius: 8,
                    background: isCompleted
                      ? "rgba(76,175,80,0.15)"
                      : "rgba(255,255,255,0.12)",
                    border: `1px solid ${isCompleted ? "rgba(76,175,80,0.45)" : "rgba(255,255,255,0.25)"}`,
                    color: isCompleted ? "#4CAF50" : WHITE_WARM,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "Inter,sans-serif",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {isCompleted ? "Repetir" : "Entrar"}
                </motion.button>
              )}

              <div
                style={{
                  marginTop: 16,
                  height: 3,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    height: "100%",
                    background: isCompleted ? "#4CAF50" : GOLD,
                    borderRadius: 2,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {focusedIdx < nodes.length - 1 && (
        <button
          onClick={() => goTo(focusedIdx + 1)}
          aria-label="Clase siguiente"
          style={arrowButtonStyle("right")}
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 4,
          paddingBottom: 8,
        }}
      >
        {nodes.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === focusedIdx ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === focusedIdx ? GOLD : "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function arrowButtonStyle(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    [side]: 16,
    top: "50%",
    transform: "translateY(-60%)",
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  };
}
