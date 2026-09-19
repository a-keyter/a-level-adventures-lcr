import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-primary text-primary-foreground border-primary/40 shadow-[0_5px_0_0_color-mix(in_oklch,var(--color-primary)_55%,black)]",
  accent:
    "bg-accent text-accent-foreground border-accent/40 shadow-[0_5px_0_0_color-mix(in_oklch,var(--color-accent)_55%,black)]",
  ghost:
    "bg-surface-2 text-foreground border-border shadow-[0_5px_0_0_color-mix(in_oklch,var(--color-background)_80%,black)]",
} as const;

const sizes = {
  sm: "px-3 py-2 text-[0.6rem]",
  md: "px-5 py-3 text-[0.7rem]",
  lg: "px-7 py-4 text-xs",
} as const;

export function ArcadeButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "font-display inline-flex items-center justify-center gap-2 rounded-md border-2 uppercase tracking-wider",
        "transition-transform duration-100 active:translate-y-[5px] active:shadow-none",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
    />
  );
}
