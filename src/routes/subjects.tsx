import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { LoadingQuest } from "@/components/arcade/LoadingQuest";
import { SubjectPicker } from "@/components/subjects/SubjectPicker";
import { SectorFlower } from "@/components/sectors/SectorFlower";
import { QuestReadyDialog } from "@/components/quests/QuestReadyDialog";
import { startAdventure } from "@/lib/adventure.functions";
import { SUBJECTS } from "@/data/subjects";

export const Route = createFileRoute("/subjects")({
  validateSearch: z.object({ subjects: z.string().optional() }),
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
  "Looking for where your subjects overlap...",
  "Checking which sectors are growing across the city region...",
  "Sketching four research quests just for you...",
];

function SubjectsScreen() {
  const { subjects: subjectsQuery } = Route.useSearch();
  const navigate = useNavigate();
  const begin = useServerFn(startAdventure);
  const [submitting, setSubmitting] = useState(false);
  const [chosen, setChosen] = useState<string[]>(() => parseSubjects(subjectsQuery));
  const [ready, setReady] = useState<{
    selectionId: string;
    count: number;
    subjects: string[];
  } | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    setChosen(parseSubjects(subjectsQuery));
  }, [subjectsQuery]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setDismissed(false), 30_000);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    const restoredSubjects = parseSubjects(subjectsQuery);
    if (
      restoredSubjects.length < 3 ||
      restoredSubjects.length > 4 ||
      submitting ||
      ready ||
      startedQueryRef.current === subjectsQuery
    ) {
      return;
    }

    startedQueryRef.current = subjectsQuery ?? null;
    setChosen(restoredSubjects);
    setSubmitting(true);
    void begin({ data: { subjects: restoredSubjects } })
      .then((result) => {
        setSubmitting(false);
        setReady({
          selectionId: result.selectionId,
          count: result.ideas?.length ?? 4,
          subjects: restoredSubjects,
        });
      })
      .catch(() => {
        setSubmitting(false);
        setError("Something went wrong while building your quests. Please try again in a moment.");
      });
  }, [begin, ready, subjectsQuery, submitting]);

  const goToQuests = () => {
    if (!ready) return;
    void navigate({
      to: "/quests/$selectionId",
      params: { selectionId: ready.selectionId },
      search: { subjects: ready.subjects.join(",") },
    });
  };

  return (
    <ArcadeFrame>
      {submitting || ready ? (
        <button
          type="button"
          onClick={() => {
            setReady(null);
            setDismissed(false);
            setSubmitting(false);
            void navigate({ to: "/subjects", search: {} });
          }}
          className="text-muted-foreground hover:text-accent mb-6 inline-flex items-center gap-1 text-xs uppercase"
        >
          <ChevronLeft className="h-4 w-4" />
          Change subjects
        </button>
      ) : (
        <Link
          to="/"
          className="text-muted-foreground hover:text-accent mb-6 inline-flex items-center gap-1 text-xs uppercase"
        >
          <ChevronLeft className="h-4 w-4" />
          Title screen
        </Link>
      )}

      {submitting || ready ? (
        <div className="flex flex-col gap-5 pb-8">
          <SectorFlower chosen={chosen} />
          {submitting ? <LoadingQuest messages={LOADING_MESSAGES} /> : null}
          {ready ? (
            <div className="arcade-panel flex flex-col items-center gap-3 p-5 text-center">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {ready.count} challenge brief{ready.count === 1 ? " is" : "s are"} ready whenever
                you are.
              </p>
              <ArcadeButton onClick={goToQuests}>View challenge briefs</ArcadeButton>
            </div>
          ) : null}
          {ready && !dismissed ? (
            <QuestReadyDialog
              count={ready.count}
              onContinue={goToQuests}
              onClose={() => setDismissed(true)}
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
            initialChosen={chosen}
            onSubmit={async (subjects) => {
              setError(null);
              setChosen(subjects);
              setDismissed(true);
              setSubmitting(true);
              window.scrollTo({ top: 0, behavior: "auto" });
              void navigate({
                to: "/subjects",
                search: { subjects: subjects.join(",") },
                replace: true,
              });
              try {
                const result = await begin({ data: { subjects } });
                setSubmitting(false);
                setReady({
                  selectionId: result.selectionId,
                  count: result.ideas?.length ?? 4,
                  subjects,
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

function parseSubjects(value: string | undefined) {
  const available = new Set(SUBJECTS.map((subject) => subject.name));
  return value
    ? [...new Set(value.split(",").filter((subject) => available.has(subject)))].slice(0, 4)
    : [];
}
