import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";

export function QuestReadyDialog({
  count,
  onContinue,
  onClose,
}: {
  count: number;
  onContinue: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="New quests available"
    >
      <button
        type="button"
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="arcade-panel relative w-full max-w-md rounded-b-none p-6 text-center sm:rounded-b-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted-foreground hover:text-accent absolute top-3 right-3 rounded-md p-1"
        >
          <X className="h-5 w-5" />
        </button>
        <Sparkles className="text-highlight animate-arcade-float mx-auto h-8 w-8" aria-hidden />
        <h3 className="font-display text-highlight mt-4 text-[0.75rem] leading-relaxed">
          New quest{count === 1 ? "" : "s"} available!
        </h3>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {count} challenge brief{count === 1 ? " is" : "s are"} ready, built from your subjects
          and the Liverpool City Region&rsquo;s skills priorities.
        </p>
        <div className="mt-5 flex flex-col items-center gap-3">
          <ArcadeButton onClick={onContinue}>View challenge briefs</ArcadeButton>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-accent text-xs uppercase"
          >
            Stay on my subject chart
          </button>
        </div>
      </div>
    </div>
  );
}
