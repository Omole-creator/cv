import JSZip from "jszip";
import { writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

function paragraph(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<w:p><w:r><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
}

function table() {
  return `<w:tbl>
    <w:tblPr><w:tblW w:w="0" w:type="auto"/></w:tblPr>
    <w:tblGrid><w:gridCol w:w="4000"/><w:gridCol w:w="4000"/></w:tblGrid>
    <w:tr>
      <w:tc><w:tcPr/><w:p><w:r><w:t>Skill</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr/><w:p><w:r><w:t>Level</w:t></w:r></w:p></w:tc>
    </w:tr>
  </w:tbl>`;
}

async function buildDocx(bodyParts) {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", CONTENT_TYPES);
  zip.folder("_rels").file(".rels", RELS);
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyParts.join("\n")}
  </w:body>
</w:document>`;
  zip.folder("word").file("document.xml", documentXml);
  return zip.generateAsync({ type: "nodebuffer" });
}

const CLEAN_CV_LINES = [
  "Amaka Obi",
  "amaka.obi@example.com | linkedin.com/in/amakaobi | Lagos, Nigeria",
  "",
  "Professional Summary",
  "Operations coordinator with 4 years of experience across logistics and vendor management.",
  "",
  "Work Experience",
  "Operations Coordinator, Bright Logistics Ltd, Lagos - Jan 2021 to Present",
  "Reduced average delivery turnaround by 18% by renegotiating three vendor contracts.",
  "Processed 220 purchase orders per month with a 99% accuracy rate across two warehouses.",
  "Cut monthly courier costs by 12,000 naira through a route consolidation pilot.",
  "Trained 6 new hires on the dispatch system, cutting onboarding time from 3 weeks to 9 days.",
  "",
  "Core Skills",
  "Vendor Management, Purchase Orders, Inventory Control, Stakeholder Management, Logistics Coordination",
];

const EM_DASH_CV_LINES = [
  "Chidi Nwosu",
  "chidi.nwosu@example.com | linkedin.com/in/chidinwosu | Abuja, Nigeria",
  "",
  "Professional Summary",
  "Admin assistant — hardworking and passionate about operations.",
  "",
  "Work Experience",
  "Admin Assistant, Sunrise Holdings, Abuja - Jun 2022 to Present",
  "Responsible for scheduling — managed the front desk and handled visitor logs.",
  "In charge of office supplies ordering.",
  "",
  "Core Skills",
  "Scheduling, Filing, Customer Service",
];

async function main() {
  const cleanDocx = await buildDocx(CLEAN_CV_LINES.map(paragraph));
  await writeFile(path.join(dir, "clean.docx"), cleanDocx);

  const tableDocx = await buildDocx([...EM_DASH_CV_LINES.map(paragraph), table()]);
  await writeFile(path.join(dir, "table-and-emdash.docx"), tableDocx);

  const publicLogo = path.join(dir, "..", "..", "public", "logo.jpg");
  await copyFile(publicLogo, path.join(dir, "photo.jpg"));

  console.log("Fixtures written to", dir);
}

main();
