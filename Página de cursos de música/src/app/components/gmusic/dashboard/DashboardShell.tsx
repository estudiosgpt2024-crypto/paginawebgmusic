import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  return (
    <main className={`dashboard-shell pt-5 md:pt-7 pb-16 md:pb-24 ${className}`}>
      {children}
    </main>
  );
}
