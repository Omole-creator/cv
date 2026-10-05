// Packages for the /writing sales page. Unlike lib/pricing.ts (the audit
// page's hidden price sheet), these figures are meant to be shown on the
// page: /writing qualifies leads on price before they reach WhatsApp.

export type PackageKey = "basic" | "standard" | "premium";
export type PackageChoice = PackageKey | "unsure";

export type WritingPackage = {
  key: PackageKey;
  name: string;
  system: string;
  oldPrice: number;
  price: number;
  delivery: string;
  popular?: boolean;
  work: string[];
  bonuses: Bonus[];
};

// Bonus values are placeholder estimates, set so they can be changed in one
// place. Update them here when the real figures are decided.
export type Bonus = { name: string; value: number };

// The one number this page sends leads to. Deliberately not the rotating
// pair in lib/whatsapp.ts.
export const WRITING_NUMBER = "2348074071356";
export const WRITING_NUMBER_DISPLAY = "0807 407 1356";

export const PACKAGES: WritingPackage[] = [
  {
    key: "basic",
    name: "Basic",
    system: "The Get-Replies System",
    oldPrice: 35000,
    price: 20000,
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
    oldPrice: 80000,
    price: 50000,
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
    oldPrice: 150000,
    price: 100000,
    delivery: "7 to 10 days",
    work: [
      "Everything in Standard",
      "A portfolio website with a few pages that show employers what you do, how you do it, and who you've done it for",
    ],
    bonuses: [
      { name: "The \"Hidden Reason You Keep Losing Jobs You Had Already Won\" blueprint", value: 15000 },
      { name: "The AI mock interview pack: practice interview questions you can run with ChatGPT before the real one", value: 10000 },
      { name: "Salary negotiation scripts, for naira or dollars", value: 10000 },
      { name: "The get-paid-in-dollars setup guide", value: 10000 },
    ],
  },
];

export const LOCATION_OPTIONS = [
  "A job in Nigeria",
  "A remote job that pays in dollars",
  "Both",
] as const;

export const DURATION_OPTIONS = [
  "Less than 1 month",
  "1 to 3 months",
  "3 to 6 months",
  "More than 6 months",
] as const;

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function packageLabel(choice: PackageChoice): string {
  if (choice === "unsure") return "Not sure yet, please help me choose";
  const pkg = PACKAGES.find((p) => p.key === choice)!;
  return `${pkg.name}, ${pkg.system} (${formatNaira(pkg.price)})`;
}

export type WritingLead = {
  name: string;
  role: string;
  location: string;
  duration: string;
  choice: PackageChoice;
};

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
    "*How long I've been job hunting:*",
    lead.duration,
    "",
    "*Package:*",
    packageLabel(lead.choice),
    "",
    "What do you need from me to get started?",
  ].join("\n");
}

// Total value of the free bonuses a package comes with, counting the
// bonuses from the cheaper packages it includes ("Everything in Basic").
export function totalBonusValue(key: PackageKey): number {
  const upTo = PACKAGES.findIndex((p) => p.key === key);
  return PACKAGES.slice(0, upTo + 1)
    .flatMap((p) => p.bonuses)
    .reduce((sum, b) => sum + b.value, 0);
}
