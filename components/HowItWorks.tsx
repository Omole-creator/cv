import { FileSearch, ScrollText, Compass } from "lucide-react";

const STEPS = [
  {
    icon: FileSearch,
    title: "Upload your CV",
    body: "PDF, Word, or a photo of it. Nothing leaves your browser, nothing gets stored anywhere.",
  },
  {
    icon: ScrollText,
    title: "Get your audit",
    body: "We check it against the same standard we use when writing CVs for clients, hard gates and all.",
  },
  {
    icon: Compass,
    title: "Decide what to do",
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
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-50">
                <step.icon className="h-5 w-5 text-ink-900" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-600">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-medium text-ink-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-ink-400">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
