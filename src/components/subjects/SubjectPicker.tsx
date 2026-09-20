import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { SubjectSlots } from "@/components/subjects/SubjectSlots";
import { SubjectDialog } from "@/components/subjects/SubjectDialog";
import { cn } from "@/lib/utils";

export function SubjectPicker({
  onSubmit,
  submitting,
}: {
  onSubmit: (subjects: string[]) => void;
  submitting: boolean;
}) {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);
  const [open, setOpen] = useState<Subject | null>(null);

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const map = new Map<string, Subject[]>();
    for (const subject of SUBJECTS) {
      if (needle && !subject.name.toLowerCase().includes(needle)) continue;
      const list = map.get(subject.group) ?? [];
      list.push(subject);
      map.set(subject.group, list);
    }
    return Array.from(map.entries());
  }, [query]);

  const toggle = (name: string) => {
    setChosen((current) => {
      if (current.includes(name)) return current.filter((s) => s !== name);
      if (current.length >= 4) return current;
      return [...current, name];
    });
  };

  const full = chosen.length === 4;

  return (
    <div className="flex flex-col gap-6 pb-40">
      <div className="arcade-panel p-5 sm:p-6">
        <PixelHeading as="h2">Choose your four</PixelHeading>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Pick the four A levels you are studying, or thinking about studying, at a Liverpool City
          Region college or sixth form. Your party of four decides which adventures unlock.
        </p>

        <div className="relative mt-5">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subjects..."
            aria-label="Search A level subjects"
            className="arcade-inset focus-visible:ring-ring h-12 w-full pr-10 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="text-muted-foreground px-1 text-sm">
          No subjects match “{query}”. Try a shorter word.
        </p>
      ) : null}

      <div className="flex flex-col gap-6">
        {grouped.map(([group, names]) => (
          <section key={group}>
            <h3 className="font-display text-accent mb-3 text-[0.6rem] tracking-widest uppercase">
              {group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {names.map((name) => {
                const selected = chosen.includes(name);
                const blocked = !selected && full;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggle(name)}
                    disabled={blocked}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border-2 px-3 py-2.5 text-left text-sm transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                      selected
                        ? "border-highlight bg-primary text-primary-foreground"
                        : "border-border bg-surface hover:border-accent hover:bg-surface-2",
                      blocked && "cursor-not-allowed opacity-40 hover:border-border",
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t-2 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <SubjectSlots chosen={chosen} onRemove={toggle} />
          <ArcadeButton
            type="button"
            size="md"
            disabled={!full || submitting}
            onClick={() => onSubmit(chosen)}
            className="w-full"
          >
            {submitting ? "Generating..." : full ? "Begin adventure" : `Pick ${4 - chosen.length} more`}
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}
