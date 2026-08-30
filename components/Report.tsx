"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowRight, ChevronDown } from "lucide-react";
import { BAND_LABELS, CategoryReport, CvReport, Finding } from "@/lib/analyzeCv";
import ScoreCard from "./ScoreCard";
import RequestForm from "./RequestForm";

const VERDICT_STYLES: Record<CategoryReport["verdict"], string> = {
  strong: "bg-gold-50 text-ink-900",
  "needs-work": "bg-ink-50 text-ink-600",
  weak: "bg-red-50 text-red-700",
  "info-only": "bg-ink-50 text-ink-400",
};

const VERDICT_LABELS: Record<CategoryReport["verdict"], string> = {
  strong: "Solid",
  "needs-work": "Needs work",
  weak: "Weak",
  "info-only": "Self-check",
};

const HARD_GATE_FIX: Record<string, string> = {
  "no-numbers": "Go back through every bullet in that section and attach a real, measurable achievement to it, a percentage, a count, a naira figure, anything a reader can weigh.",
  "table-layout": "Rebuild that section as plain text lines instead of a table.",
  "unreadable-file": "Re-save this as a real PDF or Word file with selectable text, not an image or a scan.",
};

function buildFixSteps(report: CvReport): string[] {
  const steps: string[] = [];

  report.hardGateFailures.forEach((f: Finding) => {
    const fix = HARD_GATE_FIX[f.id];
    steps.push(fix ? `${f.detail} ${fix}` : f.detail);
  });

  const problemCategories = [...report.categories]
    .filter((c) => c.verdict === "weak" || c.verdict === "needs-work")
    .sort((a, b) => a.pointsEarned / a.maxPoints - b.pointsEarned / b.maxPoints);

  problemCategories.forEach((c) => {
    const lead = c.findings[0];
    const action = c.whatToDo[0];
    steps.push(lead && action ? `${lead} ${action}` : action ?? lead ?? c.summary);
  });

  return steps.slice(0, 6);
}

export default function Report({ report, fileName }: { report: CvReport; fileName?: string }) {
  const [showForm, setShowForm] = useState(false);
  const formSlotRef = useRef<HTMLDivElement>(null);

  const weakestCategory = [...report.categories]
    .filter((c) => c.verdict !== "info-only")
    .sort((a, b) => a.pointsEarned / a.maxPoints - b.pointsEarned / b.maxPoints)[0];
  const topFindingLabel = report.hardGateFailures[0]?.label ?? weakestCategory?.label;
  const fixSteps = buildFixSteps(report);

  const openForm = () => {
    setShowForm(true);
    requestAnimationFrame(() => {
      formSlotRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <section id="report" data-testid="report" className="mx-auto max-w-2xl px-5 pb-20">
      <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-9">
        <div className="flex flex-col items-center gap-2 text-center">
          <ScoreRing score={report.score} />
          <p className="font-display text-lg font-medium text-ink-900">{BAND_LABELS[report.band]}</p>
          {fileName && <p className="text-xs text-ink-400">{fileName}</p>}
        </div>

        {report.hardGateFailures.length > 0 && (
          <div className="mt-8" data-testid="hard-gate-failures">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Critical failures
            </h3>
            <ul className="space-y-3">
              {report.hardGateFailures.map((f) => (
                <li key={f.id} className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="font-medium text-ink-900">{f.label}</p>
                  <p className="mt-1 text-sm text-ink-400">{f.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.categories.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-600">
              Section by section
            </h3>
            <div className="divide-y divide-ink-900/10 rounded-xl border border-ink-900/10">
              {report.categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}

        {fixSteps.length > 0 && (
          <div className="mt-8 rounded-xl bg-ink-900 p-5 text-white">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">
              Here&apos;s how you can fix this yourself
            </h3>
            <ol className="space-y-4">
              {fixSteps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink-900">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-white/85">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div ref={formSlotRef} className="mt-9 text-center">
          {!showForm ? (
            <>
              <p className="mx-auto mb-4 max-w-sm text-sm text-ink-400">
                If you&apos;re tired of the trial and error and really want to get it right once
                and for all, send us a message now.
              </p>
              <button
                type="button"
                onClick={openForm}
                data-testid="primary-cta"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink-900 transition-transform hover:scale-[1.02]"
              >
                Get a Professionally Written CV
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <RequestForm />
          )}
        </div>

        <ScoreCard score={report.score} topFindingLabel={topFindingLabel} />

        <div className="mt-8 border-t border-ink-900/10 pt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Note</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
            Every time you send out a weak CV, that&apos;s an opportunity you hand to another
            candidate, one you were probably better than, except they had the better CV. You
            don&apos;t have to keep losing job opportunities that could have changed your life.
          </p>
          {!showForm && (
            <button
              type="button"
              onClick={openForm}
              data-testid="secondary-cta"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink-900 transition-transform hover:scale-[1.02]"
            >
              Get a Professionally Written CV
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryRow({ category }: { category: CategoryReport }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round((category.pointsEarned / category.maxPoints) * 100);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium text-ink-900">{category.label}</p>
            <span className="shrink-0 text-xs font-semibold text-ink-400">
              {category.pointsEarned}/{category.maxPoints}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${VERDICT_STYLES[category.verdict]}`}
        >
          {VERDICT_LABELS[category.verdict]}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4">
          <p className="text-sm text-ink-600">{category.summary}</p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">What we found</p>
            <ul className="mt-1.5 space-y-1 text-sm text-ink-600">
              {category.findings.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-gold-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-600">
              What to do
            </p>
            <ol className="space-y-2.5">
              {category.whatToDo.map((line, i) => (
                <li key={line} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-900">{line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#F4CB19 ${score * 3.6}deg, #EEF0F6 0deg)`,
      }}
      data-testid="score-ring"
      aria-label={`Score ${score} out of 100`}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
        <span className="font-display text-3xl font-medium text-ink-900">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-ink-400">out of 100</span>
      </div>
    </div>
  );
}
