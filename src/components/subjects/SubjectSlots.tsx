import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubjectSlots({
  chosen,
  onRemove,
  required = 3,
  total = 4,
  slotLabel = "Slot",
}: {
  chosen: string[];
  onRemove?: (name: string) => void;
  /** Slots beyond this number are labelled as optional. */
  required?: number;
  total?: number;
  slotLabel?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-2", total >= 4 && "sm:grid-cols-4")}>
      {Array.from({ length: total }, (_, slot) => {
        const name = chosen[slot];
        return (
          <li
            key={slot}
            className={cn(
              "arcade-inset flex min-h-12 items-center justify-between gap-2 px-3 py-2 text-xs",
              name ? "border-highlight/70 text-foreground" : "text-muted-foreground",
            )}
          >
            <span className="truncate">
              {name ?? `${slotLabel} ${slot + 1}${slot >= required ? " (optional)" : ""}`}
            </span>
            {name && onRemove ? (
              <button
                type="button"
                onClick={() => onRemove(name)}
                aria-label={`Remove ${name}`}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
