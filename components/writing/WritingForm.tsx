"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Copy } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import {
  BANK_ACCOUNTS,
  buildWritingMessage,
  formatNaira,
  getPackage,
  LOCATION_OPTIONS,
  PackageKey,
  PACKAGES,
  priceConfirmation,
  WRITING_NUMBER,
} from "@/lib/writingPackages";
import { loadMetaPixel, trackWritingSubmit } from "@/lib/metaPixel";
import { usePackage } from "./PackageContext";

const fieldLabel = "mb-2 block font-display text-[15px] font-semibold tracking-[-0.02em] text-ink-900";
const optionBase = "flex cursor-pointer items-center rounded-xl border px-3.5 py-3 text-sm text-ink-900 transition-all duration-200 hover:border-ink-900/50";
const optionOn = "border-ink-900 bg-white font-semibold shadow-[0_0_0_3px_rgba(6,13,41,0.18)]";
const optionOff = "border-ink-900/20 bg-white/60";
const textInput = "w-full rounded-xl border border-ink-900/20 bg-white px-4 py-3 placeholder:text-ink-600/70 text-ink-900 outline-none transition-shadow focus:border-ink-900 focus:shadow-[0_0_0_3px_rgba(6,13,41,0.18)]";
const submitButton = "w-shine w-full rounded-full bg-ink-900 px-5 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(6,13,41,0.6)]";
const errorNote = "rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold text-red-700";

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

function CopyNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the number is still on screen to copy by hand.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// Two steps in one card: the visitor's details and price confirmation, then
// the deposit. WhatsApp only opens from the deposit step, and the message
// says they've paid, so the team only answers chats that come with a receipt.
export default function WritingForm() {
  const { choice, setChoice } = usePackage();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [paidFrom, setPaidFrom] = useState("");
  const [step, setStep] = useState<"details" | "deposit">("details");
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Loads the pixel silently (no PageView); events only fire on a valid submit.
  useEffect(loadMetaPixel, []);

  const pkg = choice === "" ? null : getPackage(choice);
  const detailsValid = name.trim() !== "" && role.trim() !== "" && location !== "" && pkg !== null && confirmed;

  const goTo = (next: "details" | "deposit") => {
    setStep(next);
    setTouched(false);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (step === "details") {
      if (detailsValid) goTo("deposit");
      return;
    }
    if (!pkg || paidFrom.trim() === "") return;

    const message = buildWritingMessage({
      name: name.trim(),
      role: role.trim(),
      location,
      choice: pkg.key,
      paidFrom: paidFrom.trim(),
    });
    window.open(generateWhatsAppLink(WRITING_NUMBER, message), "_blank", "noopener,noreferrer");
    trackWritingSubmit({ packageName: pkg.name, value: pkg.price });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      data-testid="writing-form"
      className="scroll-mt-20 space-y-6 rounded-[2rem] bg-gold p-6 text-left shadow-[0_40px_120px_-30px_rgba(244,203,25,0.45)] ring-1 ring-gold-400 sm:p-9"
    >
      {step === "details" || !pkg ? (
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

          {touched && !detailsValid && (
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
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => goTo("details")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900/80 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Change my answers
          </button>

          <div>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-900">
              Pay your {formatNaira(pkg.deposit)} deposit
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-900/85">
              It comes off your {formatNaira(pkg.price)} {pkg.name} fee, so you pay{" "}
              {formatNaira(pkg.price - pkg.deposit)} after. Send it to either of our company accounts.
            </p>
          </div>

          <div data-testid="w-banks" className="space-y-2">
            {BANK_ACCOUNTS.map((account) => (
              <div key={account.number} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-600">{account.bank}</p>
                  <p className="font-mono text-lg font-semibold text-ink-900">{account.number}</p>
                  <p className="text-sm text-ink-600">{account.name}</p>
                </div>
                <CopyNumber number={account.number} />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="w-paid-from" className={fieldLabel}>
              Name on the account you paid from
            </label>
            <input
              id="w-paid-from"
              data-testid="w-paid-from"
              value={paidFrom}
              onChange={(e) => setPaidFrom(e.target.value)}
              placeholder="So we can match your transfer"
              className={textInput}
            />
          </div>

          {touched && paidFrom.trim() === "" && (
            <p className={errorNote}>Please add the name on the account you paid from.</p>
          )}

          <div>
            <button type="submit" data-testid="w-send" className={submitButton}>
              I&apos;ve paid, send my receipt on WhatsApp
            </button>
            <p className="mt-3 text-center text-xs font-medium text-ink-900/80">
              WhatsApp opens with your answers typed in. Attach your transfer receipt before you send. We start once
              we see it.
            </p>
          </div>
        </>
      )}
    </form>
  );
}
