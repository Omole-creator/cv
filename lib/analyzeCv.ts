import type { ExtractedDocument } from "./extractText.ts";

export type Finding = {
  id: string;
  label: string;
  detail: string;
  example?: string;
};

export type Band = "excellent" | "strong" | "weak" | "fails";

export type CvReport = {
  score: number;
  band: Band;
  hardGateFailures: Finding[];
  findings: Finding[];
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
const BULLET_PREFIX = /^[\s]*[•\-*●▪◦]\s+/;

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

function checkEmDash(text: string): Finding | null {
  const match = text.match(EM_DASH_PATTERN);
  if (!match) return null;
  return {
    id: "em-dash",
    label: "Dashes used as sentence breaks",
    detail:
      "ATS parsers and recruiters both read this as a rushed edit. House style is zero em dashes.",
    example: match[0],
  };
}

function checkNoDigits(lines: string[]): Finding | null {
  const hasAnyDigit = lines.some((line) => /\d/.test(line));
  if (hasAnyDigit) return null;
  return {
    id: "no-numbers",
    label: "No numbers anywhere in the document",
    detail:
      "Not one figure, percentage, or count on the page. Without a single number, there's nothing for a hiring manager to measure your work against.",
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

function checkContactInfo(text: string): Finding | null {
  const hasEmail = EMAIL_PATTERN.test(text);
  const hasLinkedIn = LINKEDIN_PATTERN.test(text);
  if (hasEmail && hasLinkedIn) return null;
  const missing = [!hasEmail && "an email address", !hasLinkedIn && "a LinkedIn URL"]
    .filter(Boolean)
    .join(" and ");
  return {
    id: "contact-info",
    label: "Contact details incomplete",
    detail: `Couldn't find ${missing} on the page. Recruiters skip a CV they can't quickly act on.`,
  };
}

function checkWeakOpeners(lines: string[]): Finding | null {
  const offenders = lines.filter((line) =>
    WEAK_OPENERS.some((phrase) => line.toLowerCase().startsWith(phrase))
  );
  if (offenders.length === 0) return null;
  return {
    id: "weak-openers",
    label: `${offenders.length} bullet${offenders.length > 1 ? "s" : ""} open with a weak verb`,
    detail:
      '"Responsible for" and "worked on" describe a duty, not a result. Every bullet should open with what you actually did.',
    example: offenders[0],
  };
}

function checkFillerWords(text: string): Finding | null {
  const lower = text.toLowerCase();
  const found = FILLER_WORDS.filter((word) => lower.includes(word));
  if (found.length === 0) return null;
  return {
    id: "filler-words",
    label: "Filler adjectives standing in for proof",
    detail: `Found "${found[0]}" on the page. Phrases like this claim a trait instead of showing it with a result.`,
  };
}

function quantifiedRatio(lines: string[]): number {
  const bullets = lines.filter(looksLikeBullet);
  if (bullets.length === 0) return 0;
  const quantified = bullets.filter((line) => /\d/.test(line));
  return quantified.length / bullets.length;
}

function checkQuantified(lines: string[]): { finding: Finding | null; ratio: number } {
  const ratio = quantifiedRatio(lines);
  if (ratio >= 0.7) return { finding: null, ratio };
  return {
    finding: {
      id: "quantified-achievements",
      label: `Only about ${Math.round(ratio * 100)}% of your bullets look quantified`,
      detail:
        "Lines that read like duties rather than results are the single most common reason a CV underperforms, even when everything else about it looks fine.",
    },
    ratio,
  };
}

function checkLength(text: string): Finding | null {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount === 0) return null;
  if (wordCount < 150) {
    return {
      id: "too-short",
      label: "Reads thin for a full CV",
      detail:
        "At this length, a lot of real experience is probably being left off the page entirely.",
    };
  }
  if (wordCount > 1100) {
    return {
      id: "too-long",
      label: "Runs long",
      detail:
        "Past this length, most of it stops getting read. Worth checking what's padding versus what's actually load-bearing.",
    };
  }
  return null;
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

function scoreFor(hardGateCount: number, findingCount: number, ratio: number): number {
  if (hardGateCount > 0) {
    return Math.max(20, 59 - hardGateCount * 8);
  }
  let score = 60 + Math.round(ratio * 30);
  score -= findingCount * 4;
  return Math.max(35, Math.min(98, score));
}

function bandFor(score: number, hardGateCount: number): Band {
  if (hardGateCount > 0 || score < 60) return "fails";
  if (score < 75) return "weak";
  if (score < 90) return "strong";
  return "excellent";
}

export function analyzeCv(doc: ExtractedDocument): CvReport {
  if (doc.isUnreadable) {
    const finding = unreadableFinding(doc.fileType);
    return {
      score: 22,
      band: "fails",
      hardGateFailures: [finding],
      findings: [],
      isUnreadable: true,
      quantifiedRatio: 0,
    };
  }

  const lines = splitLines(doc.text);
  const hardGateFailures = [
    checkEmDash(doc.text),
    checkNoDigits(lines),
    checkTable(doc.hasTable),
  ].filter((f): f is Finding => f !== null);

  const { finding: quantifiedFinding, ratio } = checkQuantified(lines);
  const findings = [
    quantifiedFinding,
    checkContactInfo(doc.text),
    checkWeakOpeners(lines),
    checkFillerWords(doc.text),
    checkLength(doc.text),
  ].filter((f): f is Finding => f !== null);

  const score = scoreFor(hardGateFailures.length, findings.length, ratio);

  return {
    score,
    band: bandFor(score, hardGateFailures.length),
    hardGateFailures,
    findings: findings.slice(0, 4),
    isUnreadable: false,
    quantifiedRatio: ratio,
  };
}
