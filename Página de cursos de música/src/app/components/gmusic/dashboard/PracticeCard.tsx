import { ChevronRight } from "lucide-react";
import { ChunkyButton } from "./ChunkyButton";
import { PremiumCard } from "./PremiumCard";

export interface PracticeCardProps {
  title: string;
  typeLabel: string;
  description: string;
  onContinue: () => void;
}

export function PracticeCard({ title, typeLabel, description, onContinue }: PracticeCardProps) {
  return (
    <PremiumCard
      accent
      className="w-full"
      padding="40px 48px"
      style={{
        borderRadius: 24,
        background:
          "linear-gradient(135deg, rgba(28,24,14,0.98) 0%, rgba(16,14,10,0.99) 50%, rgba(10,10,10,1) 100%)",
        border: "1.5px solid rgba(201, 168, 76, 0.35)",
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(201, 168, 76, 0.05) inset, 0 1px 0 rgba(201, 168, 76, 0.1) inset",
      }}
    >
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <p
          className="text-[10px] uppercase tracking-[0.25em] mb-4 font-bold"
          style={{ color: "rgba(201, 168, 76, 0.65)" }}
        >
          Próxima práctica
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold mb-3 leading-tight text-white font-serif">
          {title}
        </h2>
        <p className="text-sm font-semibold mb-4 text-[#C9A84C]">{typeLabel}</p>
        <p className="text-[15px] leading-relaxed mb-8 text-zinc-300">{description}</p>
        <ChunkyButton onClick={onContinue} icon={<ChevronRight className="h-5 w-5 shrink-0" />}>
          Continuar mi Camino
        </ChunkyButton>
      </div>
    </PremiumCard>
  );
}
