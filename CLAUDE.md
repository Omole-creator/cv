# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A free, single-page CV audit tool for JobMingle's CV writing service. Visitors upload a CV,
get a full section-by-section breakdown of real issues found in their file, and are funneled
through a form into a WhatsApp message to buy a professionally written CV/cover letter.
Everything runs client-side: there is no backend, no database, and no paid API. The app is a
fully static Next.js export (every page in `next build` output shows as `○ (Static)`).

`careercv.md` at the repo root is JobMingle's real internal CV-grading rubric. It is the source
of truth for `lib/analyzeCv.ts` — the 8 scored categories, their point weights (30/10/10/8/15/
10/10/7 = 100), and the hard gates all map directly to rubric sections A through H. When
changing scoring logic, check the rubric first. The one deliberate departure: the report gives
away the full breakdown (not a teaser), per an explicit product decision to prioritize
credibility over holding back detail — see git history around the "detailed breakdown" commit
if the reasoning needs revisiting.

`COPYWRITING-PLAYBOOK.md` at the repo root governs all on-page copy (hero, report copy, button
labels, everything user-facing). Section 0.1's house style rules are non-negotiable: no em
dashes, no thesaurus words, plain spoken language, 1-3 line paragraphs. Re-read it before writing
or editing any copy on the site.

## Commands

```bash
npm run dev              # start the dev server (localhost:3000)
npm run build             # production build (must stay fully static)
npm run lint               # eslint . (there is no `next lint` in Next 16 — use eslint directly)
npm test                    # unit tests: node --test tests/unit/**/*.test.mjs
npm run test:e2e         # Playwright end-to-end suite (tests/landing.spec.ts)
```

Run a single unit test file: `node --test tests/unit/analyzeCv.test.mjs`
Run a single Playwright test: `npx playwright test -g "the request form sends"`

Test fixtures under `tests/fixtures/` are generated, not hand-authored binaries. Regenerate them with:
```bash
node tests/fixtures/generate.mjs       # clean.docx, table-and-emdash.docx (via JSZip, raw OOXML)
node tests/fixtures/generate-pdf.mjs   # quantified.pdf (hand-built PDF with a real text layer)
```

## Architecture

**`lib/` holds all the real logic, deliberately kept framework-free and independently testable:**
- `extractText.ts` — turns an uploaded `File` into `{ text, hasTable, isUnreadable, fileType }`.
  PDFs go through `pdfjs-dist` (dynamically imported, worker loaded via `new URL(...)`), with a
  y-coordinate line-reconstruction pass (`reconstructLines`) because pdf.js returns a flat list of
  positioned text fragments, not lines — bullet-level heuristics need real line breaks. DOCX goes
  through `mammoth`'s browser build (raw text + a parallel `convertToHtml` just to sniff `<table>`
  tags for the table hard gate). Images and text-less PDFs short-circuit to `isUnreadable: true`
  rather than attempting OCR — a CV that's just a photo genuinely can't be read by ATS software,
  so that fact itself becomes the finding instead of a workaround.
