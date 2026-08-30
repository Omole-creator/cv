# CareerCV — In-House CV Grading Standard

A standalone scoring rubric for analyzing CVs against JobMingle Career Acceleration Services' in-house writing standard. This file is self-contained: it does not depend on any other file in this workspace and can be dropped into any folder and used on its own.

**Purpose:** given any CV (a client's draft, a competitor sample, a finished JobMingle CV), score it section by section against this rubric and return a numeric grade, a pass/fail on the hard gates, and a prioritized fix list. This file is for **analysis only**. It does not rewrite CVs; it grades them.

---

## How to Use This File

1. Read the full CV text (or extract text from the .docx/.pdf first — unzip a .docx and read `word/document.xml` if no text layer is available, or extract text from the PDF).
2. Score every category below out of its listed points. Give partial credit using the descriptors provided; do not round up out of politeness.
3. Check every item in the **Hard Gates** section. A single hard-gate failure caps the CV's total score and must be reported first, regardless of how high the category scores are.
4. Run the **Quantified Achievement Test** on every single bullet in the Work Experience section. This is the single most heavily weighted category and must be done bullet-by-bullet, not skimmed.
5. Sum the category scores into a total out of 100. Map to a rating band.
6. Report using the **Output Format** at the bottom of this file.

---

## Hard Gates (automatic fail conditions)

These are non-negotiable in the house style. If any of these are true, flag it as a **Hard Gate Failure**, cap the total score at 59/100 regardless of category totals, and list it first in the report.

- [ ] **Tables used anywhere** (Core Skills, contact line, dates, or any section built as a table). ATS parsers read table cells out of order and can drop content entirely. Any table = hard gate failure.
- [ ] **Em dashes used anywhere** ("—" or " - " used as a sentence-break substitute). The house rule is zero em dashes.
- [ ] **No numbers anywhere in the Work Experience section.** A CV with zero quantified bullets across the entire document fails regardless of how well-written the prose is.
- [ ] **Client's own name appears inside the Professional Summary.** Summaries are third person implied and never name the subject.
- [ ] **A degree or certification is stated as complete when the source material says "in progress" or "in view"**, or any other detail that reads as fabricated rather than sharpened truth. Flag suspected fabrication even without proof; a CV that reads as too good to be true (e.g. a role with no visible responsibilities suddenly credited with a company-wide save) should be flagged for the reviewer to verify against source material.
- [ ] **Timeline has an unexplained employment gap** (more than roughly 3 months unaccounted for, with no bridge role or explanation).

---

## Category Scoring (100 points total)

### A. Quantified Achievements — 30 points (the single most important category)

This is scored bullet by bullet using the **Quantified Achievement Test** below, then rolled up.

**The house shape for every bullet:**
> I did [what], using [how], which led to [result, with a number].

A bullet passes the test if it contains all three: an action, a method or context, and a measurable outcome. A bullet that only states a duty ("Responsible for managing vendor relationships") with no outcome fails the test outright, no matter how well it's phrased.

**Per-bullet grading (apply to every bullet in Work Experience):**
- **Strong (full credit):** Has a real number (%, ₦/currency, count, time saved, frequency, rating) AND the number is plausible for the seniority/setting described (e.g. a dental clinic processing ~50 purchase orders a month, not 500). Leads with the outcome or the action, not the duty.
- **Partial credit:** Has an outcome but no hard number ("improved turnaround time" with nothing to measure it), or has a number that is generic/implausible for the context (round numbers stacked suspiciously, or a number too large for the seniority level).
- **No credit (duty-only):** States a responsibility with no result at all ("Managed the front desk," "Handled customer complaints," "In charge of scheduling").

**Scoring formula:**
- Calculate the percentage of bullets in the CV that earn full credit ("Strong").
- 90–100% of bullets Strong → 30/30
- 70–89% → 22–29
- 50–69% → 14–21
- 25–49% → 6–13
- Under 25% → 0–5

**Additional checks inside this category (deduct up to 5 points total for violations, from the score above):**
- Deduct if the same achievement appears with **different numbers** across the CV or against a cover letter for the same client (numbers must match everywhere — corroboration, not just duplication).
- Deduct if a single strong result is not also echoed as the one key achievement in the Professional Summary (house rule: one key numbered achievement belongs in the summary and must match a bullet below it).
- Deduct if numbers look invented with no realism check applied (a "reduced costs by 90%" claim from a junior assistant, for example).

---

### B. Professional Summary — 10 points

- **Length and shape (3 pts):** 3–4 lines. Opens with current title and years of experience. Names 2–3 top strengths with specifics (not vague adjectives). Closes with what the candidate brings to the target role.
- **No filler (2 pts):** No "passionate about," "results-driven," "hardworking," "team player," or other unquantified filler adjectives standing in for proof.
- **Third person, no name (2 pts):** Never opens with or contains the candidate's name. Written in implied third person / no first-person "I" either.
- **One matching numbered achievement (2 pts):** Contains at least one specific, numbered achievement that also appears as a bullet in Work Experience.
- **Geography discipline (1 pt):** If the CV targets roles outside Nigeria, the summary contains no "Lagos" or "Nigeria" (the header may still carry it). If Nigeria-only, this check is automatically satisfied.

---

### C. Work Experience Structure — 10 points

- **Reverse chronological order (2 pts).**
- **Format consistency (2 pts):** Every role formatted identically: Title | Company, Location — with dates in Month YYYY – Month YYYY (or Present) format, right-aligned or consistently placed, never inside a table.
- **Bullet counts scaled to role importance (2 pts):** Most recent/strongest role carries the most bullets (6–8 in the house standard), mid roles fewer (5–6), short/bridge roles fewest (3–4). Flag a CV where an old, minor role has more bullets than the current role.
- **No unexplained gaps (2 pts):** Every gap of substance is bridged with a short entry or explained, not just cut for "focus."
- **Growth is visible where it exists (2 pts):** If the candidate was promoted within the same company, that's called out explicitly ("Promoted from [X] to [Y]...") rather than presented as two disconnected roles.

---

### D. Core Skills Section — 8 points

- **Correct format (3 pts):** Plain list, not a table. House standard is exactly 12 items for a finished JobMingle CV; for a general CV being analyzed, score full credit at 8–15 clearly relevant items, partial credit outside that range.
- **Relevance to target role (3 pts):** Skills are pulled from the candidate's actual demonstrated experience and aligned to the target role's language, not a generic skills dump copied from a template.
- **No invented competence (2 pts):** No skill is claimed that isn't backed by anything in the work history (e.g. listing "SQL" with zero evidence of database work anywhere in the CV is a red flag, not a strength).

---

### E. ATS Keyword Optimization — 15 points

- **Keyword presence (6 pts):** The CV contains the exact-phrase keywords a real job posting in this role/sector would scan for (title-exact phrasing, not synonyms — e.g. "Stakeholder Management" not "worked with stakeholders"). Score against how many of the obvious 8–10 keywords for that role/sector actually appear.
- **Distribution, not stuffing (4 pts):** Keywords appear naturally spread across summary, skills, and bullets — not crammed into one list or repeated unnaturally. Deduct for visible keyword stuffing (a skills section that reads like a scraped job description).
- **Volume in range (3 pts):** Roughly 15–25 distinct keywords/phrases across the whole document for a CV of this length. Fewer than 10 total is under-optimized; a huge, undifferentiated wall of keywords is over-stuffed.
- **Exact phrasing over paraphrase (2 pts):** Where a well-known industry phrase exists ("Travel Coordination," "Purchase Orders," "Vendor Management"), the CV uses that exact phrase rather than a paraphrased synonym.

---

### F. Writing Style and Language — 10 points

- **No em dashes (2 pts, hard-gated above but also scored here for degree of violation if somehow missed).**
- **No AI-sounding transitions (2 pts):** No "Furthermore," "Moreover," "Delving into," "In today's fast-paced world," or similar stock phrasing.
- **Plain, simple English (2 pts):** Jargon is translated into plain language where possible without losing precision ("handled the full purchasing process" over "end-to-end procurement cycle"). Score down for needless corporate jargon that obscures rather than clarifies.
- **Sentence rhythm (2 pts):** Bullets and summary read like natural, varied prose, not a robotic stack of clipped fragments.
- **Action-verb leads (2 pts):** Every bullet opens with a strong, specific action verb ("Reduced," "Negotiated," "Rebuilt"), never a weak opener like "Responsible for" or "Worked on."

---

### G. Design and ATS-Safe Formatting — 10 points

- **No tables anywhere (hard-gated above, scored here too): 3 pts** if fully clean.
- **Consistent, ATS-parseable header (2 pts):** Name, phone (with country code if relevant), email, city/country on the header; no unnecessary street address; contact info not embedded in a text box, image, or header/footer field that some ATS parsers skip.
- **Section order is standard and complete (2 pts):** Header → Professional Summary → Work Experience → Core Skills → Education → Certifications/Training, in a sensible, ATS-conventional order. No orphaned or missing standard section for the seniority level.
- **Length discipline (2 pts):** Roughly 1 page for under 5 years of experience, 2 pages beyond that. Penalize a CV that runs long purely from padding, or one so short it omits real experience.
- **No decorative clutter that risks parsing (1 pt):** No excessive graphics, icons-as-bullets, multi-column text boxes, or headers/footers carrying essential content that a plain-text ATS parser would miss.

---

### H. Truthfulness, Consistency and Defensibility — 7 points

- **Numbers are consistent everywhere they repeat (2 pts):** No contradicting figures for the same claim across sections or companion documents (cover letter, LinkedIn).
- **Claims match the seniority and setting described (2 pts):** No claim of scale or authority implausible for the stated title/company size (an entry-level assistant claiming they "led a 40-person division" without explanation is a red flag).
- **Years-of-experience claims match what's visible on the page (2 pts):** If the summary says "8 years of experience," the roles listed must actually sum to roughly that.
- **Degree/certification status stated accurately (1 pt):** "In view"/in-progress items are never presented as completed.

---

## Scoring Bands

| Total Score | Band | Meaning |
|---|---|---|
| 90–100 | **Excellent / interview-ready** | Meets house standard on nearly every axis. Minor polish only. |
| 75–89 | **Strong, needs targeted fixes** | Good bones, but specific sections (usually quantified achievements or ATS keywords) need rework. |
| 60–74 | **Weak, needs a substantial rewrite** | Structure is present but multiple core categories (especially quantified achievements) are underdeveloped. |
| Below 60, or any Hard Gate Failure | **Fails house standard** | Not ready to send. Hard gate violations must be fixed before anything else, regardless of numeric score. |

---

## Output Format

When reporting a CV analysis, always return, in this order:

1. **Total score / 100**, and the band it falls in.
2. **Hard Gate Failures** — list every one triggered, or state "None."
3. **Category-by-category breakdown** — one line per category with points earned / points possible and a one-line reason.
4. **Quantified Achievement Test detail** — the percentage of bullets that scored Strong, Partial, and No Credit, and 2–3 concrete examples of the weakest bullets quoted verbatim with a one-line suggestion for what number or outcome is missing.
5. **Top 5 fixes, ranked by impact** — the highest-leverage changes to move the score up a band, not an exhaustive list of every minor issue.
6. No rewriting of the CV itself unless explicitly asked. This file is for scoring and diagnosis only.
