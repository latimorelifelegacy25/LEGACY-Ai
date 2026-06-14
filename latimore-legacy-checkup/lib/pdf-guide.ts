import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, PDFImage, PDFPage, PDFFont, RGB, StandardFonts, rgb } from "pdf-lib";
import {
  GuideLeadPayload,
  bookingUrl,
  formatList,
  getComplianceText,
  getFullName,
  getGuideTitle,
  getPriorityChecklist,
  getReadinessRows,
  getScoreStatus,
  slugify
} from "./guide-content";

type DrawState = {
  doc: PDFDocument;
  page: PDFPage;
  width: number;
  height: number;
  margin: number;
  y: number;
  font: PDFFont;
  bold: PDFFont;
  navy: RGB;
  gold: RGB;
  slate: RGB;
  lightSlate: RGB;
};

export type GeneratedGuide = {
  bytes: Uint8Array;
  filename: string;
  title: string;
};

function sanitizeText(value: string) {
  return value
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function textWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(sanitizeText(text), size);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = sanitizeText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (textWidth(font, candidate, size) <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) lines.push(line);
    line = word;
  }

  if (line) lines.push(line);
  return lines;
}

function addPage(state: DrawState) {
  const page = state.doc.addPage([612, 792]);
  state.page = page;
  state.width = page.getWidth();
  state.height = page.getHeight();
  state.y = state.height - state.margin;
}

function ensureSpace(state: DrawState, needed: number) {
  if (state.y - needed < state.margin) {
    addPage(state);
  }
}

function drawText(
  state: DrawState,
  text: string,
  options: {
    size?: number;
    font?: PDFFont;
    color?: RGB;
    x?: number;
    lineHeight?: number;
    maxWidth?: number;
    after?: number;
  } = {}
) {
  const size = options.size ?? 11;
  const font = options.font ?? state.font;
  const color = options.color ?? state.slate;
  const x = options.x ?? state.margin;
  const maxWidth = options.maxWidth ?? state.width - state.margin * 2;
  const lineHeight = options.lineHeight ?? size + 5;
  const after = options.after ?? 6;
  const lines = wrapText(text, font, size, maxWidth);
  ensureSpace(state, lines.length * lineHeight + after);

  for (const line of lines) {
    state.page.drawText(line, {
      x,
      y: state.y,
      size,
      font,
      color
    });
    state.y -= lineHeight;
  }

  state.y -= after;
}

function drawHeader(state: DrawState, logo?: PDFImage) {
  state.page.drawRectangle({
    x: 0,
    y: state.height - 120,
    width: state.width,
    height: 120,
    color: state.navy
  });

  if (logo) {
    const logoWidth = 82;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    state.page.drawImage(logo, {
      x: state.margin,
      y: state.height - 100,
      width: logoWidth,
      height: logoHeight
    });
  }

  state.page.drawText("LATIMORE LIFE & LEGACY LLC", {
    x: logo ? state.margin + 100 : state.margin,
    y: state.height - 52,
    size: 16,
    font: state.bold,
    color: rgb(1, 1, 1)
  });

  state.page.drawText("Protecting Today. Securing Tomorrow.  #TheBeatGoesOn", {
    x: logo ? state.margin + 100 : state.margin,
    y: state.height - 75,
    size: 11,
    font: state.font,
    color: state.gold
  });

  state.y = state.height - 150;
}

function drawSectionTitle(state: DrawState, title: string) {
  ensureSpace(state, 42);

  state.page.drawText(sanitizeText(title), {
    x: state.margin,
    y: state.y,
    size: 16,
    font: state.bold,
    color: state.navy
  });

  state.y -= 10;

  state.page.drawLine({
    start: { x: state.margin, y: state.y },
    end: { x: state.width - state.margin, y: state.y },
    thickness: 1.5,
    color: state.gold
  });

  state.y -= 24;
}

function drawBullet(state: DrawState, text: string) {
  ensureSpace(state, 28);

  state.page.drawCircle({
    x: state.margin + 4,
    y: state.y + 3,
    size: 2.5,
    color: state.gold
  });

  drawText(state, text, {
    x: state.margin + 16,
    maxWidth: state.width - state.margin * 2 - 16,
    after: 3
  });
}

function drawKeyValue(state: DrawState, label: string, value?: string | number | null) {
  const safeValue = value === null || value === undefined || value === "" ? "Not provided" : String(value);
  ensureSpace(state, 24);

  state.page.drawText(sanitizeText(label), {
    x: state.margin,
    y: state.y,
    size: 10,
    font: state.bold,
    color: state.navy
  });

  drawText(state, safeValue, {
    x: state.margin + 150,
    maxWidth: state.width - state.margin * 2 - 150,
    size: 10,
    after: 2
  });
}

function drawReadinessTable(state: DrawState, score?: number) {
  const rows = getReadinessRows(score);
  const rowHeight = 28;
  const tableWidth = state.width - state.margin * 2;
  const labelWidth = 230;

  ensureSpace(state, rows.length * rowHeight + 20);

  for (const [index, [label, status]] of rows.entries()) {
    const y = state.y - rowHeight;
    const fill = index % 2 === 0 ? rgb(0.96, 0.97, 0.98) : rgb(1, 1, 1);

    state.page.drawRectangle({
      x: state.margin,
      y,
      width: tableWidth,
      height: rowHeight,
      color: fill,
      borderColor: rgb(0.88, 0.9, 0.92),
      borderWidth: 0.5
    });

    state.page.drawText(sanitizeText(label), {
      x: state.margin + 10,
      y: y + 9,
      size: 10,
      font: state.bold,
      color: state.navy
    });

    state.page.drawText(sanitizeText(status), {
      x: state.margin + labelWidth,
      y: y + 9,
      size: 10,
      font: state.bold,
      color: state.gold
    });

    state.y -= rowHeight;
  }

  state.y -= 18;
}