- `analyzeCv.ts` — pure function, `ExtractedDocument -> CvReport`. Hard gates (zero digits inside
  the Work Experience section, a real table) cap the total at 59 the same way `careercv.md`'s
  rubric caps it, regardless of category totals. An em dash is deliberately **not** a hard gate:
  that's JobMingle's in-house writing rule for CVs it writes itself, not something fair to fail an
  external CV against, so it only costs 2 points inside the Writing Style category. Numbers are
  only ever required in Work Experience, no other category (summary, skills, etc.) penalizes their
  absence, though a measurable achievement in the summary earns a small bonus if it's there.
  `categories` holds one `CategoryReport` per rubric section (quantified achievements, summary,
  experience structure, skills, keywords, writing style, formatting, truthfulness), each with its
  own points/findings/what-to-do list rendered as an expandable row in `<Report>`. Everything is a
  coarse, honestly-labeled proxy, not the full rubric test (e.g. quantified-bullet ratio, scoped to
  bullets inside the Experience section, counts digit-bearing lines that look like bullets, not the
  rubric's full 3-part shape test; truthfulness can't be verified automatically at all, so it
  auto-grants full credit and is presented as "self-check" guidance, never a fabricated score).
  Findings and what-to-do text say "measurable achievement," never "number" or "include a number,"
  that wording change was deliberate, keep it consistent in new categories.
  Any regex that scans a whole joined-text blob for multi-word phrases (see `categoryKeywords`)
  must operate per-line, not on `text` with `\n` treated as whitespace — a cross-line match once
  concatenated the candidate's own name with the next line's section header and reported it back
  as a "keyword," which is exactly the kind of wrong-looking output that kills trust in the tool.
  Import types from this file with `import type` — Node's native TS stripping (used by the unit
  tests) erases type-only imports but breaks on value imports of erased symbols. `BAND_RANGES`
  is the single source of truth for score-band cutoffs; `bandFor()` and the "What your score
  means" legend in `components/HowItWorks.tsx` both read it, so don't hardcode the numeric
  cutoffs (90/80/70/60/40) anywhere else, they'd drift.
  Section detection (`findSection`) matches headings against per-section-type synonym lists
  (`EXPERIENCE_HEADINGS`, `SKILLS_HEADINGS`, etc., combined into `HEADER_PATTERN` for section
  boundaries), not one hardcoded regex per section — real CVs head their skills section `SKILL`,
  `SKILLS AND COMPETENCIES`, `CORE COMPETENCIES`, `AREAS OF EXPERTISE`, and their experience
  section `Professional Experience`, `Business Experience`, `Employment History`, and a single
  literal pattern misses most of those. Add new phrasings to the relevant list rather than
  reaching for a one-off regex at the call site. The Work Experience heading match is also what
  scopes quantified-achievement checking (`experienceBullets`, `checkNoDigitsInExperience`) to
  that section only — get it wrong and the fallback (`scope = block.length > 0 ? block : lines`,
  which exists only for CVs with no section headings at all) silently widens the scan to the
  whole document, penalizing missing numbers in Education/Skills/Summary, which the rubric never
  requires.
- `pricing.ts` — the only place the actual naira figures live. Never imported by anything that
  renders text to the page.
- `whatsapp.ts` — builds the WhatsApp deep link and the two message templates (priced request vs.
  general contact), and rotates the two pricing-line phone numbers via a `localStorage` counter
  (`pickRotatingNumber`) so paid-intent volume lands evenly across both, falling back to a coin
  flip if `localStorage` is unavailable.

**The pricing boundary is: never visible until the visitor has actively chosen a band and a
service inside the request form.** `pricing.ts` is the single source of truth for the naira
figures. Before that point (initial load, report, form just opened with nothing picked yet) no
price renders anywhere — the Playwright suite asserts the page body contains no `₦`. Once both
`RequestForm` selects are made, showing the live price inline (`data-testid="form-quote"`) is
intentional, deliberate checkout-style UX, not a leak — a later test step asserts the price *does*
appear there. The general "Chat on WhatsApp" button (footer + nav Contact) stays a separate,
simpler path: fixed number, no form, no price, ever.

**Flow, orchestrated in `app/page.tsx`:** file drop → `extractDocument` → `analyzeCv` (padded to
a minimum ~3.6s "Analyzing…" state via `Promise.all` with a timer, so small files don't feel
instant and unconvincing) → `<Report>` renders the score and band label (no descriptive sentence
under it, straight to the findings), hard gate failures, the 8-category breakdown (each row an
accordion, collapsed by default, "What to do" rendered as the same numbered-step style as the fix
list below it), then a personalized "Here's how you can fix this yourself" step list, then
`<RequestForm>` (name, experience band, service, live price once both are picked). Submit builds
the message via `whatsapp.ts` and opens it in a new tab. `<ScoreCard>` (save/copy) comes after
that, and the report closes with a short "Note" callout plus one more CTA below it.

