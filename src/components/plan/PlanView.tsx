import {
  Download,
  Clock,
  Users,
  ShieldCheck,
  Flag,
  Megaphone,
  Sparkle,
  HelpCircle,
  Building2,
  CalendarDays,
  Share2,
} from "lucide-react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { ArcadeDisclosure } from "@/components/arcade/ArcadeDisclosure";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { downloadPlanPdf } from "@/components/plan/planPdf";
import type { ProjectIdea, ProjectPlan } from "@/lib/adventure-types";
import type { ReactNode } from "react";

function List({ items }: { items: string[] }) {
  return (
    <ul className="text-muted-foreground space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-accent shrink-0">▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanView({
  plan,
  idea,
  subjects,
}: {
  plan: ProjectPlan;
  idea: ProjectIdea;
  subjects: string[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="arcade-panel p-5 sm:p-6">
        <p className="text-accent text-[0.65rem] tracking-widest uppercase">{idea.sector}</p>
        <PixelHeading as="h2" className="mt-2">
          {plan.title}
        </PixelHeading>
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{plan.overview}</p>
        <p className="border-highlight text-foreground mt-4 border-l-4 pl-3 text-sm italic">
          {plan.aim}
        </p>
        <p className="text-muted-foreground mt-4 text-xs">
          Built around: {subjects.join(" · ")}
        </p>
        <ArcadeButton
          className="mt-5 w-full sm:w-auto"
          onClick={() => downloadPlanPdf({ plan, idea, subjects })}
        >
          <Download className="h-4 w-4" />
          Download plan (PDF)
        </ArcadeButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="arcade-inset p-4">
          <Clock className="text-accent mb-3 h-5 w-5" aria-hidden />
          <p className="font-display text-highlight text-[0.6rem] uppercase">Time commitment</p>
          <p className="text-muted-foreground mt-2 text-sm">{plan.weeklyCommitment}</p>
        </div>
        <div className="arcade-inset p-4">
          <HelpCircle className="text-accent mb-3 h-5 w-5" aria-hidden />
          <p className="font-display text-highlight text-[0.6rem] uppercase">Research questions</p>
          <p className="text-muted-foreground mt-2 text-sm">{plan.researchQuestions.length} to explore</p>
        </div>
        <div className="arcade-inset p-4">
          <CalendarDays className="text-accent mb-3 h-5 w-5" aria-hidden />
          <p className="font-display text-highlight text-[0.6rem] uppercase">Quest length</p>
          <p className="text-muted-foreground mt-2 text-sm">{plan.timeline.length} weeks</p>
        </div>
      </div>

      <ArcadeDisclosure title="Research questions" value="research" icon={<HelpCircle className="h-4 w-4" />} summary="Questions to guide your investigation.">
        <List items={plan.researchQuestions} />
      </ArcadeDisclosure>

      <ArcadeDisclosure title="Local organisations to approach" value="partners" icon={<Building2 className="h-4 w-4" />} summary={`${plan.localPartners.length} possible partners and a first step for each.`}>
        <ul className="flex flex-col gap-3">
          {plan.localPartners.map((partner) => (
            <li key={partner.name} className="arcade-inset p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-highlight font-semibold">{partner.name}</span>
                <span className="text-accent text-xs uppercase">{partner.kind}</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{partner.whyRelevant}</p>
              <p className="text-accent mt-2 text-sm">First step: {partner.howToApproach}</p>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-4 text-xs">
          Always double-check names and contact details before getting in touch, and ask a teacher to
          look over your message first.
        </p>
      </ArcadeDisclosure>

      <ArcadeDisclosure title="A message you could send" value="message" icon={<Megaphone className="h-4 w-4" />} summary="A short starting point for contacting a partner.">
        <p className="arcade-inset text-muted-foreground p-4 text-sm whitespace-pre-line">
          {plan.outreachMessage}
        </p>
      </ArcadeDisclosure>

      <ArcadeDisclosure title="Week by week" value="timeline" icon={<CalendarDays className="h-4 w-4" />} summary={`${plan.timeline.length}-week mission timeline.`}>
        <ol className="flex flex-col gap-3">
          {plan.timeline.map((week) => (
            <li key={week.week} className="arcade-inset p-4">
              <p className="text-highlight font-display text-[0.6rem] uppercase">{week.week}</p>
              <p className="text-foreground mt-2 text-sm font-medium">{week.focus}</p>
              <List items={week.tasks} />
              <p className="text-accent mt-2 text-xs">Meeting: {week.meeting}</p>
            </li>
          ))}
        </ol>
      </ArcadeDisclosure>

      <ArcadeDisclosure title="Who does what" value="roles" icon={<Users className="h-4 w-4" />} summary={`${plan.teamRoles.length} suggested roles for your team.`}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {plan.teamRoles.map((role) => (
            <li key={role.role} className="arcade-inset p-4">
              <p className="text-highlight font-semibold">{role.role}</p>
              <p className="text-muted-foreground mt-1 text-sm">{role.responsibilities}</p>
            </li>
          ))}
        </ul>
      </ArcadeDisclosure>

      <ArcadeDisclosure title="Ethics and safety" value="safety" icon={<ShieldCheck className="h-4 w-4" />} summary="Checks to keep your research respectful and safe.">
        <List items={plan.ethicsAndSafety} />
      </ArcadeDisclosure>

      <ArcadeDisclosure title="What finished looks like" value="finished" icon={<Flag className="h-4 w-4" />} summary="Your finish-line checklist.">
        <List items={plan.whatDoneLooksLike} />
      </ArcadeDisclosure>

      <ArcadeDisclosure title="Sharing your findings" value="sharing" icon={<Share2 className="h-4 w-4" />} summary="Ways to share what you discover locally.">
        <List items={plan.sharingYourFindings} />
      </ArcadeDisclosure>

      <ArcadeDisclosure title="Keeping it manageable" value="manageable" icon={<Sparkle className="h-4 w-4" />} summary="Practical ways to stay within your weekly limit.">
        <List items={plan.keepingItManageable} />
      </ArcadeDisclosure>
    </div>
  );
}
