"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import {
  buildWritingMessage,
  DURATION_OPTIONS,
  formatNaira,
  LOCATION_OPTIONS,
  PackageChoice,
  PACKAGES,
  WRITING_NUMBER,
} from "@/lib/writingPackages";
import { loadMetaPixel, trackWritingSubmit } from "@/lib/metaPixel";
import { usePackage } from "./PackageContext";

const fieldLabel = "mb-2 block font-display text-[15px] font-semibold tracking-[-0.02em] text-ink-900";
const optionBase = "flex cursor-pointer items-center rounded-xl border px-3.5 py-3 text-sm text-ink-900 transition-all duration-200 hover:border-ink-900/50";
const optionOn = "border-ink-900 bg-white font-semibold shadow-[0_0_0_3px_rgba(6,13,41,0.18)]";
const optionOff = "border-ink-900/20 bg-white/60";

function Select({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        data-testid={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border border-ink-900/20 bg-white py-3 pl-4 pr-11 outline-none transition-shadow focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(6,13,41,0.18)] ${
          value ? "text-ink-900" : "text-ink-600"
        }`}
      >
        <option value="" disabled>
          Choose one
        </option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
    </div>
  );
}

export default function WritingForm() {
  const { choice, setChoice } = usePackage();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [touched, setTouched] = useState(false);

  // Loads the pixel silently (no PageView); events only fire on a valid submit.
  useEffect(loadMetaPixel, []);

  const isValid =
    name.trim() !== "" && role.trim() !== "" && location !== "" && duration !== "" && choice !== "";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;

    const message = buildWritingMessage({
      name: name.trim(),
      role: role.trim(),
      location,
      duration,
      choice: choice as PackageChoice,
    });
    window.open(generateWhatsAppLink(WRITING_NUMBER, message), "_blank", "noopener,noreferrer");

    // "Not sure yet" is valued at the cheapest package.
    const picked = PACKAGES.find((p) => p.key === choice) ?? PACKAGES[0];
    trackWritingSubmit({
      packageName: choice === "unsure" ? "Not sure yet" : picked.name,
      value: picked.price,
    });
  };

  const packageOptions: [PackageChoice, string][] = [
    ...PACKAGES.map((p) => [p.key, `${p.name} (${formatNaira(p.price)})`] as [PackageChoice, string]),
    ["unsure", "Not sure yet, help me choose"],
  ];

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="writing-form"
      className="space-y-6 rounded-[2rem] bg-gold p-6 text-left shadow-[0_40px_120px_-30px_rgba(244,203,25,0.45)] ring-1 ring-gold-400 sm:p-9"
    >
      <div>
        <label htmlFor="w-name" className={fieldLabel}>
          Your name
        </label>
        <input
          id="w-name"
          data-testid="w-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Amaka Obi"
          autoComplete="name"
          className="w-full rounded-xl border border-ink-900/20 bg-white px-4 py-3 placeholder:text-ink-600/70 text-ink-900 outline-none transition-shadow focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(6,13,41,0.18)]"
        />
      </div>

      <div>
        <label htmlFor="w-role" className={fieldLabel}>
          What job are you going for?
        </label>
        <input
          id="w-role"
          data-testid="w-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Customer service, data analyst, admin officer"
          className="w-full rounded-xl border border-ink-900/20 bg-white px-4 py-3 placeholder:text-ink-600/70 text-ink-900 outline-none transition-shadow focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(6,13,41,0.18)]"
        />
      </div>

      <fieldset>
        <legend className={fieldLabel}>Where do you want to work?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {LOCATION_OPTIONS.map((option) => (
            <label key={option} className={`${optionBase} ${location === option ? optionOn : optionOff}`}>
              <input
                type="radio"
                name="location"
                checked={location === option}
                onChange={() => setLocation(option)}
                className="mr-2 accent-ink-900"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="w-duration" className={fieldLabel}>
          How long have you been job hunting?
        </label>
        <Select id="w-duration" value={duration} onChange={setDuration}>
          {DURATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="w-package" className={fieldLabel}>
          Which package are you thinking of?
        </label>
        <Select id="w-package" value={choice} onChange={(v) => setChoice(v as PackageChoice)}>
          {packageOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {touched && !isValid && (
        <p className="rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold text-red-700">Please answer all five questions so our team knows how to help.</p>
      )}

      <div>
        <button
          type="submit"
          data-testid="w-submit"
          className="w-shine w-full rounded-full bg-ink-900 px-5 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(6,13,41,0.6)]"
        >
          Send my answers on WhatsApp
        </button>
        <p className="mt-3 text-center text-xs font-medium text-ink-900/80">
          This opens WhatsApp with your answers already typed in. Nothing gets charged.
        </p>
      </div>
    </form>
  );
}
