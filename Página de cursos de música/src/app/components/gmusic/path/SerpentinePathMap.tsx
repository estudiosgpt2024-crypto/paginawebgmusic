import { useEffect, useRef } from "react";
import { PATH_MODULES, ACTIVE_NODE_ID, type PathNodeData } from "../../../data/gmusic-path-data";
import { PathModuleDivider } from "./PathModuleDivider";
import { PathNode } from "./PathNode";
import { PathConnector } from "./PathConnector";
import { LevelingChallengeButton } from "./LevelingChallengeButton";

interface SerpentinePathMapProps {
  onLevelingChallenge: () => void;
  onNodeSelect?: (node: PathNodeData) => void;
}

export function SerpentinePathMap({ onLevelingChallenge, onNodeSelect }: SerpentinePathMapProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative max-w-lg mx-auto px-1 sm:px-4 pb-8">
      {PATH_MODULES.map((mod, modIdx) => {
        const completedInModule = mod.nodes.filter((n) => n.status === "completed").length;

        return (
          <div key={mod.id}>
            <PathModuleDivider
              index={mod.index}
              title={mod.title}
              focus={mod.focus}
              completedInModule={completedInModule}
              totalInModule={mod.nodes.length}
            />
            <div className="relative">
              {mod.nodes.map((node, i) => {
                const next = mod.nodes[i + 1];
                const lit = node.status === "completed" || node.status === "active";
                const isActiveNode = node.id === ACTIVE_NODE_ID;

                return (
                  <div
                    key={node.id}
                    ref={isActiveNode ? activeRef : undefined}
                    className="relative"
                    style={{ zIndex: 1 }}
                  >
                    {next && <PathConnector from={node.lane} to={next.lane} lit={lit && node.status === "completed"} />}
                    <PathNode node={node} stepIndex={i + 1} onSelect={onNodeSelect} />
                  </div>
                );
              })}
            </div>
            {modIdx === PATH_MODULES.length - 1 && (
              <LevelingChallengeButton onClick={onLevelingChallenge} />
            )}
          </div>
        );
      })}
    </div>
  );
}
