import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PixelHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display pixel-shadow text-highlight text-sm leading-relaxed uppercase sm:text-base",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
