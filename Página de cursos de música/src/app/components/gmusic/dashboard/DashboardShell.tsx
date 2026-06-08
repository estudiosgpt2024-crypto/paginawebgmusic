import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  return (
    <main
      className={`w-full max-w-[1280px] px-5 sm:px-6 lg:px-8 pt-5 md:pt-7 pb-16 md:pb-24 ${className}`}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {children}
    </main>
  );
}
