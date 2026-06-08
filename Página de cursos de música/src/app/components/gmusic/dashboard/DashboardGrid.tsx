import type { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}

export function DashboardGrid({ children, className = "" }: DashboardGridProps) {
  return (
    <section className={`grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 ${className}`}>
      {children}
    </section>
  );
}