**The fix-it-yourself steps are generated, not static copy.** `buildFixSteps()` in `Report.tsx`
turns each hard gate failure and each weak/needs-work category into one step, using that
category's own `findings[0]` (the specific thing detected in *this* file) plus its `whatToDo[0]`
action, capped at 6 steps and ordered worst-first. Two different CVs should produce two different
step lists. Don't replace this with a static paragraph, that was an earlier version and it read as
generic advice instead of a real diagnosis. There's no explicit "this takes a weekend and is easy
to get wrong" framing anywhere, that was deliberately removed — the difficulty should be felt from
the length and specificity of the step list itself, not stated outright.

There are two CTA entry points into the same `showForm` state and the same `<RequestForm>`
instance: `data-testid="primary-cta"` sits right after the fix-it-yourself steps,
`data-testid="secondary-cta"` sits in the closing "Note" callout at the very bottom, after
`<ScoreCard>`. Both call `openForm()`, which sets `showForm` and scrolls to the form's ref
(`formSlotRef`). Keep it to one `<RequestForm>` instance; don't duplicate the form itself at both
spots. `data-testid="hard-gate-failures"` scopes assertions to just the Critical Failures block,
useful since a hard-gate-triggering finding may also get echoed into the always-visible fix-steps
list further down the same page.

**`/writing` is a separate long-form sales page** (`app/writing/page.tsx`, client pieces in
`components/writing/`), rebuilt from jobmingle.co/careerservice. Its goal is a form fill, not a
payment: there are no checkout links, and package buttons only preselect the package in the form
at the bottom (`PackageContext`) before it opens WhatsApp on the single number in
`lib/writingPackages.ts` (not the rotating pair). Unlike `/`, this page shows naira prices on
purpose, so they live in `writingPackages.ts`, never in `pricing.ts`. Proof screenshots in
`public/writing/` hide phone numbers (cropped out, or last 4 digits blurred); keep it that way for
new ones. Each pricing card strikes through `totalValue()` (price + every bonus value, including
lower tiers, unless the package sets `countLowerBonuses: false`, as Premium does) to reveal the real price.
The hero headline is Geist in a stacked-scale layout (small, medium, one huge gold line,
medium); body subheads use the `font-helvetica` stack. Bonus values in `writingPackages.ts` are placeholders.
Motion on `/writing` (scroll reveals, the gold highlighter sweep, hero chat) is CSS in
`globals.css` under `.w-*` / `html.fx`, driven by one observer in `components/writing/ScrollFx.tsx`;
an inline script sets `html.fx` so nothing is hidden if JS fails. Videos play inline via
`YouTubeLite` and only load the YouTube iframe after a click.

**Page structure:** Navbar → Hero → Report (only once a file's been processed) → How it Works →
Footer. There is no About or FAQ section, they were cut deliberately as not needed. Don't re-add
them without being asked.

**Testing wa.me links:** `wa.me` is a real external service that redirects on navigation. Don't
assert on a popup's post-navigation URL — intercept and abort the request with
`context.route("https://wa.me/**", ...)` and assert on `route.request().url()` instead (see the
"rotates numbers" test in `tests/landing.spec.ts`).

## Notable version choices

Next.js 16 (Turbopack by default) + React 18 + ESLint 9.39.x pinned deliberately — ESLint 10 broke
`eslint-plugin-react`'s `context.getFilename()` usage as of `eslint-config-next@16.3.3`; revisit
the pin once upstream catches up. `next.config.mjs` has no custom `webpack()` — a webpack config
with no matching `turbopack` config is a hard build error on Next 16.

## Visual system

- Brand colors in `tailwind.config.ts` (`ink`, `gold`) are sampled directly from `public/logo.jpg`
  (`#060D29` navy, `#F4CB19` gold), not the placeholder hex values from the original spec.
- Headline font is Geist (the `geist` npm package, `GeistSans.variable` set on `<html>` in
  `app/layout.tsx`, mapped to the `font-display` Tailwind class), body font is Manrope. Next's
  `next/font/google` doesn't carry Geist, hence the separate package.
