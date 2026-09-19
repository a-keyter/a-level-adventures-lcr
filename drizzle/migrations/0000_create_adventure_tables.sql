-- Cached project idea sets, keyed by the sorted subject combination
CREATE TABLE public.subject_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_key TEXT NOT NULL UNIQUE,
  subjects TEXT[] NOT NULL,
  ideas JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.subject_combinations TO anon;
GRANT SELECT, INSERT ON public.subject_combinations TO authenticated;
GRANT ALL ON public.subject_combinations TO service_role;
ALTER TABLE public.subject_combinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cached combinations" ON public.subject_combinations FOR SELECT USING (true);
CREATE POLICY "Anyone can add cached combinations" ON public.subject_combinations FOR INSERT WITH CHECK (true);

-- Cached research plans, one per project within a combination
CREATE TABLE public.project_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combination_id UUID NOT NULL REFERENCES public.subject_combinations(id) ON DELETE CASCADE,
  project_index INTEGER NOT NULL,
  plan JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (combination_id, project_index)
);

GRANT SELECT, INSERT ON public.project_plans TO anon;
GRANT SELECT, INSERT ON public.project_plans TO authenticated;
GRANT ALL ON public.project_plans TO service_role;
ALTER TABLE public.project_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cached plans" ON public.project_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can add cached plans" ON public.project_plans FOR INSERT WITH CHECK (true);

-- An anonymous player's run: their four subjects
CREATE TABLE public.selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combination_id UUID NOT NULL REFERENCES public.subject_combinations(id) ON DELETE CASCADE,
  subjects TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.selections TO anon;
GRANT SELECT, INSERT ON public.selections TO authenticated;
GRANT ALL ON public.selections TO service_role;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read selections" ON public.selections FOR SELECT USING (true);
CREATE POLICY "Anyone can add selections" ON public.selections FOR INSERT WITH CHECK (true);

-- The project a player chose
CREATE TABLE public.choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  selection_id UUID NOT NULL REFERENCES public.selections(id) ON DELETE CASCADE,
  combination_id UUID NOT NULL REFERENCES public.subject_combinations(id) ON DELETE CASCADE,
  project_index INTEGER NOT NULL,
  project_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.choices TO anon;
GRANT SELECT, INSERT ON public.choices TO authenticated;
GRANT ALL ON public.choices TO service_role;
ALTER TABLE public.choices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read choices" ON public.choices FOR SELECT USING (true);
CREATE POLICY "Anyone can add choices" ON public.choices FOR INSERT WITH CHECK (true);

-- Anonymous email sign-ups. Write-only for the public: never readable by anon.
CREATE TABLE public.support_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  choice_id UUID NOT NULL REFERENCES public.choices(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.support_signups TO anon;
GRANT INSERT ON public.support_signups TO authenticated;
GRANT ALL ON public.support_signups TO service_role;
ALTER TABLE public.support_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can sign up for support" ON public.support_signups FOR INSERT WITH CHECK (true);