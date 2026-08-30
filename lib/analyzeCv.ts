import type { ExtractedDocument } from "./extractText.ts";

export type Finding = {
  id: string;
  label: string;
  detail: string;
  example?: string;
};

export type Band = "excellent" | "very-strong" | "strong" | "needs-work" | "weak" | "critical";
export type CategoryVerdict = "strong" | "needs-work" | "weak" | "info-only";

export const BAND_LABELS: Record<Band, string> = {
  excellent: "Excellent",
  "very-strong": "Very Strong",
  strong: "Strong",
  "needs-work": "Needs Work",
  weak: "Weak",
  critical: "Critical",
};

// Single source of truth for score bands: bandFor() below and the on-site
// score guide (components/HowItWorks.tsx) both read from this list, so the
// ranges shown to visitors can never drift from what actually gets computed.
export const BAND_RANGES: { band: Band; min: number; max: number }[] = [
  { band: "excellent", min: 90, max: 100 },
  { band: "very-strong", min: 80, max: 89 },
  { band: "strong", min: 70, max: 79 },
  { band: "needs-work", min: 60, max: 69 },
  { band: "weak", min: 40, max: 59 },
  { band: "critical", min: 0, max: 39 },
];

export type CategoryReport = {
  id: string;
  label: string;
  pointsEarned: number;
  maxPoints: number;
  verdict: CategoryVerdict;
  summary: string;
  findings: string[];
  whatToDo: string[];
};

export type CvReport = {
  score: number;
  band: Band;
  hardGateFailures: Finding[];
  categories: CategoryReport[];
  isUnreadable: boolean;
  quantifiedRatio: number;
};

// Only the literal em dash character. A plain " - " is extremely common in
// legitimate CV formatting (job title - company, date - date) and flagging
// it would false-positive on completely normal CVs.
const EM_DASH_PATTERN = /—/;
const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const LINKEDIN_PATTERN = /linkedin\.com/i;
const WEAK_OPENERS = [
  "responsible for",
  "duties included",
  "in charge of",
  "worked on",
  "tasked with",
];
const FILLER_WORDS = [
  "hardworking",
  "team player",
  "passionate",
  "results-driven",
  "detail-oriented",
  "results driven",
  "detail oriented",
];
const STIFF_PHRASES = [
  "furthermore",
  "moreover",
  "in today's competitive job market",
  "delve",
  "utilize",
  "leverage",
  "myriad",
  "plethora",
];
const BULLET_PREFIX = /^[\s]*[•\-*●▪◦]\s+/;
const YEAR_PATTERN = /\b(19|20)\d{2}\b/;
const DATE_RANGE_PATTERN = /\b(19|20)\d{2}\s*(-|–|to)\s*((19|20)\d{2}|present)\b/i;
const HEADER_PATTERN =
  /^(professional summary|summary|work experience|experience|core skills|skills|education|certifications?|training|projects)$/i;
const TITLE_CASE_PHRASE = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g;

function splitLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function looksLikeBullet(line: string): boolean {
  if (BULLET_PREFIX.test(line)) return true;
  const words = line.split(/\s+/).length;
  return words >= 4 && words <= 30 && /^[A-Z]/.test(line);
}

function findSection(lines: string[], startPattern: RegExp): string[] {
  const startIdx = lines.findIndex((l) => startPattern.test(l.trim()));
  if (startIdx === -1) return [];
  const rest = lines.slice(startIdx + 1);
  const endIdx = rest.findIndex((l) => HEADER_PATTERN.test(l.trim()));
  return endIdx === -1 ? rest : rest.slice(0, endIdx);
}

function scaleWithinBand(
  value: number,
  bandMin: number,
  bandMax: number,
  pointsMin: number,
  pointsMax: number
): number {
  if (bandMax === bandMin) return pointsMax;
  const t = Math.min(1, Math.max(0, (value - bandMin) / (bandMax - bandMin)));
  return Math.round(pointsMin + t * (pointsMax - pointsMin));
}

function verdictFor(pointsEarned: number, maxPoints: number): CategoryVerdict {
  const ratio = maxPoints === 0 ? 1 : pointsEarned / maxPoints;
  if (ratio >= 0.75) return "strong";
  if (ratio >= 0.4) return "needs-work";
  return "weak";
}

