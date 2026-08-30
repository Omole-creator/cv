import {
  EXPERIENCE_LABELS,
  ExperienceBand,
  priceLines,
  ServiceKey,
  totalPrice,
} from "./pricing";

export const PRICING_NUMBERS = ["2348074071356", "2349031738326"] as const;
export const GENERAL_NUMBER = "2349031738326";

const ROTATION_KEY = "jm_wa_rotation";

/**
 * Picks one of the two pricing-line numbers so volume lands roughly
 * even across both over time. Falls back to a coin flip if localStorage
 * is unavailable (private browsing, SSR, etc).
 */
export function pickRotatingNumber(): string {
  try {
    const current = window.localStorage.getItem(ROTATION_KEY);
    const count = current ? parseInt(current, 10) : 0;
    window.localStorage.setItem(ROTATION_KEY, String(count + 1));
    return PRICING_NUMBERS[count % PRICING_NUMBERS.length];
  } catch {
    return PRICING_NUMBERS[Math.random() < 0.5 ? 0 : 1];
  }
}

export function generateWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildRequestMessage(
  name: string,
  band: ExperienceBand,
  services: ServiceKey[]
): string {
  const lines = priceLines(band, services);
  const total = totalPrice(band, services);
  const priceBlock =
    services.length > 1
      ? `${lines.join("\n")}\nTotal — ₦${total.toLocaleString("en-NG")}`
      : lines.join("\n");

  return [
    `Hi, I'm ${name} and I'd like a professionally written CV.`,
    "",
    "*Experience level:*",
    EXPERIENCE_LABELS[band],
    "",
    "*Service needed:*",
    services
      .map((s) => (s === "cv" ? "CV Writing" : "Cover Letter Writing"))
      .join(" + "),
    "",
    "*Price:*",
    priceBlock,
    "",
    "Please let me know the next steps.",
  ].join("\n");
}

export function buildGeneralMessage(): string {
  return "Hi, I'd like to talk to JobMingle about my CV.";
}
