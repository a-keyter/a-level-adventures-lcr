import { ChevronDown, ChevronRight, Compass, GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";
import type { ProjectIdea } from "@/lib/adventure-types";

export function ProjectCard({
  idea,
  index,
  onOpen,
}: {
  idea: ProjectIdea;
  index: number;
  onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="arcade-panel hover:border-accent group flex h-full w-full flex-col gap-3 p-5 text-left transition-colors">
      <div className="flex items-center gap-2">
        <span className="font-display bg-primary text-primary-foreground rounded px-2 py-1 text-[0.55rem]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-accent text-[0.7rem] tracking-wide uppercase">{idea.sector}</span>
      </div>
      <h3 className="font-display text-highlight text-[0.72rem] leading-relaxed">{idea.title}</h3>
      <p className="text-foreground/90 text-sm">{idea.strapline}</p>
      <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
        <span className="flex items-center gap-1.5">
          <Compass className="text-accent h-3.5 w-3.5" aria-hidden />
          {idea.subjectLinks.length} subject links
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap className="text-accent h-3.5 w-3.5" aria-hidden />
          {idea.whereThisCouldLead.careers.length} career routes
        </span>
      </div>
      <div>
        <p className={`text-muted-foreground text-sm ${expanded ? "" : "line-clamp-2"}`}>
          {idea.summary}
        </p>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
          className="text-accent mt-2 inline-flex items-center gap-1 text-xs font-medium"
        >
          {expanded ? "See less" : "See more"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>
      <span className="text-muted-foreground flex items-center gap-1 text-xs">
        <MapPin className="text-accent h-3.5 w-3.5" aria-hidden />
        Liverpool City Region focus
      </span>
      <button
        type="button"
        onClick={onOpen}
        className="text-accent focus-visible:ring-ring mt-auto inline-flex items-center gap-1 pt-2 text-left text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
      >
        Open the brief
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </article>
  );
}
