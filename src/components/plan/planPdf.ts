import { jsPDF } from "jspdf";
import type { ProjectIdea, ProjectPlan } from "@/lib/adventure-types";

const PURPLE = "#3d1a63";
const MAGENTA = "#c81a7a";
const TEAL = "#0f8b83";
const BODY = "#2b2b33";

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
  const margin = 48;
  const width = pageWidth - margin * 2;
  let y = 0;

  const newPage = () => {
    doc.addPage();
    y = margin;
  };

  const space = (needed: number) => {
    if (y + needed > pageHeight - margin) newPage();
  };

  const text = (
    value: string,
    options: { size?: number; colour?: string; style?: "normal" | "bold" | "italic"; gap?: number } = {},
  ) => {
    const { size = 10.5, colour = BODY, style = "normal", gap = 6 } = options;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(colour);
    const lines = doc.splitTextToSize(value, width) as string[];
    space(lines.length * (size + 3));
    doc.text(lines, margin, y);
    y += lines.length * (size + 3) + gap;
  };

  const heading = (value: string) => {
    space(40);
    y += 8;
    doc.setFillColor(MAGENTA);
    doc.rect(margin, y - 9, 4, 13, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(PURPLE);
    doc.text(value.toUpperCase(), margin + 12, y);
    y += 16;
  };

  const bullets = (items: string[]) => {
    for (const item of items) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(BODY);
      const lines = doc.splitTextToSize(item, width - 16) as string[];
      space(lines.length * 13.5 + 4);
      doc.setTextColor(TEAL);
      doc.text("•", margin, y);
      doc.setTextColor(BODY);
      doc.text(lines, margin + 14, y);
      y += lines.length * 13.5 + 4;
    }
    y += 4;
  };

  // Cover band
  doc.setFillColor(PURPLE);
  doc.rect(0, 0, pageWidth, 132, "F");
  doc.setFillColor(MAGENTA);
  doc.rect(0, 132, pageWidth, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#7fe3dc");
  doc.text("A LEVEL ADVENTURES IN THE LCR", margin, 46);
  doc.setFontSize(20);
  doc.setTextColor("#ffffff");
  const titleLines = doc.splitTextToSize(plan.title, width) as string[];
  doc.text(titleLines.slice(0, 2), margin, 74);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#e9d9f7");
  doc.text(`A levels: ${subjects.join(" · ")}`, margin, 74 + titleLines.slice(0, 2).length * 22);
  doc.text(`Sector focus: ${idea.sector}`, margin, 88 + titleLines.slice(0, 2).length * 22);

  y = 168;

  heading("Overview");
  text(plan.overview);

  heading("Our aim");
  text(plan.aim, { style: "italic" });

  heading("Research questions");
  bullets(plan.researchQuestions);

  heading("Time commitment");
  text(plan.weeklyCommitment);

  heading("Local organisations to approach");
  for (const partner of plan.localPartners) {
    space(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(PURPLE);
    doc.text(`${partner.name} (${partner.kind})`, margin, y);
    y += 14;
    text(partner.whyRelevant, { gap: 2 });
    text(`First step: ${partner.howToApproach}`, { style: "italic", colour: TEAL, gap: 10 });
  }

  heading("A message you could send");
  doc.setDrawColor("#d8cbe8");
  doc.setFillColor("#f6f1fb");
  {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(plan.outreachMessage, width - 24) as string[];
    space(lines.length * 13.5 + 24);
    doc.roundedRect(margin, y - 12, width, lines.length * 13.5 + 20, 6, 6, "FD");
    doc.setTextColor(BODY);
    doc.text(lines, margin + 12, y + 2);
    y += lines.length * 13.5 + 22;
  }

  heading("Week by week");
  for (const week of plan.timeline) {
    space(70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(MAGENTA);
    doc.text(`${week.week} — ${week.focus}`, margin, y);
    y += 14;
    bullets(week.tasks);
    text(`Meeting: ${week.meeting}`, { style: "italic", colour: TEAL, gap: 10 });
  }

  heading("Who does what");
  for (const role of plan.teamRoles) {
    space(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(PURPLE);
    doc.text(role.role, margin, y);
    y += 13;
    text(role.responsibilities, { gap: 8 });
  }

  heading("Ethics and safety");
  bullets(plan.ethicsAndSafety);

  heading("What finished looks like");
  bullets(plan.whatDoneLooksLike);

  heading("Sharing your findings");
  bullets(plan.sharingYourFindings);

  heading("Keeping it manageable");
  bullets(plan.keepingItManageable);

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#8a8397");
    doc.text(
      "Generated by A Level Adventures in the LCR — always check contact details before getting in touch.",
      margin,
      pageHeight - 24,
    );
    doc.text(`${page} / ${pages}`, pageWidth - margin, pageHeight - 24, { align: "right" });
  }

  const slug = plan.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  doc.save(`${slug || "research-project"}-plan.pdf`);
}
