import { ExternalLink } from "lucide-react";
import employers from "@/data/lcr-employers.json";
import { topRoleOptions } from "@/data/lsip-sectors";
import { PixelHeading } from "@/components/arcade/PixelHeading";

const EMPLOYERS = employers as unknown as Record<string, [string, string, string, string][]>;

/** Local organisations likely to recruit for the player's top three roles. */
export function RoleEmployers({ chosen, passion }: { chosen: string[]; passion: string | null }) {
  const options = topRoleOptions(chosen, passion ?? "").filter(
    (option) => EMPLOYERS[option.role.title]?.length,
  );
  if (options.length === 0) return null;

  return (
    <section className="arcade-panel mt-8 p-5 sm:p-6" aria-labelledby="employers-heading">
      <PixelHeading as="h2">
        <span id="employers-heading">Who&rsquo;s hiring near you</span>
      </PixelHeading>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Employers and organisations across the Liverpool City Region likely to recruit for your top
        roles. Good people to approach for advice, work experience or support with your project.
      </p>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {options.map((option) => (
          <div key={option.role.title}>
            <p className="text-accent text-[0.65rem] tracking-wide uppercase">{option.sector.short}</p>
            <h3 className="text-foreground mb-3 font-semibold">{option.role.title}</h3>
            <ul className="grid gap-2">
              {(EMPLOYERS[option.role.title] ?? []).map(([name, kind, why, url]) => (
                <li key={name} className="border-border bg-surface-2 rounded-md border-2 p-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent inline-flex items-center gap-1 text-sm font-semibold"
                  >
                    {name}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <p className="text-highlight text-[0.65rem] uppercase">{kind}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{why}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
