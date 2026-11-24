import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { LoadingQuest } from "@/components/arcade/LoadingQuest";
import { SubjectPicker } from "@/components/subjects/SubjectPicker";
import { SectorFlower } from "@/components/sectors/SectorFlower";
import { PassionOptions } from "@/components/sectors/PassionOptions";
import { QuestReadyDialog } from "@/components/quests/QuestReadyDialog";
import { savePassionSubject, startAdventure } from "@/lib/adventure.functions";
import { SUBJECTS } from "@/data/subjects";

export const Route = createFileRoute("/subjects")({
  validateSearch: z.object({
    subjects: z.string().optional(),
    passion: z.string().optional(),
  }),
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

const BONUS_STEPS = [
  "Imagine one extra slot",
  "A related job is guaranteed",
  "Pick your passion subject",
];

const BONUS_GROUP_ORDER = [
  "Creative & Performing",
  "Sport & Wellbeing",
  "Technical & Applied",
];

const QUEST_ERROR =
  "Something went wrong while building your quests. Please try again in a moment.";

function SubjectsScreen() {
  const { subjects: subjectsQuery, passion: passionQuery } = Route.useSearch();
  const navigate = useNavigate();
  const begin = useServerFn(startAdventure);
  const savePassion = useServerFn(savePassionSubject);
  const [submitting, setSubmitting] = useState(false);
  const [chosen, setChosen] = useState<string[]>(() => parseSubjects(subjectsQuery));
  const [passion, setPassion] = useState<string | null>(() =>
    parsePassion(passionQuery, parseSubjects(subjectsQuery)),
  );
  const [ready, setReady] = useState<{
    selectionId: string;
    count: number;
    subjects: string[];
  } | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startedQueryRef = useRef<string | null>(null);
  const savedPassionRef = useRef<string | null>(null);
  // Bumped whenever a run starts or is abandoned, so late results are ignored.
  const runRef = useRef(0);

  const startRun = useCallback(
    (subjects: string[]) => {
      const run = ++runRef.current;
      setSubmitting(true);
      void begin({ data: { subjects } })
        .then((result) => {
          if (run !== runRef.current) return;
          setSubmitting(false);
          setReady({
            selectionId: result.selectionId,
            count: result.ideas?.length ?? 4,
            subjects,
          });
        })
        .catch(() => {
          if (run !== runRef.current) return;
          setSubmitting(false);
          setError(QUEST_ERROR);
        });
    },
    [begin],
  );

  useEffect(() => {
    setChosen(parseSubjects(subjectsQuery));
  }, [subjectsQuery]);

  useEffect(() => {
    if (!ready || !passion) return;
    const timer = window.setTimeout(() => setDismissed(false), 30_000);
    return () => window.clearTimeout(timer);
  }, [ready, passion]);

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
    setPassion(parsePassion(passionQuery, restoredSubjects));
    startRun(restoredSubjects);
  }, [passionQuery, ready, startRun, subjectsQuery, submitting]);

  // Save the passion subject once both it and the run's selection exist.
  useEffect(() => {
    if (!ready || !passion) return;
    const key = `${ready.selectionId}|${passion}`;
    if (savedPassionRef.current === key) return;
    savedPassionRef.current = key;
    void savePassion({ data: { selectionId: ready.selectionId, subject: passion } }).catch(
      (saveError: unknown) => {
        console.error("Could not save passion subject", saveError);
      },
    );
  }, [passion, ready, savePassion]);

  const goToQuests = () => {
    if (!ready) return;
    void navigate({
      to: "/quests/$selectionId",
      params: { selectionId: ready.selectionId },
      search: { subjects: ready.subjects.join(",") },
    });
  };

  const started = submitting || ready !== null;

  return (
    <ArcadeFrame>
      {started ? (
        <button
          type="button"
          onClick={() => {
            runRef.current += 1;
            setReady(null);
            setPassion(null);
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

      {!started ? (
        <>
          {error ? (
            <p className="border-destructive bg-destructive/15 text-foreground mb-5 rounded-md border-2 p-4 text-sm">
              {error}
            </p>
          ) : null}
          <SubjectPicker
            submitting={submitting}
            initialChosen={chosen}
            onSubmit={(subjects) => {
              const query = subjects.join(",");
              setError(null);
              setChosen(subjects);
              setPassion(null);
              setDismissed(true);
              window.scrollTo({ top: 0, behavior: "auto" });
              startedQueryRef.current = query;
              void navigate({ to: "/subjects", search: { subjects: query }, replace: true });
              startRun(subjects);
            }}
          />
        </>
      ) : !passion ? (
        <SubjectPicker
          key="passion"
          submitting={false}
          min={1}
          max={1}
          exclude={chosen}
          groupOrder={BONUS_GROUP_ORDER}
          title="Bonus round"
          intro={
            <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
              <p className="text-muted-foreground">
                Imagine your timetable had room for one more A level, and you were guaranteed a job
                in a field linked to it. Which subject would you add?
              </p>
              <p className="text-accent text-xs" aria-live="polite">
                {ready
                  ? "Your challenge briefs are ready. Lock in your passion subject to see them."
                  : "Your challenge briefs are being built while you choose."}
              </p>
            </div>
          }
          steps={BONUS_STEPS}
          submitLabel="Lock in passion subject"
          slotLabel="Passion subject"
          fullLabel="Your passion slot is full"
          onSubmit={([pick]) => {
            if (!pick) return;
            setPassion(pick);
            window.scrollTo({ top: 0, behavior: "auto" });
            void navigate({
              to: "/subjects",
              search: { subjects: chosen.join(","), passion: pick },
              replace: true,
            });
          }}
        />
      ) : (
        <div className="flex flex-col gap-5 pb-8">
          <SectorFlower chosen={chosen} />
          <PassionOptions chosen={chosen} passion={passion} />
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

/** Restore the passion subject from the URL, ignoring one already chosen. */
function parsePassion(value: string | undefined, chosen: string[]) {
  return value && SUBJECTS.some((subject) => subject.name === value) && !chosen.includes(value)
    ? value
    : null;
}
