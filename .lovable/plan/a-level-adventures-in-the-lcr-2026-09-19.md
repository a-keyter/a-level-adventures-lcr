# A Level Adventures in the LCR

A retro, choose-your-own-adventure tool that helps young people in the Liverpool City Region see where four A level subjects could take them — connected to the region's real economic priorities.

## The journey

**1. Title screen**
ASCII-art logo reading "A LEVEL ADVENTURES IN THE LCR", on an arcade-style backdrop, with a blinking Game Boy/Pokémon-style menu: `▶ START`. Keyboard and touch friendly.

**2. Pick four subjects**
A searchable, curated list of A levels offered at Liverpool City Region colleges (around 40 subjects, grouped by area). The player picks exactly four, sees them in a little "party" slot bar, and submits.

**3. Four quest ideas**
The AI reads the four subjects and proposes four multi-disciplinary research projects that sit at the crossroads of those subjects and the region's real skills and growth priorities, drawn from the LSIP report: AI and digital transformation, professional and business services, advanced manufacturing and clean energy, construction and the built environment, health and life sciences, the visitor economy, and the creative industries.

Each idea shows as a card. Tapping one opens a dialog with:
- What the project is
- Why it matters to the Liverpool City Region
- How each of their subjects feeds in
- **Where this could lead** — degrees, apprenticeships, careers, local employers

**4. Choose your quest**
Picking one triggers a second AI step that researches and produces a practical plan:
- Local organisations, employers and community partners who might back it
- How to approach them, with a short sample message
- A realistic six-to-twelve week plan built around **three hours a week, maximum two meetings**
- Roles for a small group of peers
- What "done" looks like, and how to share the findings

Downloadable as a **formatted PDF project plan** they can show teachers or partners.

**5. Optional ongoing support**
A friendly opt-in: leave an email to hear from local partners. Stored anonymously — the email row is linked to the choices only by a random ID, never by name.

## Design

- Liverpool City Region Combined Authority palette (purple/magenta with bright accents) reworked into a warm, friendly arcade skin
- Pixel/retro display type for headings, highly readable body type for everything else
- Chunky arcade panels, soft shadows, subtle CRT texture — playful, never childish
- Mobile-first: thumb-reachable controls, full-screen dialogs on small screens
- Full British English throughout
- Respects reduced-motion preferences; keyboard navigable

## Technical notes

- **Backend:** Lovable Cloud. Tables for subject selections, generated project sets, chosen projects with their plans, and an anonymous email signup table keyed only by UUID. Row-level security so nothing personal is publicly readable.
- **Caching:** project idea sets are keyed by the sorted, normalised four-subject combination, so a repeated combination is served instantly from the database with no regeneration. The per-project research plan is cached the same way.
- **AI:** server-side Lovable AI calls with structured output; the LSIP priorities are summarised into a compact local reference file used as prompt context, so no per-request document cost.
- **PDF:** generated client-side from the structured plan data, styled to match the app.
- **Structure:** components organised in clear subfolders — `components/arcade` (shared retro UI), `components/subjects`, `components/projects`, `components/plan`, `components/signup` — with routes for the title screen, subject picker, results and plan.

## Out of scope for this build

- No user accounts or sign-in; progress is carried by a session ID
- Emails are collected only; no mail is sent from the app yet
