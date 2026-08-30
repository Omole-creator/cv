import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeCv } from "../../lib/analyzeCv.ts";

function doc(text, overrides = {}) {
  return { text, hasTable: false, isUnreadable: false, fileType: "docx", ...overrides };
}

test("unreadable file (image) always scores low with a clear finding", () => {
  const report = analyzeCv({ text: "", hasTable: false, isUnreadable: true, fileType: "image" });
  assert.equal(report.band, "critical");
  assert.equal(report.hardGateFailures[0].id, "unreadable-file");
});

test("an em dash is never a hard gate, only a writing-style deduction", () => {
  const report = analyzeCv(doc("Handled operations — mostly logistics. 5 years experience."));
  assert.ok(!report.hardGateFailures.some((f) => f.id === "em-dash"));
  const writing = report.categories.find((c) => c.id === "writing");
  assert.ok(writing.findings.some((line) => /em dash/i.test(line)));
  assert.ok(writing.pointsEarned < writing.maxPoints);
});

test("a table is flagged as a hard gate", () => {
  const report = analyzeCv(doc("Some CV text with 3 years of numbers 100 percent.", { hasTable: true }));
  assert.ok(report.hardGateFailures.some((f) => f.id === "table-layout"));
});

test("zero digits in Work Experience fails the no-numbers hard gate", () => {
  const report = analyzeCv(
    doc("Experience\nManaged a team.\nWorked on projects.\nNo figures here at all.")
  );
  assert.ok(report.hardGateFailures.some((f) => f.id === "no-numbers"));
});

test("no Work Experience section found means the no-numbers hard gate is skipped, not failed", () => {
  const report = analyzeCv(doc("Managed a team. Worked on projects. No figures here at all."));
  assert.ok(!report.hardGateFailures.some((f) => f.id === "no-numbers"));
});

test("numbers outside Work Experience are never required", () => {
  const withoutSummaryNumber = analyzeCv(
    doc(
      "Amaka Obi\nSummary\nOperations coordinator early in her career.\nExperience\nReduced delivery turnaround by 18 percent in 2023."
    )
  );
  const summary = withoutSummaryNumber.categories.find((c) => c.id === "summary");
  assert.ok(summary.pointsEarned > 0, "a summary with no number should still earn points");

  const withSummaryNumber = analyzeCv(
    doc(
      "Amaka Obi\nSummary\nOperations coordinator who cut costs by 10 percent last year.\nExperience\nReduced delivery turnaround by 18 percent in 2023."
    )
  );
  assert.ok(
    withSummaryNumber.categories.find((c) => c.id === "summary").pointsEarned >
      summary.pointsEarned,
    "a summary with a measurable achievement should score higher than one without"
  );
});

test("a clean, quantified CV scores well with no hard gates", () => {
  const text = [
    "Amaka Obi",
    "amaka.obi@example.com linkedin.com/in/amakaobi",
    "Reduced delivery turnaround by 18 percent across three vendor contracts in 2023.",
    "Processed 220 purchase orders per month with 99 percent accuracy across two warehouses.",
    "Cut monthly courier costs by 12000 naira through a route consolidation pilot in 2022.",
    "Trained 6 new hires on the dispatch system cutting onboarding time from 3 weeks to 9 days.",
  ].join("\n");
  const report = analyzeCv(doc(text));
  assert.equal(report.hardGateFailures.length, 0);
  assert.ok(report.score >= 60, `expected score >= 60, got ${report.score}`);
});

test("weak bullet openers are flagged in the writing category", () => {
  const report = analyzeCv(
    doc("Contact: a@b.com linkedin.com/in/x\nResponsible for scheduling and 3 other duties.")
  );
  const writing = report.categories.find((c) => c.id === "writing");
  assert.ok(writing.findings.some((line) => /weak verb/i.test(line)));
});

test("every category adds up to the overall score, capped at 59 on a hard gate", () => {
  const report = analyzeCv(
    doc("Handled operations, mostly logistics. 5 years experience.", { hasTable: true })
  );
  const rawTotal = report.categories.reduce((sum, c) => sum + c.pointsEarned, 0);
  assert.ok(rawTotal >= report.score);
  assert.ok(report.score <= 59);
});
