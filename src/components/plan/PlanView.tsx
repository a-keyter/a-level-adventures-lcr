import { Download, Clock, Users, ShieldCheck, Flag, Megaphone, Sparkle } from "lucide-react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { downloadPlanPdf } from "@/components/plan/planPdf";
import type { ProjectIdea, ProjectPlan } from "@/lib/adventure-types";
import type { ReactNode } from "react";

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="arcade-panel p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon ? <span className="text-accent">{icon}</span> : null}
        <h3 className="font-display text-highlight text-[0.65rem] tracking-widest uppercase">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

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

      <Block title="Time commitment" icon={<Clock className="h-4 w-4" />}>
        <p className="text-muted-foreground text-sm">{plan.weeklyCommitment}</p>
      </Block>

      <Block title="Research questions">
        <List items={plan.researchQuestions} />
      </Block>

      <Block title="Local organisations to approach">
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
      </Block>

      <Block title="A message you could send" icon={<Megaphone className="h-4 w-4" />}>
        <p className="arcade-inset text-muted-foreground p-4 text-sm whitespace-pre-line">
          {plan.outreachMessage}
        </p>
      </Block>

      <Block title="Week by week">
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
      </Block>

      <Block title="Who does what" icon={<Users className="h-4 w-4" />}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {plan.teamRoles.map((role) => (
            <li key={role.role} className="arcade-inset p-4">
              <p className="text-highlight font-semibold">{role.role}</p>
              <p className="text-muted-foreground mt-1 text-sm">{role.responsibilities}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Ethics and safety" icon={<ShieldCheck className="h-4 w-4" />}>
        <List items={plan.ethicsAndSafety} />
      </Block>

      <Block title="What finished looks like" icon={<Flag className="h-4 w-4" />}>
        <List items={plan.whatDoneLooksLike} />
      </Block>

      <Block title="Sharing your findings">
        <List items={plan.sharingYourFindings} />
      </Block>

      <Block title="Keeping it manageable" icon={<Sparkle className="h-4 w-4" />}>
        <List items={plan.keepingItManageable} />
      </Block>
    </div>
  );
}
