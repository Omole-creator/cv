import { UploadCloud, ScanSearch, SignpostBig } from "lucide-react";
import { BAND_LABELS, BAND_RANGES } from "@/lib/analyzeCv";

const DOT_COLOR: Record<string, string> = {
  excellent: "bg-gold",
  "very-strong": "bg-gold",
  strong: "bg-gold-600",
  "needs-work": "bg-ink-400",
  weak: "bg-red-400",
  critical: "bg-red-600",
};

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload your CV",
    body: "A PDF, a Word file, even a photo of it works. It stays on your device the whole time, we never see or save it.",
  },
  {
    icon: ScanSearch,
    title: "See what's really going on",
    body: "You get the same checklist we run before writing anyone's CV, spelled out in plain English, not jargon.",
  },
  {
    icon: SignpostBig,
    title: "Take it from there",
    body: "Fix it yourself with what we show you, or hand it to us and skip the weekend of work.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-ink-900/5 bg-white py-16">
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="text-center font-display text-2xl font-medium text-ink-900 sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-ink-900/10 p-6 text-center transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#F4CB19,transparent)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
              />
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 transition-colors duration-300 group-hover:bg-gold">
                <step.icon className="h-5 w-5 text-ink-900" />
              </div>
              <p className="relative mt-4 text-xs font-semibold uppercase tracking-wide text-gold-600 transition-colors duration-300 group-hover:text-gold">
                Step {i + 1}
              </p>
              <h3 className="relative mt-1 font-medium text-ink-900 transition-colors duration-300 group-hover:text-white">
                {step.title}
              </h3>
              <p className="relative mt-1.5 text-sm text-ink-400 transition-colors duration-300 group-hover:text-white/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-lg">
          <h3 className="text-center font-display text-xl font-medium text-ink-900">
            What your score means
          </h3>
          <ul className="mt-6 divide-y divide-ink-900/10 rounded-xl border border-ink-900/10">
            {BAND_RANGES.map((range) => (
              <li key={range.band} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="flex items-center gap-2.5 text-sm text-ink-600">
                  <span className={`h-2 w-2 rounded-full ${DOT_COLOR[range.band]}`} />
                  {range.min}
                  {" to "}
                  {range.max}
                </span>
                <span className="text-sm font-medium text-ink-900">{BAND_LABELS[range.band]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-sm text-ink-400">
            Aim for 70 or higher to stand a real chance. Below that, most CVs are getting filtered
            out before a person ever opens them.
          </p>
        </div>
      </div>
    </section>
  );
}
