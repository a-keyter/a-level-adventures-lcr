import { Sparkles } from "lucide-react";
import { topRoleOptions } from "@/data/lsip-sectors";
import { PixelHeading } from "@/components/arcade/PixelHeading";

export function PassionOptions({ chosen, passion }: { chosen: string[]; passion: string }) {
  const options = topRoleOptions(chosen, passion);

  return (
    <div className="arcade-panel p-5 sm:p-6">
      <PixelHeading as="h2">
        {options.length === 1 ? "Your top option" : `Your top ${options.length} options`}
      </PixelHeading>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        With a spare option and a guaranteed job to match, you&rsquo;d add{" "}
        <span className="text-foreground">{passion}</span>. These roles, which employers across the
        city region need, bring it together with the subjects you chose.
      </p>

      {options.length === 0 ? (
        <p className="border-border bg-surface-2 text-muted-foreground mt-4 rounded-md border-2 p-4 text-sm">
          None of the region&rsquo;s priority roles list these subjects yet, but that doesn&rsquo;t
          rule anything out. Explore the sectors above to see what employers here are asking for.
        </p>
      ) : (
        <ol className="mt-5 grid gap-3 lg:grid-cols-3">
          {options.map((option, index) => (
            <li
              key={option.role.title}
              className="border-highlight/60 bg-surface-2 flex flex-col gap-2 rounded-md border-2 p-4"
            >
              <p className="font-display text-highlight text-[0.55rem]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="text-accent text-[0.65rem] tracking-wide uppercase">
                {option.sector.name}
              </p>
              <h3 className="text-foreground font-semibold">{option.role.title}</h3>
              <p className="text-muted-foreground text-xs uppercase">{option.role.level}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{option.role.what}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Linked subjects">
                {option.includesPassion ? (
                  <li className="border-highlight bg-accent text-accent-foreground inline-flex items-center gap-1 rounded border-2 px-2 py-1 text-xs">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    {passion}
                    <span className="sr-only"> (passion subject)</span>
                  </li>
                ) : null}
                {option.subjects.map((subject) => (
                  <li
                    key={subject}
                    className="border-highlight bg-primary text-primary-foreground rounded border-2 px-2 py-1 text-xs"
                  >
                    {subject}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
