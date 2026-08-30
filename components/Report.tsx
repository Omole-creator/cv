"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { CvReport } from "@/lib/analyzeCv";
import ScoreCard from "./ScoreCard";
import RequestForm from "./RequestForm";

const BAND_COPY: Record<CvReport["band"], string> = {
  excellent: "Solid shape. A few small things are worth tightening.",
  strong: "Good bones, but a couple of sections need real work.",
  weak: "There's a lot here worth fixing before this goes out again.",
  fails: "This is very likely getting filtered out before a person opens it.",
};

const KEYWORD_GUIDE: { sector: string; phrases: string[] }[] = [
  { sector: "Banking & fintech", phrases: ["Stakeholder Management", "Regulatory Compliance", "Reconciliation"] },
  { sector: "Admin & operations", phrases: ["Vendor Management", "Process Improvement", "Purchase Orders"] },
  { sector: "Customer service", phrases: ["Client Retention", "SLA Management", "Escalation Handling"] },
];

function atsNarrative(report: CvReport): string {
  const lead =
    report.hardGateFailures[0]?.detail ??
    report.findings.find((f) => f.id === "quantified-achievements")?.detail ??
    report.findings[0]?.detail;

  const manualFix =
    "Fixing the keyword side yourself means pulling 5 to 7 current job ads in your exact field, reading them closely for the phrases that keep repeating, the technical terms and the softer skill language both, then going back through your summary and experience section rewriting them in by hand without it turning into an obvious keyword dump. It's not complicated work, just slow, and easy to slightly overdo or underdo. Most people doing it properly lose a full weekend to it.";

  return lead ? `${lead} ${manualFix}` : manualFix;
}

export default function Report({ report, fileName }: { report: CvReport; fileName?: string }) {
  const [showForm, setShowForm] = useState(false);
  const allFindings = [...report.hardGateFailures, ...report.findings];
  const topFinding = allFindings[0];

  return (
    <section id="report" data-testid="report" className="mx-auto max-w-2xl px-5 pb-20">
      <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-9">
        <div className="flex flex-col items-center gap-2 text-center">
          <ScoreRing score={report.score} />
          <p className="font-medium text-ink-900">{BAND_COPY[report.band]}</p>
          {fileName && <p className="text-xs text-ink-400">{fileName}</p>}
        </div>

        {report.hardGateFailures.length > 0 && (
          <div className="mt-8">
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

        {report.findings.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-600">
              What we noticed
            </h3>
            <ul className="space-y-3">
              {report.findings.map((f) => (
                <li key={f.id} className="rounded-xl border border-ink-900/10 p-4">
                  <p className="font-medium text-ink-900">{f.label}</p>
                  <p className="mt-1 text-sm text-ink-400">{f.detail}</p>
                  {f.example && (
                    <p className="mt-2 rounded-md bg-ink-50 px-2.5 py-1.5 text-xs text-ink-600">
                      &quot;{f.example}&quot;
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 rounded-xl bg-ink-900 p-5 text-white">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold">
            The ATS keyword problem
          </h3>
          <p className="text-sm leading-relaxed text-white/85">{atsNarrative(report)}</p>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-600">
            A few phrases worth knowing, by sector
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {KEYWORD_GUIDE.map((group) => (
              <div key={group.sector} className="rounded-xl border border-ink-900/10 p-3.5">
                <p className="text-xs font-semibold text-ink-900">{group.sector}</p>
                <ul className="mt-1.5 space-y-1 text-xs text-ink-400">
                  {group.phrases.map((phrase) => (
                    <li key={phrase}>{phrase}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 text-center">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              data-testid="primary-cta"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink-900 transition-transform hover:scale-[1.02]"
            >
              Get a Professionally Written CV (Skip the Manual Work)
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <RequestForm />
          )}
        </div>

        <ScoreCard score={report.score} topFindingLabel={topFinding?.label} />
      </div>
    </section>
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
