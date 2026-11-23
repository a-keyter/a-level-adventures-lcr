-- Bonus round: the two extra A levels a player would add if they had a spare
-- option and a guaranteed job in a related field. Written only through the
-- validated saveBonusSubjects server function; table access stays locked down.
ALTER TABLE public.selections ADD COLUMN IF NOT EXISTS bonus_subjects TEXT[];
