"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  answersQuery,
  formatNaira,
  getPackage,
  LOCATION_OPTIONS,
  orderTotal,
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

// Steps 1 and 2 of 3: the visitor's details, then their CV level and price
// confirmation. A valid step 2 moves to /writing/deposit (step 3), which is
// the only place WhatsApp opens from.
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
  const [coverLetter, setCoverLetter] = useState(back?.coverLetter ?? false);
  const [confirmed, setConfirmed] = useState(back !== null);
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<HTMLFormElement>(null);

  // Links into the form (/writing#apply) make the browser stop at the top
  // of the section. Once the form has loaded, move on down to the card,
  // then drop the #apply so a refresh opens on the hero again. Deferred
  // because Next writes the full URL back into history after this effect,
  // and the browser's own jump to #apply lands after it too.
  useEffect(() => {
    if (window.location.hash !== "#apply") return;
    const timer = setTimeout(() => {
      formRef.current?.scrollIntoView({ block: "start" });
      history.replaceState(history.state, "", window.location.pathname + window.location.search);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const pkg = choice === "" ? null : getPackage(choice);
  const aboutDone = name.trim() !== "" && role.trim() !== "" && location !== "";

  // Each step change brings the top of the card back on screen, since the
  // button that moved them on sits at the bottom of a tall form on phones.
  const goTo = (next: 1 | 2) => {
    setTouched(false);
    setStep(next);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (step === 1) {
      if (aboutDone) goTo(2);
      return;
    }
    if (!aboutDone || !pkg || !confirmed) return;
    router.push(`/writing/deposit?${answersQuery({ name: name.trim(), role: role.trim(), location, choice: pkg.key, coverLetter })}`);
  };

  return (
    <form
      id="apply-form"
      ref={formRef}
      onSubmit={handleSubmit}
      data-testid="writing-form"
      className="scroll-mt-24 space-y-6 rounded-[2rem] bg-gold p-6 text-left shadow-[0_40px_120px_-30px_rgba(244,203,25,0.45)] ring-1 ring-gold-400 sm:p-9"
    >
      <div>
        <p data-testid="w-step" className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900/70">
          Step {step} of 3: {step === 1 ? "About you" : "Your CV"}
        </p>
        <div aria-hidden className="mt-3 grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1.5 rounded-full ${n <= step ? "bg-ink-900" : "bg-ink-900/15"}`} />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <>
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

          {touched && !aboutDone && (
            <p className={errorNote}>Please answer all three questions so our team knows how to help.</p>
          )}

          <button type="submit" data-testid="w-next" className={submitButton}>
            Next
          </button>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="w-package" className={fieldLabel}>
              How many years have you worked?
            </label>
            <Select id="w-package" value={choice} onChange={(v) => setChoice(v as PackageKey)}>
              {PACKAGES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.years}, {formatNaira(p.price)}
                </option>
              ))}
            </Select>
          </div>

          {pkg && (
            <div data-testid="w-price" className="rounded-xl bg-white p-4 text-sm text-ink-900">
              <label data-testid="w-cover" className="flex cursor-pointer items-start font-semibold">
                <input
                  type="checkbox"
                  checked={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.checked)}
                  className="mr-2.5 mt-0.5 h-4 w-4 shrink-0 accent-ink-900"
                />
                Add a cover letter for {formatNaira(pkg.coverLetter)} more
              </label>
              <p className="mt-3 border-t border-ink-900/10 pt-3 font-display text-[15px] font-semibold tracking-[-0.02em]">
                Your total: {formatNaira(orderTotal(pkg.key, coverLetter))}
              </p>
              <p className="mt-1 leading-relaxed text-ink-600">
                You start with a {formatNaira(pkg.deposit)} deposit by bank transfer. It comes off your total, so you
                pay {formatNaira(orderTotal(pkg.key, coverLetter) - pkg.deposit)} after.
              </p>
              <label data-testid="w-confirm" className="mt-3 flex cursor-pointer items-start font-semibold">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mr-2.5 mt-0.5 h-4 w-4 shrink-0 accent-ink-900"
                />
                {priceConfirmation(pkg.key, coverLetter)}
              </label>
            </div>
          )}

          {touched && (!pkg || !confirmed) && (
            <p className={errorNote}>Please pick how many years you&apos;ve worked and tick the price box.</p>
          )}

          <div>
            <button type="submit" data-testid="w-submit" className={submitButton}>
              Continue to deposit
            </button>
            <p className="mt-3 text-center text-xs font-medium text-ink-900/80">
              Next, you&apos;ll see where to send your deposit.
            </p>
            <button
              type="button"
              data-testid="w-back"
              onClick={() => goTo(1)}
              className="mx-auto mt-4 block text-sm font-semibold text-ink-900/80 underline-offset-4 hover:text-ink-900 hover:underline"
            >
              Back to step 1
            </button>
          </div>
        </>
      )}
    </form>
  );
}
