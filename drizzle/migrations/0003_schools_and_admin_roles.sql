CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  colours jsonb NOT NULL DEFAULT '{}'::jsonb,
  logo_url text,
  subjects text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schools TO authenticated;
GRANT ALL ON public.schools TO service_role;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active schools" ON public.schools FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert schools" ON public.schools FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update schools" ON public.schools FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete schools" ON public.schools FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.selections ADD COLUMN school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL;

INSERT INTO public.schools (slug, name, tagline, colours) VALUES (
  'carmel-college', 'Carmel College', 'at Carmel College',
  '{"primary":"#4FB3DD","accent":"#D3E9F2","highlight":"#F5E6A8","background":"#0E3550"}'::jsonb
);

CREATE POLICY "Anyone views school logos" ON storage.objects FOR SELECT USING (bucket_id = 'school-logos');
CREATE POLICY "Admins upload school logos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'school-logos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update school logos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'school-logos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete school logos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'school-logos' AND public.has_role(auth.uid(), 'admin'));