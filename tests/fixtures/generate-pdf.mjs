import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const LINES = [
  "Femi Adeyemi",
  "femi.adeyemi@example.com | linkedin.com/in/femiadeyemi",
  "",
  "Professional Summary",
  "Customer service lead with 5 years of experience handling escalations for a retail bank.",
  "",
  "Work Experience",
  "Customer Service Lead, Trust Bank Plc - Mar 2020 to Present",
  "Resolved 94% of escalated complaints within a 24 hour SLA across a 12 person team.",
  "Reduced average call handling time by 22% after redesigning the escalation script.",
  "Recovered 3.4 million naira in disputed transactions over 18 months.",
  "",
  "Core Skills",
  "Client Retention, SLA Management, Escalation Handling, Stakeholder Management",
];

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildContentStream(lines) {
  const commands = ["BT", "/F1 11 Tf", "50 740 Td"];
  lines.forEach((line, i) => {
    if (i > 0) commands.push("0 -16 Td");
    commands.push(`(${escapePdfText(line)}) Tj`);
  });
  commands.push("ET");
  return commands.join("\n");
}

function buildPdf(lines) {
  const stream = buildContentStream(lines);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "latin1");
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

async function main() {
  const pdf = buildPdf(LINES);
  await writeFile(path.join(dir, "quantified.pdf"), pdf);
  console.log("Wrote", path.join(dir, "quantified.pdf"), pdf.length, "bytes");
}

main();
