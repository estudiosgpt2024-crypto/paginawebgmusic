import type { ReactNode } from "react";

interface DashboardSectionProps {
  children: ReactNode;
  className?: string;
}

export function DashboardSection({ children, className = "" }: DashboardSectionProps) {
  return <section className={`w-full ${className}`}>{children}</section>;
}
