import { Quote } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

export interface QuoteCardProps {
  quote: string;
  label?: string;
  className?: string;
}

export function QuoteCard({
  quote,
  label = "Frase del día",
  className = "flex flex-col justify-between lg:col-span-4",
}: QuoteCardProps) {
  return (
    <PremiumCard
      className={className}
      padding="32px 30px"
      style={{
        background:
          "linear-gradient(155deg, rgba(24,20,13,0.95) 0%, rgba(14,13,11,0.98) 50%, #0d0d0d 100%)",
        border: "1.5px solid rgba(201,168,76,0.12)",
        borderRadius: 20,
      }}
    >
      <div>
        <Quote className="w-8 h-8 mb-5 opacity-90 text-[#C9A84C]" strokeWidth={1.25} />
        <p
          className="text-xl md:text-[1.45rem] leading-[1.5] italic font-medium font-serif"
          style={{
            color: "rgba(255,255,255,0.95)",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          “{quote}”
        </p>
      </div>
      <p
        className="text-[10px] uppercase tracking-[0.2em] mt-6 font-bold"
        style={{ color: "rgba(201,168,76,0.55)" }}
      >
        {label}
      </p>
    </PremiumCard>
  );
}
