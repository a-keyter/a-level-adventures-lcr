import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubjectSlots({
  chosen,
  onRemove,
}: {
  chosen: string[];
  onRemove?: (name: string) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[0, 1, 2, 3].map((slot) => {
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
              {name ?? (slot === 3 ? "Slot 4 (optional)" : `Slot ${slot + 1}`)}
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
