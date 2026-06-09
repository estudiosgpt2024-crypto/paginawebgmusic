import { ChevronRight } from "lucide-react";
import { ChunkyButton } from "./ChunkyButton";
import { PremiumCard } from "./PremiumCard";

export interface CompletedPathCardProps {
  onViewPath: () => void;
}

export function CompletedPathCard({ onViewPath }: CompletedPathCardProps) {
  return (
    <PremiumCard
      accent
      className="w-full"
      padding="40px 48px"
      style={{
        borderRadius: 24,
        background:
          "linear-gradient(135deg, rgba(28,24,14,0.98) 0%, rgba(16,14,10,0.99) 50%, rgba(10,10,10,1) 100%)",
        border: "1.5px solid rgba(201, 168, 76, 0.22)",
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(201, 168, 76, 0.05) inset, 0 1px 0 rgba(201, 168, 76, 0.1) inset",
      }}
    >
      <div className="flex w-full flex-col items-center text-center">
        <p
          className="text-[10px] uppercase tracking-[0.25em] mb-4 font-bold"
          style={{ color: "rgba(201, 168, 76, 0.65)" }}
        >
          Próxima práctica
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold mb-3 leading-tight text-white font-serif">
          Camino completado
        </h2>
        <p className="text-sm font-semibold mb-4 text-[#C9A84C]">Sin nodos pendientes por ahora</p>
        <p className="text-[15px] leading-relaxed mb-8 text-zinc-400">
          Has completado todos los nodos disponibles en tu camino actual. Puedes revisar tu progreso
          cuando quieras.
        </p>
        <ChunkyButton onClick={onViewPath} icon={<ChevronRight className="h-5 w-5 shrink-0" />}>
          Ver mi Camino
        </ChunkyButton>
      </div>
    </PremiumCard>
  );
}