// --- Hard gates (careercv.md: automatic score cap regardless of category totals) ---
// Em dashes are deliberately NOT a hard gate here: that's JobMingle's in-house
// writing standard for CVs it writes itself, not a rule an external CV should
// be failed against. It's still scored (as a deduction) inside categoryWriting.

function checkNoDigitsInExperience(lines: string[]): Finding | null {
  const block = findSection(lines, /^(work )?experience$/i);
  // Numbers are only required in Work Experience. If we can't even find that
  // section, there's nothing fair to check here.
  if (block.length === 0) return null;
  const hasAnyDigit = block.some((line) => /\d/.test(line));
  if (hasAnyDigit) return null;
  return {
    id: "no-numbers",
    label: "No measurable achievements in Work Experience",
    detail:
      "Not one figure, percentage, or count in your Experience section. Without at least one measurable achievement, there's nothing for a hiring manager to judge your work against.",
  };
}

function checkTable(hasTable: boolean): Finding | null {
  if (!hasTable) return null;
  return {
    id: "table-layout",
    label: "Layout built with a table",
    detail:
      "Tables get read out of order, or dropped entirely, by most ATS parsers. Content inside one can vanish before a person ever opens the file.",
  };
}

function unreadableFinding(fileType: ExtractedDocument["fileType"]): Finding {
  const isImage = fileType === "image";
  return {
    id: "unreadable-file",
    label: isImage
      ? "This is a photo or scanned image, not a text document"
      : "No selectable text found in this file",
    detail:
      "ATS software reads text, not pixels. A CV submitted this way is very likely getting filtered out automatically, before anyone sees it.",
  };
}

// --- Categories (careercv.md's 8 scored sections, weights preserved: 30/10/10/8/15/10/10/7 = 100) ---

function experienceBullets(lines: string[]): string[] {
  const block = findSection(lines, /^(work )?experience$/i);
  const scope = block.length > 0 ? block : lines;
  return scope.filter(looksLikeBullet);
}

function quantifiedRatio(lines: string[]): number {
  const bullets = experienceBullets(lines);
  if (bullets.length === 0) return 0;
  const quantified = bullets.filter((line) => /\d/.test(line));
  return quantified.length / bullets.length;
}

function categoryQuantified(lines: string[], ratio: number): CategoryReport {
  const bullets = experienceBullets(lines);
  const quantifiedBullets = bullets.filter((line) => /\d/.test(line));
  const weakExamples = bullets.filter((line) => !/\d/.test(line)).slice(0, 2);

  let points: number;
  if (bullets.length === 0) points = 0;
  else if (ratio >= 0.9) points = 30;
  else if (ratio >= 0.7) points = scaleWithinBand(ratio, 0.7, 0.9, 22, 29);
  else if (ratio >= 0.5) points = scaleWithinBand(ratio, 0.5, 0.7, 14, 21);
  else if (ratio >= 0.25) points = scaleWithinBand(ratio, 0.25, 0.5, 6, 13);
  else points = scaleWithinBand(ratio, 0, 0.25, 0, 5);

  const findings: string[] = [
    bullets.length
      ? `${quantifiedBullets.length} of ${bullets.length} bullets in your Experience section include a measurable achievement.`
      : "We couldn't find clear bullet lines in your Experience section to check.",
  ];
  weakExamples.forEach((line) => findings.push(`No measurable achievement in: "${line}"`));

  return {
    id: "quantified",
    label: "Quantified Achievements",
    pointsEarned: points,
    maxPoints: 30,
    verdict: bullets.length === 0 ? "weak" : verdictFor(points, 30),
    summary:
      bullets.length === 0
        ? "We couldn't find bullet points to check for results."
        : `About ${Math.round(ratio * 100)}% of your Experience bullets show a measurable achievement.`,
    findings,
    whatToDo: [
      "Use this shape for every bullet: I did [what], using [how], which led to [result you can measure].",
      "A measurable achievement can be a percentage, a naira figure, a count, or time saved, anything a hiring manager can weigh.",
      "If you genuinely can't attach a figure, describe the scale instead: team size, volume handled, how often.",
    ],
  };
}

