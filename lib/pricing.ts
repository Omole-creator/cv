export type ExperienceBand = "early" | "senior";
export type ServiceKey = "cv" | "coverLetter";

type PriceTable = Record<ExperienceBand, Record<ServiceKey, number>>;

// Internal price sheet. Never import this into anything that renders text
// directly to the page — it only ever feeds into a WhatsApp message string.
export const PRICING: PriceTable = {
  early: { cv: 7500, coverLetter: 2500 },
  senior: { cv: 15000, coverLetter: 5000 },
};

export const EXPERIENCE_LABELS: Record<ExperienceBand, string> = {
  early: "0 to 3 years of experience",
  senior: "Over 3 years of experience",
};

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  cv: "CV Writing",
  coverLetter: "Cover Letter Writing",
};

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function priceLines(
  band: ExperienceBand,
  services: ServiceKey[]
): string[] {
  return services.map(
    (service) => `${SERVICE_LABELS[service]} — ${formatNaira(PRICING[band][service])}`
  );
}

export function totalPrice(band: ExperienceBand, services: ServiceKey[]): number {
  return services.reduce((sum, service) => sum + PRICING[band][service], 0);
}
