import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { LoadingQuest } from "@/components/arcade/LoadingQuest";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { SupportOptIn } from "@/components/signup/SupportOptIn";
import { getChoice } from "@/lib/adventure.functions";

export const Route = createFileRoute("/plan/$choiceId")({
  head: () => ({
    meta: [
      { title: "Your project summary — A Level Adventures in the LCR" },
      {
        name: "description",
        content:
          "A summary of your chosen project and a simple way to register your interest for support.",
      },
      { property: "og:title", content: "Your project summary" },
      {
        property: "og:description",
        content:
          "Review your subjects and selected quest, then register your interest for support from local partners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanScreen,
});

function PlanScreen() {
  const { choiceId } = Route.useParams();
  const load = useServerFn(getChoice);

  const { data, isPending, isError } = useQuery({
    queryKey: ["choice", choiceId],
    queryFn: () => load({ data: { choiceId } }),
    staleTime: Infinity,
  });

  return (
    <ArcadeFrame>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {data ? (
          <Link
            to="/quests/$selectionId"
            params={{ selectionId: data.selectionId }}
            className="text-muted-foreground hover:text-accent inline-flex items-center gap-1 text-xs uppercase"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to your quests
          </Link>
        ) : null}
        <Link
          to="/subjects"
          className="text-muted-foreground hover:text-accent inline-flex items-center gap-1 text-xs uppercase"
        >
          <ChevronLeft className="h-4 w-4" />
          Change subjects
        </Link>
      </div>

      {isPending ? (
        <LoadingQuest messages={["Preparing your project summary..."]} />
      ) : isError || !data ? (
        <div className="arcade-panel p-6 text-center">
          <PixelHeading>Quest not found</PixelHeading>
          <p className="text-muted-foreground mt-3 text-sm">
            We couldn't find that project summary. Start a new adventure and choose a quest again.
          </p>
          <Link to="/" className="text-accent mt-4 inline-block text-sm underline">
            Back to the title screen
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 pb-12">
          <div className="arcade-panel p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-accent text-[0.65rem] tracking-[0.2em] uppercase">Your subjects</p>
                <h2 className="font-display text-highlight mt-2 text-[0.8rem] leading-relaxed">
                  Your chosen pathway
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.subjects.map((subject) => (
                <span key={subject} className="border-border bg-surface-2 rounded border px-2.5 py-1.5 text-xs">
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="arcade-panel p-5 sm:p-6">
            <p className="text-accent text-[0.65rem] tracking-[0.2em] uppercase">Your quest</p>
            <h2 className="font-display text-highlight mt-2 text-[0.95rem] leading-relaxed">
              {data.idea.title}
            </h2>
            <p className="text-foreground/90 mt-3 italic">{data.idea.strapline}</p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{data.idea.summary}</p>
          </div>

          <SupportOptIn choiceId={data.choiceId} />

          <div className="flex justify-center">
            <Link to="/" onClick={() => window.scrollTo({ top: 0 })}>
              <ArcadeButton type="button" variant="ghost" size="lg" className="w-full sm:w-auto">
                Start again
              </ArcadeButton>
            </Link>
          </div>
        </div>
      )}
    </ArcadeFrame>
  );
}