function categorySummary(lines: string[]): CategoryReport {
  const block = findSection(lines, /^(professional )?summary$/i);
  if (block.length === 0) {
    return {
      id: "summary",
      label: "Professional Summary",
      pointsEarned: 0,
      maxPoints: 10,
      verdict: "weak",
      summary: "We couldn't find a clear summary section near the top.",
      findings: ["No section labelled Summary (or Professional Summary) was found."],
      whatToDo: [
        "Add 3 to 4 lines right under your name and contact details.",
        "Open with your current title and years of experience.",
        "Name 2 to 3 real strengths with specifics, not adjectives like \"hardworking\".",
        "Close with one measurable achievement that also appears in your Experience section.",
      ],
    };
  }

  const text = block.join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lengthPoints = wordCount >= 35 && wordCount <= 100 ? 3 : wordCount > 0 ? 2 : 0;
  const fillerFound = FILLER_WORDS.filter((w) => text.toLowerCase().includes(w));
  const fillerPoints = Math.max(0, 2 - fillerFound.length);
  const firstPerson = /^\s*i\s+(am|have|possess)/i.test(text) || /\bi've\b/i.test(text);
  const voicePoints = firstPerson ? 0 : 2;
  const hasNumber = /\d/.test(text);
  const echoPoints = hasNumber ? 2 : 0;
  const geoPoints = 1;
  const points = lengthPoints + fillerPoints + voicePoints + echoPoints + geoPoints;

  const findings: string[] = [`Summary runs about ${wordCount} words.`];
  if (fillerFound.length) findings.push(`Filler language found: ${fillerFound.join(", ")}.`);
  if (firstPerson)
    findings.push('Opens in first person ("I am"/"I have"). House style keeps this implied, no "I".');
  findings.push(
    hasNumber
      ? "Includes a measurable achievement, that's worth the bonus point."
      : "No measurable achievement in the summary yet. That's optional, especially early in your career, but adding one earns extra credit."
  );

  return {
    id: "summary",
    label: "Professional Summary",
    pointsEarned: points,
    maxPoints: 10,
    verdict: verdictFor(points, 10),
    summary: `${wordCount} words${hasNumber ? ", includes a measurable achievement" : ""}.`,
    findings,
    whatToDo: [
      "3 to 4 lines. Open with your title and years of experience.",
      'Name 2 to 3 specific strengths, skip filler like "passionate" or "hardworking".',
      "If you have one, end with the measurable achievement that best proves you're good at the job, and make sure it also shows up in your Experience section.",
    ],
  };
}

function categoryExperience(lines: string[]): CategoryReport {
  const roleLines = lines.filter((l) => DATE_RANGE_PATTERN.test(l));

  if (roleLines.length === 0) {
    return {
      id: "experience",
      label: "Work Experience Structure",
      pointsEarned: 5,
      maxPoints: 10,
      verdict: "needs-work",
      summary: "We couldn't clearly detect date ranges on your role lines.",
      findings: [
        'We look for lines like "Title, Company - Month YYYY to Present" and didn\'t find a clear match.',
      ],
      whatToDo: [
        "Format every role the same way: Title, Company, Location, then a date range.",
        "List roles in reverse chronological order, most recent first.",
        'Call out promotions explicitly ("Promoted from X to Y") rather than as two disconnected roles.',
      ],
    };
  }

  const years = roleLines
    .map((l) => Number(l.match(YEAR_PATTERN)?.[0]))
    .filter((n) => !Number.isNaN(n));
  let descending = true;
  for (let i = 1; i < years.length; i += 1) {
    if (years[i] > years[i - 1]) descending = false;
  }
  const orderPoints = years.length < 2 ? 5 : descending ? 6 : 1;
  const formatPoints = 4;
  const points = orderPoints + formatPoints;
  const promoted = lines.some((l) => /promoted/i.test(l));

  const findings: string[] = [
    `Found ${roleLines.length} role line${roleLines.length === 1 ? "" : "s"} with a clear date range.`,
  ];
  if (years.length >= 2 && !descending)
    findings.push("Roles don't read in reverse chronological order (most recent first).");
  if (promoted) findings.push("Found a promotion called out explicitly, good.");

  return {
    id: "experience",
    label: "Work Experience Structure",
    pointsEarned: points,
    maxPoints: 10,
    verdict: verdictFor(points, 10),
    summary:
      years.length >= 2 && !descending
        ? "Role order looks out of sequence."
        : "Role dates read in a consistent format.",
    findings,
    whatToDo: [
      "Most recent role first, working backward.",
      "Same format every time: Title | Company, Location, then Month YYYY to Month YYYY (or Present).",
      "Give your strongest, most recent role the most bullets. Older or short bridge roles get fewer.",
    ],
  };
}

