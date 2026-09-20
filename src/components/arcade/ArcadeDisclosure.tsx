import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ArcadeDisclosureProps = {
  value: string;
  title: string;
  summary?: string;
  children: ReactNode;
  icon?: ReactNode;
  defaultOpen?: boolean;
};

export function ArcadeDisclosure({
  value,
  title,
  summary,
  children,
  icon,
  defaultOpen = false,
}: ArcadeDisclosureProps) {
  return (
    <Accordion
      type="single"
      collapsible
      {...(defaultOpen ? { defaultValue: value } : {})}
      className="arcade-panel overflow-hidden"
    >
      <AccordionItem value={value} className="border-0">
        <AccordionTrigger className="gap-3 px-5 py-4 no-underline hover:no-underline sm:px-6">
          <span className="flex min-w-0 items-start gap-3 text-left">
            {icon ? (
              <span className="text-accent mt-0.5 shrink-0" aria-hidden>
                {icon}
              </span>
            ) : null}
            <span className="min-w-0">
              <span className="font-display text-highlight block text-[0.65rem] tracking-widest uppercase">
                {title}
              </span>
              {summary ? (
                <span className="text-muted-foreground mt-1 block text-sm font-normal normal-case tracking-normal">
                  {summary}
                </span>
              ) : null}
            </span>
          </span>
          <ChevronDown className="text-accent h-4 w-4 shrink-0" aria-hidden />
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-5 sm:px-6">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
