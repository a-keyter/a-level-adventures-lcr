# School branding and admin area

## What changes for students
- The main page (`/`) becomes the generic **"A Level Adventures in the LCR"** version. It shows no school name and uses the full built-in subject list.
- Each school gets its own address, for example `/s/carmel-college`. There, the title screen, colours, logo and subject list come from that school's settings. The rest of the journey (subjects, chart, quests, plan, sign-up) keeps that school's look.
- Carmel College is added as the first school, using its current name, blue/cream colours and the full subject list.

## What changes for you (admins)
- A new `/admin` area, opened with a Google or email/password sign-in.
- Only people marked as admins can get in. You become the first admin once you sign up. Teammates can be made admins later from the admin area.
- Admin screens:
  - **Schools list**: add, edit, hide or show a school.
  - **School editor**: name, web address, tagline, colours (primary, accent, highlight, background) with a live preview, logo upload, and ticking which subjects that school offers.
- Each student's selection records which school it came from, so later you can see results per school.

## Technical details
- **Database** (one migration):
  - `schools`: slug (unique), name, tagline, colours as jsonb, logo_url, subject list as a text array (empty means all subjects), is_active.
  - `app_role` enum, `user_roles`, and a `has_role()` security-definer function, following the standard pattern.
  - A nullable `school_id` on `selections`.
  - Data access: everyone can read active schools; only admins can write. `user_roles` can be read by its owner.
  - Grants: anon/authenticated get SELECT on `schools`, authenticated gets SELECT on `user_roles`, service_role gets everything.
  - Carmel College is seeded in the same migration.
- **Storage**: a public `school-logos` bucket. Only admins can upload or delete files.
- **Auth**: turn on email sign-in, plus Google through managed social login. Add a public `/auth` page and the managed `_authenticated` layout, with `/admin` routes under `_authenticated/_admin` (checked with `has_role`). The first admin is granted by a one-off database insert once you've signed up.
- **Branding at runtime**: a public `getSchool(slug)` server function. Its result is applied as CSS variable overrides (`--primary`, `--accent`, `--highlight`, `--background`) on a wrapper. `AsciiTitle` takes an optional school name and logo. The generic page uses the default theme.
- **Routes**: `/s/$slug` (title screen), with the subjects flow taking an optional `school` search parameter that is carried through to quests and the plan. `startAdventure` accepts an optional `schoolSlug`. On the server it checks the subjects against that school's list and stores `school_id`.
- **Caching**: the cache of ideas for each subject combination stays shared across schools, because ideas depend only on the subjects.
- **Copy**: remove "Carmel College" from the root and index `head()` and from `AsciiTitle`. The `/s/$slug` `head()` uses the school's name.
- The existing rules that block public access to the adventure tables and keep emails separate stay as they are.

## Not included
- Per-school analytics dashboards and inviting admins by email.
