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
import { QuestReadyDialog } from "@/components/quests/QuestReadyDialog";
import { saveBonusSubjects, startAdventure } from "@/lib/adventure.functions";
import { SUBJECTS } from "@/data/subjects";

export const Route = createFileRoute("/subjects")({
  validateSearch: z.object({
    subjects: z.string().optional(),
    bonus: z.string().optional(),
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
  "Imagine two extra slots",
  "A related job is guaranteed",
  "Pick your two wildcards",
];

const QUEST_ERROR =
  "Something went wrong while building your quests. Please try again in a moment.";

function SubjectsScreen() {
  const { subjects: subjectsQuery, bonus: bonusQuery } = Route.useSearch();
  const navigate = useNavigate();
  const begin = useServerFn(startAdventure);
  const saveBonus = useServerFn(saveBonusSubjects);
  const [submitting, setSubmitting] = useState(false);
  const [chosen, setChosen] = useState<string[]>(() => parseSubjects(subjectsQuery));
  const [bonus, setBonus] = useState<string[] | null>(() =>
    parseBonus(bonusQuery, parseSubjects(subjectsQuery)),
  );
  const [ready, setReady] = useState<{
    selectionId: string;
    count: number;
    subjects: string[];
  } | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startedQueryRef = useRef<string | null>(null);
  const savedBonusRef = useRef<string | null>(null);
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
    if (!ready || !bonus) return;
    const timer = window.setTimeout(() => setDismissed(false), 30_000);
    return () => window.clearTimeout(timer);
  }, [ready, bonus]);

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
    setBonus(parseBonus(bonusQuery, restoredSubjects));
    startRun(restoredSubjects);
  }, [bonusQuery, ready, startRun, subjectsQuery, submitting]);

  // Save the bonus picks once both they and the run's selection exist.
  useEffect(() => {
    if (!ready || !bonus) return;
    const key = `${ready.selectionId}|${bonus.join(",")}`;
    if (savedBonusRef.current === key) return;
    savedBonusRef.current = key;
    void saveBonus({ data: { selectionId: ready.selectionId, subjects: bonus } }).catch(
      (saveError: unknown) => {
        console.error("Could not save bonus subjects", saveError);
      },
    );
  }, [bonus, ready, saveBonus]);

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
            setBonus(null);
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
              setBonus(null);
              setDismissed(true);
              window.scrollTo({ top: 0, behavior: "auto" });
              startedQueryRef.current = query;
              void navigate({ to: "/subjects", search: { subjects: query }, replace: true });
              startRun(subjects);
            }}
          />
        </>
      ) : !bonus ? (
        <SubjectPicker
          key="bonus"
          submitting={false}
          min={2}
          max={2}
          exclude={chosen}
          title="Bonus round"
          intro={
            <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
              <p className="text-muted-foreground">
                Imagine your timetable had room for two more A levels, and you were guaranteed a job
                in a field linked to each one. Which two would you add?
              </p>
              <p className="text-accent text-xs" aria-live="polite">
                {ready
                  ? "Your challenge briefs are ready. Lock in your bonus picks to see them."
                  : "Your challenge briefs are being built while you choose."}
              </p>
            </div>
          }
          steps={BONUS_STEPS}
          submitLabel="Lock in bonus picks"
          slotLabel="Bonus"
          fullLabel="Both bonus slots are full"
          onSubmit={(picks) => {
            setBonus(picks);
            window.scrollTo({ top: 0, behavior: "auto" });
            void navigate({
              to: "/subjects",
              search: { subjects: chosen.join(","), bonus: picks.join(",") },
              replace: true,
            });
          }}
        />
      ) : (
        <div className="flex flex-col gap-5 pb-8">
          <div className="arcade-panel p-5 sm:p-6">
            <p className="font-display text-highlight text-[0.6rem] tracking-widest uppercase">
              Bonus picks locked in
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              With a spare option and a guaranteed job to match, you&rsquo;d add{" "}
              <span className="text-foreground">{bonus[0]}</span> and{" "}
              <span className="text-foreground">{bonus[1]}</span>.
            </p>
          </div>
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

/** Restore two bonus picks from the URL, ignoring anything already chosen. */
function parseBonus(value: string | undefined, chosen: string[]) {
  const picks = parseSubjects(value).filter((subject) => !chosen.includes(subject));
  return picks.length === 2 ? picks : null;
}
