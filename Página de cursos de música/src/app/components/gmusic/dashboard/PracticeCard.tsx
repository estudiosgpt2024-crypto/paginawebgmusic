import { ChevronRight } from "lucide-react";
import { ChunkyButton } from "./ChunkyButton";
import { PremiumCard } from "./PremiumCard";

export interface PracticeCardProps {
  title: string;
  typeLabel: string;
  description: string;
  onContinue: () => void;
  isLoading?: boolean;
}

export function PracticeCard({
  title,
  typeLabel,
  description,
  onContinue,
  isLoading = false,
}: PracticeCardProps) {
  return (
    <PremiumCard
      accent
      elevation="raised"
      className="w-full"
      padding="40px 48px"
    >
      <div className="flex w-full flex-col items-center text-center">
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
        <ChunkyButton
          onClick={onContinue}
          isLoading={isLoading}
          disabled={isLoading}
          icon={<ChevronRight className="h-5 w-5 shrink-0" />}
        >
          Continuar mi Camino
        </ChunkyButton>
      </div>
    </PremiumCard>
  );
}
