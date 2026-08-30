export type ExtractedDocument = {
  text: string;
  hasTable: boolean;
  isUnreadable: boolean;
  fileType: "pdf" | "docx" | "image" | "unknown";
};

const MIN_TEXT_LENGTH_FOR_REAL_PDF = 40;

// pdf.js hands back a flat list of positioned text fragments, not lines.
// Group fragments by their y-coordinate so bullet-level heuristics
// (which need real line breaks) have something to work with.
function reconstructLines(items: unknown[]): string {
  type PositionedItem = { str: string; transform: number[] };
  const rows: { y: number; text: string }[] = [];

  for (const raw of items) {
    if (!raw || typeof raw !== "object" || !("str" in raw)) continue;
    const item = raw as PositionedItem;
    const y = Math.round(item.transform?.[5] ?? 0);
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.y - y) < 2) {
      last.text += item.str;
    } else {
      rows.push({ y, text: item.str });
    }
  }

  return rows.map((row) => row.text.trim()).join("\n");
}

async function extractPdf(file: File): Promise<ExtractedDocument> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({
    data: buffer,
    standardFontDataUrl: "/pdfjs/standard_fonts/",
  }).promise;

  let text = "";
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    text += `${reconstructLines(content.items)}\n`;
  }

  const trimmed = text.trim();
  return {
    text: trimmed,
    hasTable: false,
    isUnreadable: trimmed.length < MIN_TEXT_LENGTH_FOR_REAL_PDF,
    fileType: "pdf",
  };
}

async function extractDocx(file: File): Promise<ExtractedDocument> {
  const mammoth = await import("mammoth/mammoth.browser");
  const buffer = await file.arrayBuffer();

  const [rawTextResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ arrayBuffer: buffer }),
    mammoth.convertToHtml({ arrayBuffer: buffer }),
  ]);

  const text = rawTextResult.value.trim();
  return {
    text,
    hasTable: /<table/i.test(htmlResult.value),
    isUnreadable: text.length < MIN_TEXT_LENGTH_FOR_REAL_PDF,
    fileType: "docx",
  };
}

function unreadableImage(): ExtractedDocument {
  return { text: "", hasTable: false, isUnreadable: true, fileType: "image" };
}

export async function extractDocument(file: File): Promise<ExtractedDocument> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return extractPdf(file);
  }

  if (
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractDocx(file);
  }

  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    file.type.startsWith("image/")
  ) {
    return unreadableImage();
  }

  return { text: "", hasTable: false, isUnreadable: true, fileType: "unknown" };
}
