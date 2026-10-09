// Packages for the /writing sales page. Unlike lib/pricing.ts (the audit
// page's hidden price sheet), these figures are meant to be shown on the
// page: /writing qualifies leads on price before they reach WhatsApp.

export type PackageKey = "basic" | "standard" | "premium";

export type WritingPackage = {
  key: PackageKey;
  name: string;
  system: string;
  price: number;
  // Paid by bank transfer before the WhatsApp chat starts, then taken off
  // the price. It filters out people who aren't ready to buy yet.
  deposit: number;
  // How the form's "what do you want us to do" question names this package.
  service: string;
  delivery: string;
  popular?: boolean;
  // false: the card's bonus total and struck-through value count only
  // this package's own bonuses, not the ones from cheaper packages.
  countLowerBonuses?: boolean;
  work: string[];
  bonuses: Bonus[];
};

// Bonus values are placeholder estimates, set so they can be changed in one
// place. Update them here when the real figures are decided.
export type Bonus = { name: string; value: number };

// The one number this page sends leads to. Deliberately not the rotating
// pair in lib/whatsapp.ts.
export const WRITING_NUMBER = "2348074071356";

export const PACKAGES: WritingPackage[] = [
  {
    key: "basic",
    name: "Basic",
    system: "The Get-Replies System",
    price: 20000,
    deposit: 3000,
    service: "CV + cover letter",
    delivery: "24 to 48 hours",
    work: [
      "Your CV and cover letter rewritten so the screening software companies use, in Nigeria and abroad, can read them properly",
      "Written around the exact job you're going for, with your results on show instead of just your duties",
    ],
    bonuses: [
      { name: "The \"Why Employers Ghost Good People\" blueprint, a 28-day plan for turning a silent inbox into interview invites", value: 10000 },
      { name: "50 fill-in-the-blank CV bullet points", value: 5000 },
      { name: "The Un-Ghost follow-up scripts: ready-made messages to send when a company goes quiet", value: 5000 },
      { name: "The cover letter swipe file: sample cover letters you can copy and change to fit any job", value: 5000 },
    ],
  },
  {
    key: "standard",
    name: "Standard",
    system: "The Get-Found System",
    price: 50000,
    deposit: 5000,
    service: "CV + cover letter + LinkedIn optimization",
    delivery: "4 to 6 days",
    popular: true,
    work: [
      "Everything in Basic",
      "Your LinkedIn profile rebuilt so recruiters in Nigeria and abroad can find you and want to message you",
    ],
    bonuses: [
      { name: "The \"How to Make Recruiters Message You First\" blueprint", value: 15000 },
      { name: "Recruiter message scripts: what to say when you message a recruiter on LinkedIn", value: 7500 },
      { name: "The 30-day LinkedIn visibility calendar: what to post each day so recruiters notice you", value: 7500 },
      { name: "The cold email pack, for reaching the person who makes the hiring decision, even for remote roles abroad", value: 10000 },
    ],
  },
  {
    key: "premium",
    name: "Premium",
    system: "The Get-Hired System",
    price: 80000,
    deposit: 5000,
    service: "CV + cover letter + LinkedIn optimization + portfolio website",
    // Priced on its own bonuses only (80k + 70k = 150k). The Basic and
    // Standard bonuses still come with it, shown as unpriced extras.
    countLowerBonuses: false,
    delivery: "7 to 10 days",
    work: [
      "Everything in Standard",
      "A portfolio website with a few pages that show employers what you do, how you do it, and who you've done it for",
    ],
    bonuses: [
      { name: "The \"Hidden Reason You Keep Losing Jobs You Had Already Won\" blueprint", value: 25000 },
      { name: "The AI mock interview pack: practice interview questions you can run with ChatGPT before the real one", value: 15000 },
      { name: "Salary negotiation scripts, for naira or dollars", value: 15000 },
      { name: "The get-paid-in-dollars setup guide", value: 15000 },
    ],
  },
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

export function packageLabel(key: PackageKey): string {
  const pkg = getPackage(key);
  return `${pkg.name}, ${pkg.system} (${formatNaira(pkg.price)})`;
}

// The price line the visitor confirms on the form, repeated in their own
// WhatsApp message so the cost is already settled before the chat starts.
export function priceConfirmation(key: PackageKey): string {
  const pkg = getPackage(key);
  return `I understand ${pkg.name} costs ${formatNaira(pkg.price)} and I'm ready to pay now.`;
}

export type WritingAnswers = {
  name: string;
  role: string;
  location: string;
  choice: PackageKey;
};

export type WritingLead = WritingAnswers & {
  // Name on the bank account the deposit came from, so the team can match
  // the receipt to the transfer.
  paidFrom: string;
};

// The form's answers travel to /writing/deposit (and back, for "change my
// answers") in the query string, so a refresh never loses them.
export function answersQuery(a: WritingAnswers): string {
  return new URLSearchParams({ p: a.choice, name: a.name, role: a.role, loc: a.location }).toString();
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
  return { name, role, location, choice: choice as PackageKey };
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
    "*Package:*",
    packageLabel(lead.choice),
    "",
    `*Price:* ${priceConfirmation(lead.choice)}`,
    "",
    "*Deposit:*",
    `I've paid my ${formatNaira(getPackage(lead.choice).deposit)} deposit from the account of ${lead.paidFrom}. My receipt is below.`,
    "",
    "What do you need from me to get started?",
  ].join("\n");
}

// Total value of the free bonuses a package comes with, counting the
// bonuses from the cheaper packages it includes ("Everything in Basic").
export function totalBonusValue(key: PackageKey): number {
  const upTo = PACKAGES.findIndex((p) => p.key === key);
  const from = PACKAGES[upTo].countLowerBonuses === false ? upTo : 0;
  return PACKAGES.slice(from, upTo + 1)
    .flatMap((p) => p.bonuses)
    .reduce((sum, b) => sum + b.value, 0);
}

// What the card shows struck through: the price plus everything in the
// bonus stack, so the real price reads as the discount.
export function totalValue(pkg: WritingPackage): number {
  return pkg.price + totalBonusValue(pkg.key);
}
