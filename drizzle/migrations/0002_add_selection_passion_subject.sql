-- Passion subject: the one extra A level a player would add if they had a spare
-- option and a guaranteed job in a related field. Written only through the
-- validated savePassionSubject server function; table access stays locked down.
ALTER TABLE public.selections ADD COLUMN IF NOT EXISTS passion_subject TEXT;
