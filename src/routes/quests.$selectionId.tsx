import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { LoadingQuest } from "@/components/arcade/LoadingQuest";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { SubjectSlots } from "@/components/subjects/SubjectSlots";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { chooseProject, getAdventure } from "@/lib/adventure.functions";

export const Route = createFileRoute("/quests/$selectionId")({
  validateSearch: z.object({ subjects: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Your four quests — A Level Adventures in the LCR" },
      {
        name: "description",
        content:
          "Four multi-disciplinary research project ideas built from your A levels and the Liverpool City Region's economic priorities.",
      },
      { property: "og:title", content: "Your four research quests" },
      {
        property: "og:description",
        content:
          "Research projects that sit where your A levels meet the Liverpool City Region's skills needs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuestsScreen,
});

function QuestsScreen() {
  const { selectionId } = Route.useParams();
  const { subjects } = Route.useSearch();
  const navigate = useNavigate();
  const load = useServerFn(getAdventure);
  const choose = useServerFn(chooseProject);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["adventure", selectionId],
    queryFn: () => load({ data: { selectionId } }),
    staleTime: Infinity,
  });

  return (
    <ArcadeFrame>
      <Link
        to="/subjects"
        search={{ subjects }}
        className="text-muted-foreground hover:text-accent mb-6 inline-flex items-center gap-1 text-xs uppercase"
      >
        <ChevronLeft className="h-4 w-4" />
        Change subjects
      </Link>

      {isPending ? (
        <LoadingQuest messages={["Fetching your quests..."]} />
      ) : isError || !data ? (
        <div className="arcade-panel p-6 text-center">
          <PixelHeading>Quest not found</PixelHeading>
          <p className="text-muted-foreground mt-3 text-sm">
            We couldn't find that adventure. Pick your subjects again to start a new one.
          </p>
          <Link to="/subjects" className="text-accent mt-4 inline-block text-sm underline">
            Choose subjects
          </Link>
        </div>
      ) : choosing ? (
        <LoadingQuest
          messages={[
            "Finding local organisations who might help...",
            "Working out how to fit this into three hours a week...",
            "Writing your week-by-week project plan...",
          ]}
        />
      ) : (
        <>
          <div className="arcade-panel mb-6 p-5 sm:p-6">
            <PixelHeading as="h2">Your four quests</PixelHeading>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Each quest sits where your subjects meet a real skills or growth need in the
              Liverpool City Region. Open one to read the brief and see where it could lead.
            </p>
            <div className="mt-4">
              <SubjectSlots chosen={data.subjects} />
            </div>
          </div>


          {error ? (
            <p className="border-destructive bg-destructive/15 text-foreground mb-5 rounded-md border-2 p-4 text-sm">
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {data.ideas.map((idea, index) => (
              <ProjectCard
                key={idea.title}
                idea={idea}
                index={index}
                onOpen={() => setOpenIndex(index)}
              />
            ))}
          </div>

          {openIndex !== null && data.ideas[openIndex] ? (
            <ProjectDialog
              idea={data.ideas[openIndex]}
              choosing={choosing}
              onClose={() => setOpenIndex(null)}
              onChoose={async () => {
                setError(null);
                setChoosing(true);
                setOpenIndex(null);
                try {
                  const result = await choose({
                    data: { selectionId, projectIndex: openIndex },
                  });
                  await navigate({
                    to: "/plan/$choiceId",
                    params: { choiceId: result.choiceId },
                  });
                } catch {
                  setChoosing(false);
                  setError("We couldn't build that project plan. Please try again in a moment.");
                }
              }}
            />
          ) : null}
        </>
      )}
    </ArcadeFrame>
  );
}
