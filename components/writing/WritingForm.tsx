"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  answersQuery,
  formatNaira,
  getPackage,
  LOCATION_OPTIONS,
  PackageKey,
  PACKAGES,
  parseAnswers,
  priceConfirmation,
} from "@/lib/writingPackages";
import { usePackage } from "./PackageContext";

const fieldLabel = "mb-2 block font-display text-[15px] font-semibold tracking-[-0.02em] text-ink-900";
const optionBase = "flex cursor-pointer items-center rounded-xl border px-3.5 py-3 text-sm text-ink-900 transition-all duration-200 hover:border-ink-900/50";
const optionOn = "border-ink-900 bg-white font-semibold shadow-[0_0_0_3px_rgba(6,13,41,0.18)]";
const optionOff = "border-ink-900/20 bg-white/60";
export const textInput = "w-full rounded-xl border border-ink-900/20 bg-white px-4 py-3 placeholder:text-ink-600/70 text-ink-900 outline-none transition-shadow focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(6,13,41,0.18)]";
export const submitButton = "w-shine w-full rounded-full bg-ink-900 px-5 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(6,13,41,0.6)]";
export const errorNote = "rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold text-red-700";

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

// Step 1 of 2: the visitor's details and price confirmation. A valid submit
// moves to /writing/deposit, which is the only place WhatsApp opens from.
// Rendered inside <Suspense> (it reads the query string), so the static
// HTML shows this empty card until the page hydrates.
export function FormFallback() {
  return <div className="min-h-[560px] rounded-[2rem] bg-gold/90 ring-1 ring-gold-400" />;
}

export default function WritingForm() {
  const router = useRouter();
  // Coming back from the deposit page via "change my answers" refills the
  // form from the query string.
  const back = parseAnswers(useSearchParams().toString());
  const { choice: picked, setChoice } = usePackage();
  const choice = picked !== "" ? picked : (back?.choice ?? "");
  const [name, setName] = useState(back?.name ?? "");
  const [role, setRole] = useState(back?.role ?? "");
  const [location, setLocation] = useState(back?.location ?? "");
  const [confirmed, setConfirmed] = useState(back !== null);
  const [touched, setTouched] = useState(false);

  const pkg = choice === "" ? null : getPackage(choice);
  const isValid = name.trim() !== "" && role.trim() !== "" && location !== "" && pkg !== null && confirmed;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid || !pkg) return;
    router.push(`/writing/deposit?${answersQuery({ name: name.trim(), role: role.trim(), location, choice: pkg.key })}`);
  };

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
          className={textInput}
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
          className={textInput}
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
        <label htmlFor="w-package" className={fieldLabel}>
          What do you want us to do for you?
        </label>
        <Select id="w-package" value={choice} onChange={(v) => setChoice(v as PackageKey)}>
          {PACKAGES.map((p) => (
            <option key={p.key} value={p.key}>
              {p.service}
            </option>
          ))}
        </Select>
      </div>

      {pkg && (
        <div data-testid="w-price" className="rounded-xl bg-white p-4 text-sm text-ink-900">
          <p className="font-display text-[15px] font-semibold tracking-[-0.02em]">
            Your package: {pkg.name}, {formatNaira(pkg.price)}
          </p>
          <p className="mt-1 leading-relaxed text-ink-600">
            You start with a {formatNaira(pkg.deposit)} deposit by bank transfer. It comes off your total, so you
            pay {formatNaira(pkg.price - pkg.deposit)} after.
          </p>
          <label data-testid="w-confirm" className="mt-3 flex cursor-pointer items-start font-semibold">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mr-2.5 mt-0.5 h-4 w-4 shrink-0 accent-ink-900"
            />
            {priceConfirmation(pkg.key)}
          </label>
        </div>
      )}

      {touched && !isValid && (
        <p className={errorNote}>Please answer all four questions and tick the price box so our team knows how to help.</p>
      )}

      <div>
        <button type="submit" data-testid="w-submit" className={submitButton}>
          Continue to deposit
        </button>
        <p className="mt-3 text-center text-xs font-medium text-ink-900/80">
          Next, you&apos;ll see where to send your deposit.
        </p>
      </div>
    </form>
  );
}
