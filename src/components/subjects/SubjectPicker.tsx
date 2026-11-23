import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { SubjectSlots } from "@/components/subjects/SubjectSlots";
import { SubjectDialog } from "@/components/subjects/SubjectDialog";
import { cn } from "@/lib/utils";

const NO_SUBJECTS: string[] = [];
const DEFAULT_STEPS = ["Pick 3 or 4 subjects", "Build your party", "Unlock your quests"];

export function SubjectPicker({
  onSubmit,
  submitting,
  initialChosen = [],
  min = 3,
  max = 4,
  exclude = NO_SUBJECTS,
  title = "Choose your subjects",
  intro,
  steps = DEFAULT_STEPS,
  submitLabel = "Begin adventure",
  submittingLabel = "Generating...",
  slotLabel = "Slot",
  fullLabel = "All four slots are full",
  optionalHint = "You can add a fourth subject, or begin with three.",
}: {
  onSubmit: (subjects: string[]) => void;
  submitting: boolean;
  initialChosen?: string[];
  /** Fewest subjects needed before submitting. */
  min?: number;
  /** Most subjects that can be chosen. */
  max?: number;
  /** Subjects that cannot be picked here, for example ones already chosen. */
  exclude?: string[];
  title?: string;
  intro?: ReactNode;
  steps?: string[];
  submitLabel?: string;
  submittingLabel?: string;
  slotLabel?: string;
  fullLabel?: string;
  optionalHint?: string;
}) {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string[]>(initialChosen);
  const [open, setOpen] = useState<Subject | null>(null);

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const map = new Map<string, Subject[]>();
    for (const subject of SUBJECTS) {
      if (exclude.includes(subject.name)) continue;
      if (needle && !subject.name.toLowerCase().includes(needle)) continue;
      const list = map.get(subject.group) ?? [];
      list.push(subject);
      map.set(subject.group, list);
    }
    return Array.from(map.entries());
  }, [exclude, query]);

  const toggle = (name: string) => {
    setChosen((current) => {
      if (current.includes(name)) return current.filter((s) => s !== name);
      if (current.length >= max) return current;
      return [...current, name];
    });
  };

  const full = chosen.length >= max;
  const ready = chosen.length >= min;

  return (
    <div className="flex flex-col gap-6 pb-40">
      <div className="arcade-panel p-5 sm:p-6">
        <PixelHeading as="h2">{title}</PixelHeading>
        {intro}
        <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Selection steps">
          {steps.map((step, index) => (
            <li key={step} className="arcade-inset p-3 text-xs">
              <span className="text-highlight font-display block text-[0.55rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground mt-1 block">{step}</span>
            </li>
          ))}
        </ol>

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
        {grouped.map(([group, subjects]) => (
          <section key={group}>
            <h3 className="font-display text-accent mb-3 text-[0.6rem] tracking-widest uppercase">
              {group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const name = subject.name;
                const selected = chosen.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setOpen(subject)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border-2 px-3 py-2.5 text-left text-sm transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                      selected
                        ? "border-highlight bg-primary text-primary-foreground"
                        : "border-border bg-surface hover:border-accent hover:bg-surface-2",
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

      <p className="text-muted-foreground sr-only" aria-live="polite" aria-atomic="true">
        {chosen.length} of {min} required subjects selected. {full ? `${fullLabel}.` : ""}
      </p>

      <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t-2 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <SubjectSlots
            chosen={chosen}
            onRemove={toggle}
            required={min}
            total={max}
            slotLabel={slotLabel}
          />
          <ArcadeButton
            type="button"
            size="md"
            disabled={!ready || submitting}
            onClick={() => onSubmit(chosen)}
            className="w-full"
          >
            {submitting
              ? submittingLabel
              : ready
                ? submitLabel
                : `Pick ${min - chosen.length} more`}
          </ArcadeButton>
          {ready && !full ? (
            <p className="text-muted-foreground text-center text-xs">{optionalHint}</p>
          ) : null}
        </div>
      </div>

      {open ? (
        <SubjectDialog
          subject={open}
          selected={chosen.includes(open.name)}
          full={full}
          fullLabel={fullLabel}
          onClose={() => setOpen(null)}
          onToggle={() => {
            toggle(open.name);
            setOpen(null);
          }}
        />
      ) : null}
    </div>
  );
}
