import { UploadCloud, ScanSearch, SignpostBig } from "lucide-react";

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
      </div>
    </section>
  );
}
