import { jsPDF } from "jspdf";
import type { ProjectIdea, ProjectPlan } from "@/lib/adventure-types";

const COLOURS = {
  purple: "#3d1a63",
  magenta: "#c81a7a",
  teal: "#0f8b83",
  ink: "#292530",
  muted: "#665f70",
  lightPurple: "#f5f0f8",
  paleTeal: "#edf7f5",
  rule: "#d9d0df",
  white: "#ffffff",
} as const;

const PAGE = {
  margin: 46,
  footerHeight: 38,
  coverHeight: 146,
  bodyTop: 174,
  textSize: 10.5,
  lineHeight: 14.5,
} as const;

type TextStyle = "normal" | "bold" | "italic";

export function downloadPlanPdf({
  plan,
  idea,
  subjects,
}: {
  plan: ProjectPlan;
  idea: ProjectIdea;
  subjects: string[];
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE.margin * 2;
  const contentBottom = pageHeight - PAGE.footerHeight;
  let y = PAGE.bodyTop;

  const setText = (size: number, colour: string, style: TextStyle = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(colour);
  };

  const wrapped = (value: string, width = contentWidth) =>
    doc.splitTextToSize(value || "", width) as string[];

  const newPage = () => {
    doc.addPage();
    y = PAGE.margin + 8;
  };

  const ensureSpace = (height: number) => {
    if (y + height > contentBottom && y > PAGE.margin + 12) newPage();
  };

  const drawLines = (
    lines: string[],
    options: {
      size?: number;
      colour?: string;
      style?: TextStyle;
      lineHeight?: number;
      x?: number;
    } = {},
  ) => {
    const size = options.size ?? PAGE.textSize;
    const lineHeight = options.lineHeight ?? PAGE.lineHeight;
    const x = options.x ?? PAGE.margin;
    setText(size, options.colour ?? COLOURS.ink, options.style);

    for (const line of lines) {
      if (y + lineHeight > contentBottom) newPage();
      doc.text(line, x, y);
      y += lineHeight;
    }
  };

  const drawText = (
    value: string,
    options: {
      size?: number;
      colour?: string;
      style?: TextStyle;
      gap?: number;
      width?: number;
      lineHeight?: number;
    } = {},
  ) => {
    const size = options.size ?? PAGE.textSize;
    const lineHeight = options.lineHeight ?? PAGE.lineHeight;
    const lines = wrapped(value, options.width ?? contentWidth);
    drawLines(lines, { ...options, size, lineHeight });
    y += options.gap ?? 7;
  };

  const sectionHeading = (value: string) => {
    ensureSpace(34);
    y += 5;
    doc.setFillColor(COLOURS.magenta);
    doc.rect(PAGE.margin, y - 11, 4, 15, "F");
    setText(12, COLOURS.purple, "bold");
    doc.text(value.toUpperCase(), PAGE.margin + 12, y);
    y += 21;
  };

  const drawBullets = (items: string[]) => {
    for (const item of items) {
      const lines = wrapped(item, contentWidth - 17);
      const height = Math.max(lines.length, 1) * PAGE.lineHeight + 4;
      ensureSpace(height);
      setText(PAGE.textSize, COLOURS.teal);
      doc.text("•", PAGE.margin, y);
      drawLines(lines, { x: PAGE.margin + 16 });
      y += 4;
    }
    y += 3;
  };

  const drawCard = (options: {
    title?: string;
    label?: string;
    body?: string;
    bodyColour?: string;
    fill?: string;
    border?: string;
    titleColour?: string;
    padding?: number;
  }) => {
    const padding = options.padding ?? 12;
    const titleLines = options.title ? wrapped(options.title, contentWidth - padding * 2) : [];
    const labelLines = options.label ? wrapped(options.label, contentWidth - padding * 2) : [];
    const bodyLines = options.body ? wrapped(options.body, contentWidth - padding * 2) : [];
    const lineCount = titleLines.length + labelLines.length + bodyLines.length;
    const height = padding * 2 + Math.max(lineCount, 1) * PAGE.lineHeight + 4;

    ensureSpace(height);
    doc.setFillColor(options.fill ?? COLOURS.lightPurple);
    doc.setDrawColor(options.border ?? COLOURS.rule);
    doc.roundedRect(PAGE.margin, y - 10, contentWidth, height, 5, 5, "FD");
    y += padding;

    if (options.label) {
      drawLines(labelLines, { size: 8.5, colour: COLOURS.teal, style: "bold", lineHeight: 12 });
      y += 2;
    }
    if (options.title) {
      drawLines(titleLines, {
        size: 11,
        colour: options.titleColour ?? COLOURS.purple,
        style: "bold",
      });
      y += 1;
    }
    if (options.body) {
      drawLines(bodyLines, {
        colour: options.bodyColour ?? COLOURS.ink,
      });
    }
    y += padding - 4;
  };

  const drawCover = () => {
    doc.setFillColor(COLOURS.purple);
    doc.rect(0, 0, pageWidth, PAGE.coverHeight, "F");
    doc.setFillColor(COLOURS.magenta);
    doc.rect(0, PAGE.coverHeight, pageWidth, 6, "F");

    setText(8.5, "#91e1db", "bold");
    doc.text("A LEVEL ADVENTURES IN THE LCR", PAGE.margin, 39);

    const titleLines = wrapped(plan.title, contentWidth - 12).slice(0, 2);
    if (wrapped(plan.title, contentWidth - 12).length > titleLines.length) {
      titleLines[titleLines.length - 1] = `${titleLines[titleLines.length - 1]}...`;
    }
    setText(20, COLOURS.white, "bold");
    doc.text(titleLines, PAGE.margin, 70, { lineHeightFactor: 1.18 });

    const metadataY = 78 + titleLines.length * 22;
    setText(9.5, "#eadcf3");
    doc.text(`A levels: ${subjects.join(" | ")}`, PAGE.margin, metadataY);
    doc.text(`Sector focus: ${idea.sector}`, PAGE.margin, metadataY + 16);
  };

  const drawFooter = () => {
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(COLOURS.rule);
      doc.line(
        PAGE.margin,
        pageHeight - PAGE.footerHeight + 4,
        pageWidth - PAGE.margin,
        pageHeight - PAGE.footerHeight + 4,
      );
      setText(7.5, COLOURS.muted);
      doc.text(
        "Check contact details before getting in touch, and ask a teacher to review messages.",
        PAGE.margin,
        pageHeight - 19,
      );
      doc.text(`${page} / ${pages}`, pageWidth - PAGE.margin, pageHeight - 19, { align: "right" });
    }
  };

  drawCover();

  sectionHeading("Project at a glance");
  drawText(plan.overview, { size: 11, lineHeight: 15.5, gap: 9 });
  drawCard({
    label: "OUR AIM",
    body: plan.aim,
    fill: COLOURS.paleTeal,
    border: "#abdcd5",
    bodyColour: COLOURS.purple,
  });
  y += 5;
  drawCard({
    label: "TIME COMMITMENT",
    body: plan.weeklyCommitment,
    fill: COLOURS.lightPurple,
  });

  sectionHeading("Research questions");
  drawBullets(plan.researchQuestions);

  sectionHeading("Local organisations to approach");
  for (const partner of plan.localPartners) {
    drawCard({
      title: partner.name,
      label: partner.kind,
      body: `${partner.whyRelevant}\nFirst step: ${partner.howToApproach}`,
      bodyColour: COLOURS.ink,
      fill: COLOURS.white,
    });
    y += 5;
  }

  sectionHeading("A message you could send");
  drawCard({
    body: plan.outreachMessage,
    fill: COLOURS.paleTeal,
    border: "#abdcd5",
    padding: 15,
  });

  sectionHeading("Week by week");
  for (const week of plan.timeline) {
    drawCard({
      title: `${week.week} - ${week.focus}`,
      body: `${week.tasks.map((task) => `• ${task}`).join("\n")}\nMeeting: ${week.meeting}`,
      fill: COLOURS.white,
      titleColour: COLOURS.magenta,
    });
    y += 5;
  }

  sectionHeading("Who does what");
  for (const role of plan.teamRoles) {
    drawCard({ title: role.role, body: role.responsibilities, fill: COLOURS.lightPurple });
    y += 5;
  }

  sectionHeading("Ethics and safety");
  drawBullets(plan.ethicsAndSafety);

  sectionHeading("What finished looks like");
  drawBullets(plan.whatDoneLooksLike);

  sectionHeading("Sharing your findings");
  drawBullets(plan.sharingYourFindings);

  sectionHeading("Keeping it manageable");
  drawBullets(plan.keepingItManageable);

  drawFooter();

  const slug = plan.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  doc.save(`${slug || "research-project"}-plan.pdf`);
}
