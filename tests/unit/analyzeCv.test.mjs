import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeCv } from "../../lib/analyzeCv.ts";

function doc(text, overrides = {}) {
  return { text, hasTable: false, isUnreadable: false, fileType: "docx", ...overrides };
}

test("unreadable file (image) always fails with a clear finding", () => {
  const report = analyzeCv({ text: "", hasTable: false, isUnreadable: true, fileType: "image" });
  assert.equal(report.band, "fails");
  assert.equal(report.hardGateFailures[0].id, "unreadable-file");
});

test("em dash is flagged as a hard gate", () => {
  const report = analyzeCv(doc("Handled operations — mostly logistics. 5 years experience."));
  assert.ok(report.hardGateFailures.some((f) => f.id === "em-dash"));
});

test("a table is flagged as a hard gate", () => {
  const report = analyzeCv(doc("Some CV text with 3 years of numbers 100 percent.", { hasTable: true }));
  assert.ok(report.hardGateFailures.some((f) => f.id === "table-layout"));
});

test("a CV with zero digits fails the no-numbers hard gate", () => {
  const report = analyzeCv(doc("Managed a team. Worked on projects. No figures here at all."));
  assert.ok(report.hardGateFailures.some((f) => f.id === "no-numbers"));
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

test("weak bullet openers are flagged", () => {
  const report = analyzeCv(
    doc("Contact: a@b.com linkedin.com/in/x\nResponsible for scheduling and 3 other duties.")
  );
  assert.ok(report.findings.some((f) => f.id === "weak-openers"));
});