function categorySkills(lines: string[]): CategoryReport {
  const block = findSection(lines, /^(core )?skills$/i);
  if (block.length === 0) {
    return {
      id: "skills",
      label: "Core Skills",
      pointsEarned: 0,
      maxPoints: 8,
      verdict: "weak",
      summary: "No Skills section found.",
      findings: ["We couldn't find a section labelled Skills or Core Skills."],
      whatToDo: [
        "Add a plain list of 8 to 15 skills pulled from your actual experience, not a generic template list.",
        "Match the wording to how your target role's job ads phrase things.",
      ],
    };
  }

  const items = block
    .join(", ")
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const count = items.length;
  const points = count >= 8 && count <= 15 ? 8 : count > 0 ? 5 : 0;

  return {
    id: "skills",
    label: "Core Skills",
    pointsEarned: points,
    maxPoints: 8,
    verdict: verdictFor(points, 8),
    summary: `${count} skill${count === 1 ? "" : "s"} listed.`,
    findings: [
      count >= 8 && count <= 15
        ? `${count} items sits right in the sweet spot (8 to 15).`
        : `${count} items is outside the 8 to 15 sweet spot.`,
    ],
    whatToDo: [
      "Aim for 8 to 15 items, as a plain list, never a table.",
      "Every skill listed should be backed by something visible in your Experience section.",
      "Use the exact phrase your target industry uses, not a paraphrase.",
    ],
  };
}

function categoryKeywords(lines: string[]): CategoryReport {
  // Match within each line only, never across a newline, and skip the
  // name/contact/header lines, otherwise the candidate's own name or a
  // section title like "Professional Summary" gets caught as a "keyword".
  const contentLines = lines.filter((line, i) => {
    if (i === 0) return false;
    if (HEADER_PATTERN.test(line)) return false;
    if (EMAIL_PATTERN.test(line) || LINKEDIN_PATTERN.test(line)) return false;
    return true;
  });
  const matches = contentLines.flatMap((line) => line.match(TITLE_CASE_PHRASE) ?? []);
  const distinct = Array.from(new Set(matches.map((p) => p.trim())));
  const volume = distinct.length;

  let points: number;
  if (volume >= 15 && volume <= 25) points = 15;
  else if (volume >= 8) points = 10;
  else if (volume > 0) points = 5;
  else points = 2;

  return {
    id: "keywords",
    label: "ATS Keyword Optimization",
    pointsEarned: points,
    maxPoints: 15,
    verdict: verdictFor(points, 15),
    summary: `About ${volume} industry-style phrase${volume === 1 ? "" : "s"} found across the document.`,
    findings: [
      volume
        ? `Examples spotted: ${distinct.slice(0, 4).join(", ")}.`
        : "We didn't spot multi-word, Title Case phrases the way job ads usually write skills.",
      "We can't check this against a specific job posting since none was uploaded, this is a volume check only.",
    ],
    whatToDo: [
      "Pull 5 to 7 real job ads in your exact field and note the phrases that repeat across all of them.",
      'Use the exact phrase from the job ad ("Stakeholder Management," not "worked with stakeholders").',
      "Spread them across your summary, skills, and bullets. Don't cram them only into the skills list.",
    ],
  };
}

function categoryWriting(text: string, lines: string[]): CategoryReport {
  let points = 10;
  const findings: string[] = [];

  if (EM_DASH_PATTERN.test(text)) {
    points -= 2;
    findings.push("Uses an em dash somewhere. A period or a comma usually reads more natural.");
  }
  const stiffFound = STIFF_PHRASES.filter((p) => text.toLowerCase().includes(p));
  if (stiffFound.length) {
    points -= 2;
    findings.push(`Stiff, corporate phrasing found: ${stiffFound.join(", ")}.`);
  }
  const fillerFound = FILLER_WORDS.filter((w) => text.toLowerCase().includes(w));
  if (fillerFound.length) {
    points -= 2;
    findings.push(`Filler language: ${fillerFound.join(", ")}.`);
  }
  const weakOpeners = lines.filter((l) =>
    WEAK_OPENERS.some((phrase) => l.toLowerCase().startsWith(phrase))
  );
  if (weakOpeners.length) {
    points -= Math.min(2, weakOpeners.length);
    findings.push(
      `${weakOpeners.length} line${weakOpeners.length === 1 ? "" : "s"} open${
        weakOpeners.length === 1 ? "s" : ""
      } with a weak verb like "Responsible for".`
    );
  }
  points = Math.max(0, points);
  if (!findings.length) findings.push("No stiff phrasing, filler words, or weak openers found.");

  return {
    id: "writing",
    label: "Writing Style & Language",
    pointsEarned: points,
    maxPoints: 10,
    verdict: verdictFor(points, 10),
    summary: findings[0],
    findings,
    whatToDo: [
      "Open every bullet with a strong, specific verb: Reduced, Negotiated, Rebuilt, never \"Responsible for\".",
      "Cut filler adjectives that claim a trait instead of proving it.",
      "Read it out loud. If a sentence doesn't sound like something you'd say, rewrite it.",
    ],
  };
}

