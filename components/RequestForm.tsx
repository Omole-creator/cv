"use client";

import { FormEvent, useState } from "react";
import { ExperienceBand, ServiceKey } from "@/lib/pricing";
import { buildRequestMessage, generateWhatsAppLink, pickRotatingNumber } from "@/lib/whatsapp";

export default function RequestForm() {
  const [name, setName] = useState("");
  const [band, setBand] = useState<ExperienceBand | "">("");
  const [services, setServices] = useState<ServiceKey[]>([]);
  const [touched, setTouched] = useState(false);

  const toggleService = (service: ServiceKey) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const isValid = name.trim().length > 0 && band !== "" && services.length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;

    const message = buildRequestMessage(name.trim(), band, services);
    const phone = pickRotatingNumber();
    window.open(generateWhatsAppLink(phone, message), "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="request-form"
      className="mt-5 space-y-5 rounded-2xl border border-ink-900/10 bg-white p-5 text-left"
    >
      <div>
        <label htmlFor="jm-name" className="mb-1.5 block text-sm font-medium text-ink-900">
          Your name
        </label>
        <input
          id="jm-name"
          data-testid="form-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Amaka Obi"
          className="w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-ink-900 outline-none focus:border-gold-600"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">
          Where are you in your career?
        </span>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(
            [
              ["early", "0 to 3 years of experience"],
              ["senior", "Over 3 years of experience"],
            ] as [ExperienceBand, string][]
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex-1 cursor-pointer rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                band === value ? "border-gold-600 bg-gold-50" : "border-ink-900/15"
              }`}
            >
              <input
                type="radio"
                name="band"
                value={value}
                checked={band === value}
                onChange={() => setBand(value)}
                className="mr-2"
                data-testid={`band-${value}`}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">
          What do you need?
        </span>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(
            [
              ["cv", "CV Writing"],
              ["coverLetter", "Cover Letter Writing"],
            ] as [ServiceKey, string][]
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex-1 cursor-pointer rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                services.includes(value) ? "border-gold-600 bg-gold-50" : "border-ink-900/15"
              }`}
            >
              <input
                type="checkbox"
                checked={services.includes(value)}
                onChange={() => toggleService(value)}
                className="mr-2"
                data-testid={`service-${value}`}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {touched && !isValid && (
        <p className="text-sm text-red-600">Fill in your name and pick both options above.</p>
      )}

      <button
        type="submit"
        data-testid="form-submit"
        className="w-full rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Send my details on WhatsApp
      </button>
    </form>
  );
}
