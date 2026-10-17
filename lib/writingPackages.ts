// Packages for the /writing sales page. Unlike lib/pricing.ts (the audit
// page's hidden price sheet), these figures are meant to be shown on the
// page: /writing qualifies leads on price before they reach WhatsApp.

// One package per experience level. Every level gets the same work, a CV
// written for the job you want, and a cover letter is an optional add-on.
// Longer careers cost more because there's more to sort through and cut.
export type PackageKey = "early" | "mid" | "senior" | "exec";

export type WritingPackage = {
  key: PackageKey;
  name: string;
  years: string;
  price: number;
  // Added to the price when the visitor ticks "add a cover letter".
  coverLetter: number;
  // Paid by bank transfer before the WhatsApp chat starts, then taken off
  // the price. It filters out people who aren't ready to buy yet.
  deposit: number;
  delivery: string;
  popular?: boolean;
};

// The one number this page sends leads to. Deliberately not the rotating
// pair in lib/whatsapp.ts.
export const WRITING_NUMBER = "2348074071356";

export const PACKAGES: WritingPackage[] = [
  { key: "early", name: "Early career", years: "0 to 3 years", price: 10000, coverLetter: 3000, deposit: 3000, delivery: "24 to 48 hours" },
  { key: "mid", name: "Mid career", years: "4 to 7 years", price: 15000, coverLetter: 5000, deposit: 3000, delivery: "24 to 48 hours", popular: true },
  { key: "senior", name: "Senior", years: "8 to 12 years", price: 25000, coverLetter: 7000, deposit: 5000, delivery: "24 to 48 hours" },
  { key: "exec", name: "Executive", years: "12+ years", price: 40000, coverLetter: 10000, deposit: 5000, delivery: "24 to 48 hours" },
];

// What every level gets, shown on each card.
export const PACKAGE_WORK = [
  "Your CV rewritten so the screening software companies use, in Nigeria and abroad, can read it properly",
  "Written around the exact job you're going for, with your results on show instead of just your duties",
  "Unlimited changes until you're happy with it",
];

export const LOCATION_OPTIONS = [
  "A job in Nigeria",
  "A remote job that pays in dollars",
  "Both",
] as const;

// Company accounts only, never a personal one: it's part of why a deposit
// to a stranger online doesn't feel like a scam.
export const BANK_ACCOUNTS = [
  { bank: "Globus Bank", number: "1000577565", name: "JobMingle Limited" },
  { bank: "Zenith Bank", number: "1311340458", name: "JobMingle Limited" },
  { bank: "UBA", number: "1028248447", name: "JobMingle Limited" },
] as const;

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function getPackage(key: PackageKey): WritingPackage {
  return PACKAGES.find((p) => p.key === key)!;
}

export function orderTotal(key: PackageKey, coverLetter: boolean): number {
  const pkg = getPackage(key);
  return pkg.price + (coverLetter ? pkg.coverLetter : 0);
}

export function orderLabel(key: PackageKey, coverLetter: boolean): string {
  const pkg = getPackage(key);
  const what = coverLetter ? "CV + cover letter" : "CV";
  return `${what}, ${pkg.name}, ${pkg.years} (${formatNaira(orderTotal(key, coverLetter))})`;
}

// The price line the visitor confirms on the form, repeated in their own
// WhatsApp message so the cost is already settled before the chat starts.
export function priceConfirmation(key: PackageKey, coverLetter: boolean): string {
  const what = coverLetter ? "my CV and cover letter cost" : "my CV costs";
  return `I understand ${what} ${formatNaira(orderTotal(key, coverLetter))} and I'm ready to pay now.`;
}

export type WritingAnswers = {
  name: string;
  role: string;
  location: string;
  choice: PackageKey;
  coverLetter: boolean;
};

export type WritingLead = WritingAnswers & {
  // Name on the bank account the deposit came from, so the team can match
  // the receipt to the transfer.
  paidFrom: string;
};

// The form's answers travel to /writing/deposit (and back, for "change my
// answers") in the query string, so a refresh never loses them.
export function answersQuery(a: WritingAnswers): string {
  return new URLSearchParams({
    p: a.choice,
    cl: a.coverLetter ? "1" : "0",
    name: a.name,
    role: a.role,
    loc: a.location,
  }).toString();
}

// Null when anything is missing or not one of the form's own options.
export function parseAnswers(search: string): WritingAnswers | null {
  const q = new URLSearchParams(search);
  const choice = q.get("p") ?? "";
  const name = (q.get("name") ?? "").trim();
  const role = (q.get("role") ?? "").trim();
  const location = q.get("loc") ?? "";
  if (!PACKAGES.some((p) => p.key === choice)) return null;
  if (!(LOCATION_OPTIONS as readonly string[]).includes(location)) return null;
  if (name === "" || role === "") return null;
  return { name, role, location, choice: choice as PackageKey, coverLetter: q.get("cl") === "1" };
}

export function buildWritingMessage(lead: WritingLead): string {
  return [
    `Hi JobMingle, I'm ${lead.name}. I just filled the form on your CV writing page.`,
    "",
    "*The job I'm going for:*",
    lead.role,
    "",
    "*Where I want to work:*",
    lead.location,
    "",
    "*What I want:*",
    orderLabel(lead.choice, lead.coverLetter),
    "",
    `*Price:* ${priceConfirmation(lead.choice, lead.coverLetter)}`,
    "",
    "*Deposit:*",
    `I've paid my ${formatNaira(getPackage(lead.choice).deposit)} deposit from the account of ${lead.paidFrom}. My receipt is below.`,
    "",
    "What do you need from me to get started?",
  ].join("\n");
}
