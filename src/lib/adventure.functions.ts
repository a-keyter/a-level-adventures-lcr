import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { comboKey } from "@/data/subjects";
import type { ProjectIdea, ProjectPlan } from "@/lib/adventure-types";

const ideaSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string(),
      strapline: z.string(),
      sector: z.string(),
      summary: z.string(),
      whyItMatters: z.string(),
      subjectLinks: z.array(
        z.object({ subject: z.string(), contribution: z.string() }),
      ),
      researchQuestions: z.array(z.string()),
      whereThisCouldLead: z.object({
        degrees: z.array(z.string()),
        apprenticeships: z.array(z.string()),
        careers: z.array(z.string()),
        localEmployers: z.array(z.string()),
      }),
    }),
  ),
});

const planSchema = z.object({
  title: z.string(),
  overview: z.string(),
  aim: z.string(),
  researchQuestions: z.array(z.string()),
  localPartners: z.array(
    z.object({
      name: z.string(),
      kind: z.string(),
      whyRelevant: z.string(),
      howToApproach: z.string(),
    }),
  ),
  outreachMessage: z.string(),
  weeklyCommitment: z.string(),
  timeline: z.array(
    z.object({
      week: z.string(),
      focus: z.string(),
      tasks: z.array(z.string()),
      meeting: z.string(),
    }),
  ),
  teamRoles: z.array(z.object({ role: z.string(), responsibilities: z.string() })),
  ethicsAndSafety: z.array(z.string()),
  whatDoneLooksLike: z.array(z.string()),
  sharingYourFindings: z.array(z.string()),
  keepingItManageable: z.array(z.string()),
});

async function getDb() {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function getModel() {
  const { createOpenAI } = await import("@ai-sdk/openai");
  const { createLovableAiGatewayRunIdFetch } = await import("@/lib/ai-gateway.server");
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("The adventure guide is not configured yet.");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return lovable.responses("openai/gpt-6-astra");
}

const reasoningOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

/** Create (or reuse) a run for four chosen subjects and return its ideas. */
export const startAdventure = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ subjects: z.array(z.string()).length(4) }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const key = comboKey(data.subjects);

    const existing = await db
      .from("subject_combinations")
      .select("id, subjects, ideas")
      .eq("combo_key", key)
      .maybeSingle();

    let combinationId = existing.data?.id as string | undefined;
    let ideas = existing.data?.ideas as ProjectIdea[] | undefined;

    if (!combinationId || !ideas) {
      const { streamText, Output } = await import("ai");
      const { LSIP_CONTEXT } = await import("@/data/lsip");

      const result = streamText({
        model: await getModel(),
        output: Output.object({ schema: ideaSchema }),
        providerOptions: reasoningOptions,
        system: [
          "You advise 16-18 year olds in the Liverpool City Region about where their A levels could take them.",
          "Write warm, plain, encouraging British English. Never use American spellings.",
          "Ground everything in the Liverpool City Region skills and growth priorities supplied below.",
          "Name real, recognisable Liverpool City Region places, organisations and employers where you can.",
          "",
          LSIP_CONTEXT,
        ].join("\n"),
        prompt: [
          `The student is studying these four A levels: ${data.subjects.join(", ")}.`,
          "",
          "Propose exactly four distinct, genuinely multi-disciplinary research projects that a small group",
          "of sixth-form students could realistically run alongside their studies. Each project must sit at the",
          "intersection of all four subjects and address a real economic or skills need in the Liverpool City Region.",
          "Cover four different LSIP priority areas across the four projects.",
          "",
          "For each project give: a punchy title (six words or fewer); a one-line strapline; the LSIP sector it sits in;",
          "a two-to-three sentence summary; why it matters to the Liverpool City Region; one entry in subjectLinks for",
          "each of the four subjects explaining its contribution; three research questions; and whereThisCouldLead with",
          "three degree routes, three apprenticeship or technical routes, four job roles and four local employers or",
          "organisations.",
          "Return exactly four projects.",
        ].join("\n"),
      });

      const output = await result.output;
      ideas = output.projects.slice(0, 4) as ProjectIdea[];

      const inserted = await db
        .from("subject_combinations")
        .insert({ combo_key: key, subjects: data.subjects, ideas })
        .select("id")
        .single();

      if (inserted.error) {
        // Another visitor may have cached the same combination first.
        const retry = await db
          .from("subject_combinations")
          .select("id, ideas")
          .eq("combo_key", key)
          .maybeSingle();
        if (!retry.data) throw new Error("Could not save your adventure. Please try again.");
        combinationId = retry.data.id as string;
        ideas = retry.data.ideas as ProjectIdea[];
      } else {
        combinationId = inserted.data.id as string;
      }
    }

    const selection = await db
      .from("selections")
      .insert({ combination_id: combinationId, subjects: data.subjects })
      .select("id")
      .single();

    if (selection.error) throw new Error("Could not save your subject choices. Please try again.");

    return {
      selectionId: selection.data.id as string,
      subjects: data.subjects,
      ideas,
    };
  });

/** Load an existing run by its id. */
export const getAdventure = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ selectionId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const db = await getDb();
    const { data: row, error } = await db
      .from("selections")
      .select("id, subjects, combination_id, subject_combinations(ideas)")
      .eq("id", data.selectionId)
      .maybeSingle();

    if (error || !row) throw new Error("That adventure could not be found.");

    const combo = row.subject_combinations as unknown as { ideas: ProjectIdea[] } | null;
    return {
      selectionId: row.id as string,
      subjects: row.subjects as string[],
      ideas: (combo?.ideas ?? []) as ProjectIdea[],
    };
  });

