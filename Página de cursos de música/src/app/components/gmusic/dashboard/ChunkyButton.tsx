import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ChunkyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function ChunkyButton({
  children,
  icon,
  isLoading = false,
  disabled,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ChunkyButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={`inline-flex min-h-[58px] items-center justify-center gap-3 rounded-[14px] px-10 text-[15px] font-bold transition-[transform,box-shadow,background-color,filter] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C97A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] active:translate-y-[3px] active:shadow-[0_0_0_#8E722A,0_8px_24px_rgba(201,168,76,0.18)] disabled:pointer-events-none disabled:opacity-55 md:px-12 ${className}`}
      style={{
        background: isDisabled ? "rgba(201,168,76,0.45)" : "#C9A84C",
        color: "#0A0A0A",
        boxShadow:
          "0 4px 0 #8E722A, 0 16px 34px rgba(201,168,76,0.24), 0 1px 0 rgba(255,255,255,0.22) inset",
        ...style,
      }}
      onMouseEnter={(event) => {
        if (!isDisabled) event.currentTarget.style.background = "#DAB955";
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!isDisabled) event.currentTarget.style.background = "#C9A84C";
        onMouseLeave?.(event);
      }}
      {...props}
    >
      <span>{isLoading ? "Cargando..." : children}</span>
      {!isLoading && icon}
    </button>
  );
}
