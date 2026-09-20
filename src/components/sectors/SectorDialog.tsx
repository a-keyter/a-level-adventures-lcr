import { X } from "lucide-react";
import { useEffect } from "react";
import type { SectorOverlap } from "@/data/lsip-sectors";

export function SectorDialog({
  overlap,
  onClose,
}: {
  overlap: SectorOverlap;
  onClose: () => void;
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

  const { sector, matches, points } = overlap;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={sector.name}
    >
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="arcade-panel relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-b-none sm:rounded-b-lg">
        <div className="border-border bg-surface-2 flex items-start justify-between gap-3 border-b-2 p-4">
          <div>
            <p className="text-accent text-[0.65rem] tracking-wide uppercase">
              {points} {points === 1 ? "overlap point" : "overlap points"}
            </p>
            <h3 className="font-display text-highlight mt-1.5 text-[0.75rem] leading-relaxed">
              {sector.name}
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

        <div className="flex flex-col gap-5 overflow-y-auto p-5 text-sm leading-relaxed">
          <p className="text-muted-foreground">{sector.blurb}</p>

          {matches.length === 0 ? (
            <p className="border-border bg-surface-2 text-muted-foreground rounded-md border-2 p-4">
              None of your four subjects line up directly with this sector&rsquo;s roles — which
              doesn&rsquo;t rule it out, but the roles below show what employers here are asking
              for.
            </p>
          ) : null}

          <section className="flex flex-col gap-3">
            <h4 className="font-display text-accent text-[0.6rem] tracking-widest uppercase">
              Roles in this sector
            </h4>
            {sector.roles.map((role) => {
              const matched =
                matches.find((match) => match.role.title === role.title)?.subjects ?? [];
              return (
                <article
                  key={role.title}
                  className={
                    matched.length
                      ? "border-highlight/60 bg-surface-2 rounded-md border-2 p-4"
                      : "border-border bg-surface rounded-md border-2 p-4 opacity-70"
                  }
                >
                  <h5 className="text-foreground font-semibold">{role.title}</h5>
                  <p className="text-muted-foreground mt-0.5 text-xs uppercase">{role.level}</p>
                  <p className="text-muted-foreground mt-2">{role.what}</p>
                  {matched.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {matched.map((subject) => (
                        <span
                          key={subject}
                          className="border-highlight bg-primary text-primary-foreground rounded border-2 px-2 py-1 text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-3 text-xs">
                      No overlap with your four.
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}