/** Record the chosen project and return (or generate) its research plan. */
export const chooseProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ selectionId: z.string().uuid(), projectIndex: z.number().int().min(0).max(3) }).parse(
      input,
    ),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const { data: row } = await db
      .from("selections")
      .select("id, subjects, combination_id, subject_combinations(ideas)")
      .eq("id", data.selectionId)
      .maybeSingle();

    if (!row) throw new Error("That adventure could not be found.");

    const subjects = row.subjects as string[];
    const combinationId = row.combination_id as string;
    const combo = row.subject_combinations as unknown as { ideas: ProjectIdea[] } | null;
    const idea = combo?.ideas?.[data.projectIndex];
    if (!idea) throw new Error("That project could not be found.");

    const cached = await db
      .from("project_plans")
      .select("plan")
      .eq("combination_id", combinationId)
      .eq("project_index", data.projectIndex)
      .maybeSingle();

    let plan = cached.data?.plan as ProjectPlan | undefined;

    if (!plan) {
      const { streamText, Output } = await import("ai");
      const { LSIP_CONTEXT } = await import("@/data/lsip");

      const result = streamText({
        model: await getModel(),
        output: Output.object({ schema: planSchema }),
        providerOptions: reasoningOptions,
        system: [
          "You help sixth-form students in the Liverpool City Region plan small, realistic research projects",
          "with local partners. Write warm, practical, encouraging British English. Never use American spellings.",
          "Every plan must fit within three hours a week and no more than two meetings a week, alongside studies.",
          "Name real, recognisable Liverpool City Region organisations, universities, employers, councils, charities",
          "and networks. Be honest that students should check details and contact routes themselves.",
          "",
          LSIP_CONTEXT,
        ].join("\n"),
        prompt: [
          `Subjects being studied: ${subjects.join(", ")}.`,
          `Chosen project: ${idea.title} — ${idea.strapline}`,
          `Sector: ${idea.sector}`,
          `Summary: ${idea.summary}`,
          `Why it matters: ${idea.whyItMatters}`,
          "",
          "Produce a practical project plan containing:",
          "- title: the project title",
          "- overview: two or three sentences a teacher could read at a glance",
          "- aim: one sentence stating what the group will find out",
          "- researchQuestions: three focused questions",
          "- localPartners: six real Liverpool City Region organisations that might support this, each with",
          "  kind (for example university, employer, council, charity, network), why they are relevant, and a",
          "  concrete first step for approaching them",
          "- outreachMessage: a short, polite email a student could adapt, under 150 words",
          "- weeklyCommitment: one sentence describing how the three hours and two meetings are used",
          "- timeline: ten entries, one per week, each with week label, focus, three tasks and the meeting for that week",
          "- teamRoles: four roles for a group of peers with responsibilities",
          "- ethicsAndSafety: four points covering consent, data protection, safeguarding and safe working",
          "- whatDoneLooksLike: four clear finish-line outcomes",
          "- sharingYourFindings: four ways to share the results locally",
          "- keepingItManageable: four honest tips for staying within three hours a week",
        ].join("\n"),
      });

      plan = (await result.output) as ProjectPlan;

      await db
        .from("project_plans")
        .insert({ combination_id: combinationId, project_index: data.projectIndex, plan });
    }

    const choice = await db
      .from("choices")
      .insert({
        selection_id: data.selectionId,
        combination_id: combinationId,
        project_index: data.projectIndex,
        project_title: idea.title,
      })
      .select("id")
      .single();

    if (choice.error) throw new Error("Could not save your choice. Please try again.");

    return { choiceId: choice.data.id as string, subjects, idea, plan };
  });

/** Load a saved choice and its plan. */
export const getChoice = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ choiceId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const db = await getDb();
    const { data: choice } = await db
      .from("choices")
      .select("id, project_index, combination_id, selection_id")
      .eq("id", data.choiceId)
      .maybeSingle();

    if (!choice) throw new Error("That project could not be found.");

    const [{ data: combo }, { data: planRow }, { data: selection }] = await Promise.all([
      db.from("subject_combinations").select("ideas").eq("id", choice.combination_id).maybeSingle(),
      db
        .from("project_plans")
        .select("plan")
        .eq("combination_id", choice.combination_id)
        .eq("project_index", choice.project_index)
        .maybeSingle(),
      db.from("selections").select("subjects").eq("id", choice.selection_id).maybeSingle(),
    ]);

    const idea = (combo?.ideas as ProjectIdea[] | undefined)?.[choice.project_index];
    if (!idea || !planRow?.plan) throw new Error("That project plan could not be found.");

    return {
      choiceId: choice.id as string,
      selectionId: choice.selection_id as string,
      subjects: (selection?.subjects ?? []) as string[],
      idea,
      plan: planRow.plan as ProjectPlan,
    };
  });

/** Store an email against a choice, with no name attached. */
export const requestSupport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ choiceId: z.string().uuid(), email: z.string().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const { error } = await db
      .from("support_signups")
      .insert({ choice_id: data.choiceId, email: data.email.trim().toLowerCase() });
    if (error) throw new Error("We couldn't save your email address. Please try again.");
    return { ok: true };
  });
