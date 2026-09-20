import { Compass, GraduationCap } from "lucide-react";
import type { ProjectIdea } from "@/lib/adventure-types";

export function ProjectCard({
  idea,
  onOpen,
}: {
  idea: ProjectIdea;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="arcade-panel hover:border-accent focus-visible:ring-ring group flex h-full w-full flex-col gap-3 p-5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
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
    </button>
  );
}
