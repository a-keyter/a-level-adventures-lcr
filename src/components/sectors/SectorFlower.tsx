import { useState } from "react";
import { computeSectorOverlaps, type SectorOverlap } from "@/data/lsip-sectors";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { SectorDialog } from "@/components/sectors/SectorDialog";
import { cn } from "@/lib/utils";

const TONES = ["text-primary", "text-accent", "text-highlight"];

const SIZE = 340;
const CENTRE = SIZE / 2;
const INNER = 34;
const OUTER = 148;

function point(radius: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTRE + radius * Math.cos(rad), CENTRE + radius * Math.sin(rad)] as const;
}

function band(r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = point(r0, a0);
  const [x1, y1] = point(r1, a0);
  const [x2, y2] = point(r1, a1);
  const [x3, y3] = point(r0, a1);
  return [
    `M ${x0} ${y0}`,
    `L ${x1} ${y1}`,
    `A ${r1} ${r1} 0 0 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${r0} ${r0} 0 0 0 ${x0} ${y0}`,
    "Z",
  ].join(" ");
}

export function SectorFlower({ chosen }: { chosen: string[] }) {
  const overlaps = computeSectorOverlaps(chosen);
  const [open, setOpen] = useState<SectorOverlap | null>(null);
  const step = 360 / overlaps.length;
  const gap = 4;
  const total = overlaps.reduce((sum, o) => sum + o.points, 0);

  return (
    <div className="arcade-panel p-5 sm:p-6">
      <PixelHeading as="h2">Where your subjects land</PixelHeading>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Each petal is a priority sector from the Liverpool City Region Local Skills Improvement
        Plan. Every band inside a petal is a role, and it fills up where one of your subjects
        overlaps with the skills that role needs. Tap a petal to read the roles.
      </p>

      <div className="mt-5 flex flex-col items-center gap-5 lg:flex-row lg:items-start">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[340px] shrink-0"
          role="img"
          aria-label={`Radar of ${total} overlap points between your subjects and Liverpool City Region sectors`}
        >
          {overlaps.map((overlap, index) => {
            const a0 = index * step + gap / 2;
            const a1 = (index + 1) * step - gap / 2;
            const roles = overlap.sector.roles;
            const thickness = (OUTER - INNER) / roles.length;
            const tone = TONES[index % TONES.length];
            const [lx, ly] = point(OUTER + 18, (a0 + a1) / 2);
            return (
              <g key={overlap.sector.id} className={cn(tone, "cursor-pointer")}>
                <title>{`${overlap.sector.name}: ${overlap.points} overlap points`}</title>
                {roles.map((role, ri) => {
                  const match = overlap.matches.find((m) => m.role.title === role.title);
                  const count = match?.subjects.length ?? 0;
                  const r0 = INNER + ri * thickness + 1.5;
                  const r1 = INNER + (ri + 1) * thickness;
                  return (
                    <path
                      key={role.title}
                      d={band(r0, r1, a0, a1)}
                      fill="currentColor"
                      fillOpacity={count ? 0.3 + count * 0.18 : 0.08}
                      stroke="currentColor"
                      strokeOpacity={0.35}
                      strokeWidth={0.75}
                    />
                  );
                })}
                <path
                  d={band(INNER, OUTER, a0, a1)}
                  fill="transparent"
                  onClick={() => setOpen(overlap)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${overlap.sector.name}, ${overlap.points} overlap points`}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpen(overlap);
                    }
                  }}
                  className="focus-visible:outline-none"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={lx > CENTRE + 4 ? "start" : lx < CENTRE - 4 ? "end" : "middle"}
                  dominantBaseline="middle"
                  className="pointer-events-none fill-current text-[9px] font-semibold"
                >
                  {overlap.sector.short}
                </text>
              </g>
            );
          })}
          <circle cx={CENTRE} cy={CENTRE} r={INNER - 6} className="fill-current text-primary/20" />
          <text
            x={CENTRE}
            y={CENTRE - 4}
            textAnchor="middle"
            className="fill-current text-[14px] font-bold"
          >
            {total}
          </text>
          <text
            x={CENTRE}
            y={CENTRE + 9}
            textAnchor="middle"
            className="fill-current text-[7px] opacity-70"
          >
            overlaps
          </text>
        </svg>

        <ul className="flex w-full flex-col gap-2">
          {[...overlaps]
            .sort((a, b) => b.points - a.points)
            .map((overlap) => (
              <li key={overlap.sector.id}>
                <button
                  type="button"
                  onClick={() => setOpen(overlap)}
                  className="border-border bg-surface hover:border-accent hover:bg-surface-2 focus-visible:ring-ring flex w-full items-center justify-between gap-3 rounded-md border-2 px-3 py-2.5 text-left text-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span>{overlap.sector.name}</span>
                  <span className="text-accent shrink-0 text-xs whitespace-nowrap">
                    {overlap.points} {overlap.points === 1 ? "overlap" : "overlaps"}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </div>

      {open ? <SectorDialog overlap={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
