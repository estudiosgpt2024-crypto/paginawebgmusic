import type { PathLane } from "../../../data/gmusic-path-data";

const NODE_X: Record<PathLane, number> = { left: 56, center: 186, right: 316 };

interface PathConnectorProps {
  from: PathLane;
  to: PathLane;
  lit: boolean;
}

function buildPath(from: PathLane, to: PathLane): string {
  const x1 = NODE_X[from];
  const x2 = NODE_X[to];
  return `M ${x1} 4 C ${x1} 32, ${x2} 32, ${x2} 64`;
}

export function PathConnector({ from, to, lit }: PathConnectorProps) {
  const d = buildPath(from, to);

  return (
    <svg
      viewBox="0 0 372 68"
      className="absolute left-0 w-full pointer-events-none"
      style={{ top: 36, height: 68, zIndex: 0 }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="rgba(255, 255, 255, 0.04)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={lit ? "rgba(212, 175, 55, 0.22)" : "rgba(212, 175, 55, 0.06)"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { NODE_X };
