"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS = [
  {
    q: "Is my CV stored anywhere?",
    a: "No. The audit runs entirely in your browser. Your file is never uploaded to a server.",
  },
  {
    q: "How accurate is this?",
    a: "It catches the same formatting and structural issues we check for by hand, things like tables, missing numbers, or an unreadable file. It won't catch everything a full human review would, but what it flags is real.",
  },
  {
    q: "Is this actually free?",
    a: "Yes. There's nothing to sign up for and nothing to pay to see your result.",
  },
  {
    q: "What file types work?",
    a: "PDF and Word documents work best. A photo or scanned image can't be read by ATS software either, which is exactly why we flag it.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <h2 className="text-center font-display text-2xl font-medium text-ink-900 sm:text-3xl">
        Questions people ask
      </h2>
      <div className="mt-8 divide-y divide-ink-900/10 rounded-2xl border border-ink-900/10 bg-white">
        {ITEMS.map((item, i) => (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open === i}
            >
              <span className="font-medium text-ink-900">{item.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && <p className="px-5 pb-4 text-sm text-ink-400">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
