import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ArcadeFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="crt-lines pointer-events-none fixed inset-0 z-50 opacity-60" aria-hidden />
      <div className={cn("relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6", className)}>
        {children}
      </div>
    </div>
  );
}
