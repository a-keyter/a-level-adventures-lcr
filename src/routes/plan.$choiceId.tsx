import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { LoadingQuest } from "@/components/arcade/LoadingQuest";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { PlanView } from "@/components/plan/PlanView";
import { SupportOptIn } from "@/components/signup/SupportOptIn";
import { getChoice } from "@/lib/adventure.functions";

export const Route = createFileRoute("/plan/$choiceId")({
  head: () => ({
    meta: [
      { title: "Your project plan — A Level Adventures in the LCR" },
      {
        name: "description",
        content:
          "A practical research project plan with Liverpool City Region partners, weekly tasks and a downloadable PDF, built for three hours a week.",
      },
      { property: "og:title", content: "Your research project plan" },
      {
        property: "og:description",
        content:
          "Local partners, a week-by-week timeline and a downloadable PDF for your Liverpool City Region research project.",
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
      {data ? (
        <Link
          to="/quests/$selectionId"
          params={{ selectionId: data.selectionId }}
          className="text-muted-foreground hover:text-accent mb-6 inline-flex items-center gap-1 text-xs uppercase"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to your quests
        </Link>
      ) : null}

      {isPending ? (
        <LoadingQuest messages={["Opening your project plan..."]} />
      ) : isError || !data ? (
        <div className="arcade-panel p-6 text-center">
          <PixelHeading>Plan not found</PixelHeading>
          <p className="text-muted-foreground mt-3 text-sm">
            We couldn't find that project plan. Start a new adventure to build another one.
          </p>
          <Link to="/" className="text-accent mt-4 inline-block text-sm underline">
            Back to the title screen
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 pb-12">
          <PlanView plan={data.plan} idea={data.idea} subjects={data.subjects} />
          <SupportOptIn choiceId={data.choiceId} />
        </div>
      )}
    </ArcadeFrame>
  );
}
