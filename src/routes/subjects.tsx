import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { LoadingQuest } from "@/components/arcade/LoadingQuest";
import { SubjectPicker } from "@/components/subjects/SubjectPicker";
import { SectorFlower } from "@/components/sectors/SectorFlower";
import { QuestReadyDialog } from "@/components/quests/QuestReadyDialog";
import { startAdventure } from "@/lib/adventure.functions";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Choose your four A levels — A Level Adventures in the LCR" },
      {
        name: "description",
        content:
          "Search A levels offered at Liverpool City Region colleges and pick the four subjects that will shape your research quests.",
      },
      { property: "og:title", content: "Choose your four A levels" },
      {
        property: "og:description",
        content:
          "Pick four A levels from Liverpool City Region colleges and unlock research project ideas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubjectsScreen,
});

const LOADING_MESSAGES = [
  "Reading the Liverpool City Region skills plan...",
  "Looking for where your four subjects overlap...",
  "Checking which sectors are growing across the city region...",
  "Sketching four research quests just for you...",
];

function SubjectsScreen() {
  const navigate = useNavigate();
  const begin = useServerFn(startAdventure);
  const [submitting, setSubmitting] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  const [ready, setReady] = useState<{ selectionId: string; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <ArcadeFrame>
      <Link
        to="/"
        className="text-muted-foreground hover:text-accent mb-6 inline-flex items-center gap-1 text-xs uppercase"
      >
        <ChevronLeft className="h-4 w-4" />
        Title screen
      </Link>

      {submitting || ready ? (
        <div className="flex flex-col gap-5">
          <SectorFlower chosen={chosen} />
          {submitting ? <LoadingQuest messages={LOADING_MESSAGES} /> : null}
          {ready ? (
            <QuestReadyDialog
              count={ready.count}
              onContinue={() => {
                void navigate({
                  to: "/quests/$selectionId",
                  params: { selectionId: ready.selectionId },
                });
              }}
            />
          ) : null}
        </div>
      ) : (
        <>
          {error ? (
            <p className="border-destructive bg-destructive/15 text-foreground mb-5 rounded-md border-2 p-4 text-sm">
              {error}
            </p>
          ) : null}
          <SubjectPicker
            submitting={submitting}
            onSubmit={async (subjects) => {
              setError(null);
              setSubmitting(true);
              try {
                const result = await begin({ data: { subjects } });
                await navigate({
                  to: "/quests/$selectionId",
                  params: { selectionId: result.selectionId },
                });
              } catch {
                setSubmitting(false);
                setError(
                  "Something went wrong while building your quests. Please try again in a moment.",
                );
              }
            }}
          />
        </>
      )}
    </ArcadeFrame>
  );
}
