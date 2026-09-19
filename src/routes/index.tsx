import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AsciiTitle } from "@/components/arcade/AsciiTitle";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Level Adventures in the LCR" },
      {
        name: "description",
        content:
          "A retro choose-your-own-adventure for Liverpool City Region students: pick four A levels and discover research projects that match the region's real economic needs.",
      },
      { property: "og:title", content: "A Level Adventures in the LCR" },
      {
        property: "og:description",
        content:
          "Pick four A levels and unlock multi-disciplinary research projects rooted in Liverpool City Region skills priorities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TitleScreen,
});

function TitleScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void navigate({ to: "/subjects" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <ArcadeFrame className="flex min-h-screen flex-col items-center justify-center gap-10 py-16">
      <div className="animate-arcade-float w-full">
        <AsciiTitle />
      </div>

      <div className="arcade-panel w-full max-w-sm p-6">
        <p className="text-muted-foreground mb-6 text-center text-sm leading-relaxed">
          Four A levels. Four quests. One city region full of opportunity.
        </p>
        <ul className="flex flex-col gap-3" role="menu">
          <li role="none">
            <ArcadeButton
              role="menuitem"
              size="lg"
              className="w-full"
              onClick={() => navigate({ to: "/subjects" })}
            >
              <span className="animate-arcade-blink" aria-hidden>
                ▶
              </span>
              Start
            </ArcadeButton>
          </li>
        </ul>
        <p className="text-muted-foreground mt-5 text-center text-xs">
          Press <span className="text-highlight">Enter</span> or tap Start
        </p>
      </div>

      <p className="text-muted-foreground max-w-md text-center text-xs leading-relaxed">
        Built around the Liverpool City Region Local Skills Improvement Plan, so every quest connects
        to real jobs and employers across Liverpool, Sefton, Knowsley, St Helens, Wirral and Halton.
      </p>
    </ArcadeFrame>
  );
}