async function embedLogo(doc: PDFDocument) {
  const logoPath = path.join(process.cwd(), "public", "images", "latimore-logo.jpg");

  try {
    const logoBytes = await readFile(logoPath);
    return await doc.embedJpg(logoBytes);
  } catch {
    return null;
  }
}

export async function generateEducationGuidePdf(payload: GuideLeadPayload): Promise<GeneratedGuide> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const logo = await embedLogo(doc);
  const title = getGuideTitle(payload.priority_path);
  const score = typeof payload.legacy_score === "number" ? Math.round(payload.legacy_score) : undefined;

  const state: DrawState = {
    doc,
    page,
    width: page.getWidth(),
    height: page.getHeight(),
    margin: 54,
    y: page.getHeight() - 54,
    font,
    bold,
    navy: rgb(44 / 255, 62 / 255, 80 / 255),
    gold: rgb(196 / 255, 154 / 255, 108 / 255),
    slate: rgb(0.29, 0.33, 0.39),
    lightSlate: rgb(0.92, 0.94, 0.96)
  };

  drawHeader(state, logo ?? undefined);

  drawText(state, "Free Legacy Protection Checkup", {
    size: 12,
    font: state.bold,
    color: state.gold,
    after: 6
  });

  drawText(state, title, {
    size: 28,
    font: state.bold,
    color: state.navy,
    lineHeight: 34,
    after: 12
  });

  drawText(
    state,
    `Prepared for ${getFullName(payload)}. This personalized guide summarizes your selected priority, readiness score, and suggested next steps from the Latimore Legacy Checkup.`,
    { size: 12, lineHeight: 18, after: 18 }
  );

  state.page.drawRectangle({
    x: state.margin,
    y: state.y - 64,
    width: state.width - state.margin * 2,
    height: 64,
    color: rgb(0.96, 0.93, 0.89),
    borderColor: state.gold,
    borderWidth: 1
  });

  state.page.drawText("Legacy Readiness Score", {
    x: state.margin + 18,
    y: state.y - 24,
    size: 12,
    font: state.bold,
    color: state.navy
  });

  state.page.drawText(typeof score === "number" ? `${score} / 100` : "Needs Review", {
    x: state.margin + 18,
    y: state.y - 50,
    size: 20,
    font: state.bold,
    color: state.gold
  });

  state.page.drawText(getScoreStatus(score), {
    x: state.margin + 260,
    y: state.y - 42,
    size: 15,
    font: state.bold,
    color: state.navy
  });

  state.y -= 92;

  drawSectionTitle(state, "Your Snapshot");
  drawKeyValue(state, "Selected priority", payload.priority_path);
  drawKeyValue(state, "Who depends on you", formatList(payload.family_dependents));
  drawKeyValue(state, "Income stability", payload.income_stability);
  drawKeyValue(state, "Debt or mortgage", formatList(payload.mortgage_or_debt));
  drawKeyValue(state, "Retirement status", payload.retirement_status);
  drawKeyValue(state, "Life insurance", payload.life_insurance_status);
  drawKeyValue(state, "DIME coverage", payload.dime_coverage);
  drawKeyValue(state, "Living benefits interest", payload.living_benefits_interest);
  drawKeyValue(state, "Estate planning interest", payload.estate_planning_interest);

  drawSectionTitle(state, "Readiness Areas");
  drawReadinessTable(state, score);

  drawSectionTitle(state, "Recommended Review Checklist");
  for (const item of getPriorityChecklist(payload.priority_path)) {
    drawBullet(state, item);
  }

  drawSectionTitle(state, "Education Notes");
  drawBullet(state, "Protection planning helps address income, choices, dignity, and the people who depend on you.");
  drawBullet(state, "The Rule of 72 is an educational shortcut for estimating how long money may take to double.");
  drawBullet(state, "A retirement account is not the same as a retirement income plan.");
  drawBullet(state, "Taxable, tax-deferred, and tax-advantaged strategies may each play different roles.");
  drawBullet(state, "Estate planning helps protect the instructions, not just the money.");

  drawSectionTitle(state, "Next Step");
  drawText(
    state,
    "Based on your answers, consider booking a 30-minute Legacy Protection Review with Jackson Latimore Sr.",
    { size: 12, lineHeight: 18, after: 8 }
  );
  drawText(state, `Book here: ${bookingUrl}`, {
    size: 12,
    font: state.bold,
    color: state.gold,
    lineHeight: 18,
    after: 18
  });

  drawSectionTitle(state, "Educational Use Only");
  drawText(state, getComplianceText(), {
    size: 9,
    lineHeight: 14,
    color: rgb(0.42, 0.46, 0.52),
    after: 0
  });

  const pages = doc.getPages();
  pages.forEach((currentPage, index) => {
    currentPage.drawText(`Latimore Life & Legacy LLC | Page ${index + 1} of ${pages.length}`, {
      x: 54,
      y: 28,
      size: 8,
      font,
      color: rgb(0.55, 0.58, 0.62)
    });
  });

  const bytes = await doc.save();

  return {
    bytes,
    title,
    filename: `${slugify(title)}.pdf`
  };
}
