"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import {
  answersQuery,
  BANK_ACCOUNTS,
  buildWritingMessage,
  formatNaira,
  getPackage,
  parseAnswers,
  WRITING_NUMBER,
} from "@/lib/writingPackages";
import { loadMetaPixel, trackWritingSubmit } from "@/lib/metaPixel";
import { errorNote, submitButton, textInput } from "./WritingForm";

const card = "rounded-[2rem] bg-gold p-6 text-left shadow-[0_40px_120px_-30px_rgba(244,203,25,0.45)] ring-1 ring-gold-400 sm:p-9";

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

// Step 2 of 2 on its own page. The answers from step 1 arrive in the query
// string. WhatsApp only opens from here, and the message says they've paid,
// so the team only answers chats that come with a receipt.
export default function DepositCard() {
  // Null when the link is missing answers or was tampered with.
  const answers = parseAnswers(useSearchParams().toString());
  const [paidFrom, setPaidFrom] = useState("");
  const [touched, setTouched] = useState(false);

  // Loads the pixel silently (no PageView); Lead only fires on a valid send.
  useEffect(loadMetaPixel, []);

  if (answers === null) {
    return (
      <div data-testid="deposit-missing" className={`${card} text-center`}>
        <p className="font-display text-xl font-semibold tracking-[-0.03em] text-ink-900">
          We don&apos;t have your answers yet
        </p>
        <p className="mt-2 text-[15px] text-ink-900/85">Fill the short form first. It takes 1 minute.</p>
        <Link href="/writing#apply" className={`${submitButton} mt-6 inline-block text-center`}>
          Go to the form
        </Link>
      </div>
    );
  }

  const pkg = getPackage(answers.choice);
  const after = pkg.price - pkg.deposit;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (paidFrom.trim() === "") return;

    const message = buildWritingMessage({ ...answers, paidFrom: paidFrom.trim() });
    window.open(generateWhatsAppLink(WRITING_NUMBER, message), "_blank", "noopener,noreferrer");
    trackWritingSubmit({ packageName: pkg.name, value: pkg.price });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="deposit-form" className={`${card} space-y-6`}>
      <Link
        href={`/writing?${answersQuery(answers)}#apply`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900/80 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Change my answers
      </Link>

      <div>
        <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900/70">Step 2 of 2</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink-900">
          Pay your {formatNaira(pkg.deposit)} deposit
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-900/85">
          This money is part of your {formatNaira(pkg.price)}. After this, you pay {formatNaira(after)}. Send it to
          any one of these bank accounts.
        </p>
      </div>

      <div data-testid="deposit-summary" className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Package", pkg.name],
          ["Pay now", formatNaira(pkg.deposit)],
          ["Pay after", formatNaira(after)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white/60 px-2 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-600">{label}</p>
            <p className="mt-0.5 font-display text-base font-semibold text-ink-900">{value}</p>
          </div>
        ))}
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
        <label htmlFor="w-paid-from" className="block font-display text-[15px] font-semibold tracking-[-0.02em] text-ink-900">
          Who sent the money?
        </label>
        <p className="mb-2 mt-0.5 text-sm text-ink-900/75">Type the name on the bank account you used.</p>
        <input
          id="w-paid-from"
          data-testid="w-paid-from"
          value={paidFrom}
          onChange={(e) => setPaidFrom(e.target.value)}
          placeholder="e.g. Amaka Obi"
          className={textInput}
        />
      </div>

      {touched && paidFrom.trim() === "" && (
        <p className={errorNote}>Please type the name of the person who sent the money.</p>
      )}

      <div>
        <button type="submit" data-testid="w-send" className={submitButton}>
          I&apos;ve paid, send my receipt on WhatsApp
        </button>
        <p className="mt-3 text-center text-xs font-medium text-ink-900/80">
          WhatsApp will open with your answers. Add the picture of your receipt, then send. We start once we see it.
        </p>
      </div>
    </form>
  );
}
