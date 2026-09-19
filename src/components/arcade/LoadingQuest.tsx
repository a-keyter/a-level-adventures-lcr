import { useEffect, useState } from "react";

export function LoadingQuest({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div
      className="arcade-panel flex flex-col items-center gap-5 px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((dot) => (
          <span
            key={dot}
            className="bg-accent h-3 w-3 animate-arcade-float rounded-[2px]"
            style={{ animationDelay: `${dot * 0.12}s` }}
          />
        ))}
      </div>
      <p className="font-display text-highlight text-[0.65rem] leading-relaxed uppercase sm:text-[0.75rem]">
        Loading
        <span className="animate-arcade-blink">...</span>
      </p>
      <p className="text-muted-foreground max-w-sm text-sm">{messages[index]}</p>
    </div>
  );
}
