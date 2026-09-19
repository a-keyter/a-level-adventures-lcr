-- All access now happens through validated server functions using the service role.
DROP POLICY IF EXISTS "Anyone can add choices" ON public.choices;
DROP POLICY IF EXISTS "Anyone can read choices" ON public.choices;
DROP POLICY IF EXISTS "Anyone can add cached plans" ON public.project_plans;
DROP POLICY IF EXISTS "Anyone can read cached plans" ON public.project_plans;
DROP POLICY IF EXISTS "Anyone can add selections" ON public.selections;
DROP POLICY IF EXISTS "Anyone can read selections" ON public.selections;
DROP POLICY IF EXISTS "Anyone can add cached combinations" ON public.subject_combinations;
DROP POLICY IF EXISTS "Anyone can read cached combinations" ON public.subject_combinations;
DROP POLICY IF EXISTS "Anyone can sign up for support" ON public.support_signups;

REVOKE ALL ON public.choices FROM anon, authenticated;
REVOKE ALL ON public.project_plans FROM anon, authenticated;
REVOKE ALL ON public.selections FROM anon, authenticated;
REVOKE ALL ON public.subject_combinations FROM anon, authenticated;
REVOKE ALL ON public.support_signups FROM anon, authenticated;

GRANT ALL ON public.choices TO service_role;
GRANT ALL ON public.project_plans TO service_role;
GRANT ALL ON public.selections TO service_role;
GRANT ALL ON public.subject_combinations TO service_role;
GRANT ALL ON public.support_signups TO service_role;

ALTER TABLE public.choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_signups ENABLE ROW LEVEL SECURITY;