import { X } from "lucide-react";
import { useEffect } from "react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { ArcadeDisclosure } from "@/components/arcade/ArcadeDisclosure";
import type { ProjectIdea } from "@/lib/adventure-types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="font-display text-accent text-[0.6rem] tracking-widest uppercase">{title}</h4>
      {children}
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="border-border bg-surface-2 rounded border px-2 py-1 text-xs"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProjectDialog({
  idea,
  onClose,
  onChoose,
  choosing,
}: {
  idea: ProjectIdea;
  onClose: () => void;
  onChoose: () => void;
  choosing: boolean;
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
      aria-describedby="project-dialog-description"
    >
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="arcade-panel relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none sm:rounded-b-lg">
        <div className="border-border bg-surface-2 flex items-start justify-between gap-3 border-b-2 p-4">
          <div>
            <p className="text-accent text-[0.65rem] tracking-wide uppercase">{idea.sector}</p>
            <h3 id="project-dialog-title" className="font-display text-highlight mt-1.5 text-[0.75rem] leading-relaxed">
              {idea.title}
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
          <p id="project-dialog-description" className="text-foreground/90 italic">{idea.strapline}</p>

          <Section title="The project">
            <p className="text-muted-foreground">{idea.summary}</p>
          </Section>

          <Section title="Why it matters here">
            <p className="text-muted-foreground">{idea.whyItMatters}</p>
          </Section>

          <Section title="How your subjects feed in">
            <ul className="flex flex-col gap-2">
              {idea.subjectLinks.map((link) => (
                <li key={link.subject} className="arcade-inset p-3">
                  <span className="text-highlight font-semibold">{link.subject}</span>
                  <p className="text-muted-foreground mt-1">{link.contribution}</p>
                </li>
              ))}
            </ul>
          </Section>

          <ArcadeDisclosure title="Questions you could ask" value="questions" summary="Use these prompts to shape your investigation.">
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              {idea.researchQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </ArcadeDisclosure>

          <ArcadeDisclosure title="Where this could lead" value="pathways" summary="Explore degrees, apprenticeships, careers and local organisations.">
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <p className="text-accent mb-1.5 text-xs uppercase">Degrees</p>
                <Chips items={idea.whereThisCouldLead.degrees} />
              </div>
              <div>
                <p className="text-accent mb-1.5 text-xs uppercase">Apprenticeships</p>
                <Chips items={idea.whereThisCouldLead.apprenticeships} />
              </div>
              <div>
                <p className="text-accent mb-1.5 text-xs uppercase">Careers</p>
                <Chips items={idea.whereThisCouldLead.careers} />
              </div>
              <div>
                <p className="text-accent mb-1.5 text-xs uppercase">Local organisations</p>
                <Chips items={idea.whereThisCouldLead.localEmployers} />
              </div>
            </div>
          </ArcadeDisclosure>
        </div>

        <div className="border-border bg-surface-2 border-t-2 p-4">
          <ArcadeButton onClick={onChoose} disabled={choosing} className="w-full">
            {choosing ? "Preparing your plan..." : "Choose this quest"}
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}