function categoryFormatting(text: string, hasTable: boolean): CategoryReport {
  let points = 10;
  const findings: string[] = [];

  if (hasTable) {
    points -= 4;
    findings.push("Layout uses a table. Some ATS parsers drop table content entirely.");
  }
  const hasEmail = EMAIL_PATTERN.test(text);
  const hasLinkedIn = LINKEDIN_PATTERN.test(text);
  if (!hasEmail) {
    points -= 2;
    findings.push("No email address found on the page.");
  }
  if (!hasLinkedIn) {
    points -= 1;
    findings.push("No LinkedIn URL found.");
  }
  const sectionsFound = [/experience/i, /skills/i, /education/i].filter((re) => re.test(text)).length;
  if (sectionsFound < 3) {
    points -= 3 - sectionsFound;
    findings.push("Missing one of the standard sections: Experience, Skills, or Education.");
  }
  points = Math.max(0, points);
  if (!findings.length) findings.push("Header, sections, and layout all read clean.");

  return {
    id: "formatting",
    label: "Design & ATS-Safe Formatting",
    pointsEarned: points,
    maxPoints: 10,
    verdict: verdictFor(points, 10),
    summary: findings[0],
    findings,
    whatToDo: [
      "Keep the header plain text: name, phone, email, city. No text boxes, no header/footer fields.",
      "Standard section order: Header, Summary, Experience, Skills, Education, Certifications.",
      "No tables, icon bullets, or multi-column layouts. Plain text parses cleanest.",
    ],
  };
}

function categoryTruthfulness(): CategoryReport {
  return {
    id: "truthfulness",
    label: "Truthfulness & Consistency",
    pointsEarned: 7,
    maxPoints: 7,
    verdict: "info-only",
    summary: "This one needs a human read, not a script.",
    findings: [
      "An automated check can't verify honesty or consistency. That takes a person reading the whole document.",
    ],
    whatToDo: [
      "Make sure the same number for the same achievement matches everywhere it appears, including a cover letter.",
      "Check that any claim of scale matches your actual seniority and title.",
      "If your summary states years of experience, make sure your listed roles actually add up to that.",
      "Never present an in-progress degree or certification as completed.",
    ],
  };
}

function bandFor(score: number): Band {
  const match = BAND_RANGES.find((range) => score >= range.min && score <= range.max);
  return match ? match.band : "critical";
}

export function analyzeCv(doc: ExtractedDocument): CvReport {
  if (doc.isUnreadable) {
    const finding = unreadableFinding(doc.fileType);
    return {
      score: 22,
      band: bandFor(22),
      hardGateFailures: [finding],
      categories: [],
      isUnreadable: true,
      quantifiedRatio: 0,
    };
  }

  const lines = splitLines(doc.text);
  const text = doc.text;
  const ratio = quantifiedRatio(lines);

  const hardGateFailures = [
    checkNoDigitsInExperience(lines),
    checkTable(doc.hasTable),
  ].filter((f): f is Finding => f !== null);

  const categories: CategoryReport[] = [
    categoryQuantified(lines, ratio),
    categorySummary(lines),
    categoryExperience(lines),
    categorySkills(lines),
    categoryKeywords(lines),
    categoryWriting(text, lines),
    categoryFormatting(text, doc.hasTable),
    categoryTruthfulness(),
  ];

  const rawScore = categories.reduce((sum, c) => sum + c.pointsEarned, 0);
  const score = hardGateFailures.length > 0 ? Math.min(rawScore, 59) : rawScore;

  return {
    score,
    band: bandFor(score),
    hardGateFailures,
    categories,
    isUnreadable: false,
    quantifiedRatio: ratio,
  };
}
