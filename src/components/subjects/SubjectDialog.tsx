import { X } from "lucide-react";
import { useEffect } from "react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import type { Subject } from "@/data/subjects";

export function SubjectDialog({
  subject,
  selected,
  full,
  onClose,
  onToggle,
}: {
  subject: Subject;
  selected: boolean;
  full: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const blocked = !selected && full;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={subject.name}
    >
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="arcade-panel relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-b-none sm:rounded-b-lg">
        <div className="border-border bg-surface-2 flex items-start justify-between gap-3 border-b-2 p-4">
          <div>
            <p className="text-accent text-[0.65rem] tracking-wide uppercase">{subject.group}</p>
            <h3 className="font-display text-highlight mt-1.5 text-[0.75rem] leading-relaxed">
              {subject.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground shrink-0 rounded p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-5 text-sm leading-relaxed">
          <section className="flex flex-col gap-2">
            <h4 className="font-display text-accent text-[0.6rem] tracking-widest uppercase">
              What you&rsquo;d learn
            </h4>
            <p className="text-muted-foreground">{subject.learn}</p>
          </section>

          <section className="border-highlight/50 bg-surface-2 flex flex-col gap-2 rounded-md border-2 p-4">
            <h4 className="font-display text-highlight text-[0.6rem] tracking-widest uppercase">
              LCR connection
            </h4>
            <p className="text-muted-foreground">{subject.lcr}</p>
          </section>
        </div>

        <div className="border-border bg-surface-2 border-t-2 p-4">
          <ArcadeButton
            onClick={onToggle}
            disabled={blocked}
            variant={selected ? "ghost" : "primary"}
            className="w-full"
          >
            {selected
              ? "Remove from your four"
              : blocked
                ? "Your four slots are full"
                : "Add to your four"}
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}
