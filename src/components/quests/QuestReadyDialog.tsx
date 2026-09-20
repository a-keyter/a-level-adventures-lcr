import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";

export function QuestReadyDialog({ count, onContinue }: { count: number; onContinue: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="New quests available"
    >
      <div className="bg-background/80 absolute inset-0 backdrop-blur-sm" aria-hidden />
      <div className="arcade-panel relative w-full max-w-md rounded-b-none p-6 text-center sm:rounded-b-lg">
        <Sparkles className="text-highlight animate-arcade-float mx-auto h-8 w-8" aria-hidden />
        <h3 className="font-display text-highlight mt-4 text-[0.75rem] leading-relaxed">
          New quest{count === 1 ? "" : "s"} available!
        </h3>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {count} challenge brief{count === 1 ? " is" : "s are"} ready, built from your four subjects
          and the Liverpool City Region&rsquo;s skills priorities.
        </p>
        <div className="mt-5">
          <ArcadeButton onClick={onContinue}>View challenge briefs</ArcadeButton>
        </div>
      </div>
    </div>
  );
}
