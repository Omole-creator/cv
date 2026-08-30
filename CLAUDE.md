# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A free, single-page CV audit tool for JobMingle's CV writing service. Visitors upload a CV,
get a scored report of real issues found in their file, and are funneled through a form into
a WhatsApp message to buy a professionally written CV/cover letter. Everything runs client-side:
there is no backend, no database, and no paid API. The app is a fully static Next.js export
(every page in `next build` output shows as `○ (Static)`).

`careercv.md` at the repo root is JobMingle's real internal CV-grading rubric. It is the source
of truth for `lib/analyzeCv.ts` — every heuristic check in that file should trace back to a rule
in `careercv.md`. When changing scoring logic, check the rubric first.

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
- `analyzeCv.ts` — pure function, `ExtractedDocument -> CvReport`. Hard gates (em dash, no digits
  anywhere, a real table) cap the score the same way `careercv.md`'s rubric caps it. Everything
  else is a coarse, honestly-labeled proxy (e.g. quantified-bullet ratio counts digit-bearing
  lines that look like bullets — it is not the rubric's full 3-part quantified-achievement test).
  Import types from this file with `import type` — Node's native TS stripping (used by the unit
  tests) erases type-only imports but breaks on value imports of erased symbols.
- `pricing.ts` — the only place the actual naira figures live. Never imported by anything that
  renders text to the page.
- `whatsapp.ts` — builds the WhatsApp deep link and the two message templates (priced request vs.
  general contact), and rotates the two pricing-line phone numbers via a `localStorage` counter
  (`pickRotatingNumber`) so paid-intent volume lands evenly across both, falling back to a coin
  flip if `localStorage` is unavailable.

**The pricing/no-pricing boundary is structural, not cosmetic.** Prices exist only inside
`pricing.ts` and the message strings `whatsapp.ts` builds from it, which only ever end up in a
`wa.me` `href`/`window.open` target — never as rendered page text. The general "Chat on WhatsApp"
button (footer + nav Contact) is intentionally a separate, simpler path: fixed number, no form,
no price. Don't add a shortcut that prints a price into JSX; the Playwright suite asserts the
page body never contains `₦`.

**Flow, orchestrated in `app/page.tsx`:** file drop → `extractDocument` → `analyzeCv` (padded to
a minimum ~3.6s "Analyzing…" state via `Promise.all` with a timer, so small files don't feel
instant and unconvincing) → `<Report>` renders findings and, on clicking the primary CTA, expands
`<RequestForm>` inline (name, experience band, service) → submit builds the message via
`whatsapp.ts` and opens it in a new tab.

**Testing wa.me links:** `wa.me` is a real external service that redirects on navigation. Don't
assert on a popup's post-navigation URL — intercept and abort the request with
`context.route("https://wa.me/**", ...)` and assert on `route.request().url()` instead (see the
"rotates numbers" test in `tests/landing.spec.ts`).

## Notable version choices

Next.js 16 (Turbopack by default) + React 18 + ESLint 9.39.x pinned deliberately — ESLint 10 broke
`eslint-plugin-react`'s `context.getFilename()` usage as of `eslint-config-next@16.3.3`; revisit
the pin once upstream catches up. `next.config.mjs` has no custom `webpack()` — a webpack config
with no matching `turbopack` config is a hard build error on Next 16.
