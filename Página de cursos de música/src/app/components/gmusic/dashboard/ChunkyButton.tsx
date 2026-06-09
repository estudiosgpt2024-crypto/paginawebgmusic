import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./dashboard-depth.css";

type ChunkyButtonVariant = "premium";

interface ChunkyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
  variant?: ChunkyButtonVariant;
}

export function ChunkyButton({
  children,
  icon,
  isLoading = false,
  disabled,
  variant = "premium",
  className = "",
  ...props
}: ChunkyButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      data-variant={variant}
      className={`chunky-btn ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="chunky-btn__spinner" aria-hidden="true" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon}
        </>
      )}
    </button>
  );
}
