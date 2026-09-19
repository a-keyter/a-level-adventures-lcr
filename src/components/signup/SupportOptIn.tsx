import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { requestSupport } from "@/lib/adventure.functions";

export function SupportOptIn({ choiceId }: { choiceId: string }) {
  const submit = useServerFn(requestSupport);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (state === "done") {
    return (
      <div className="arcade-panel border-accent flex items-start gap-3 p-5">
        <CheckCircle2 className="text-accent mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <h3 className="font-display text-highlight text-[0.65rem] tracking-widest uppercase">
            You're on the list
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Thanks. We'll pass your interest to local partners who support young researchers in the
            Liverpool City Region. Your email isn't linked to your name.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="arcade-panel p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setState("sending");
        try {
          await submit({ data: { choiceId, email } });
          setState("done");
        } catch {
          setState("idle");
          setError("We couldn't save that email address. Please check it and try again.");
        }
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Mail className="text-accent h-4 w-4" aria-hidden />
        <h3 className="font-display text-highlight text-[0.65rem] tracking-widest uppercase">
          Want ongoing support?
        </h3>
      </div>
      <p className="text-muted-foreground text-sm">
        Leave an email address if you'd like local partners to get in touch about helping with your
        research project. This is completely optional. We store the address on its own, with no name
        attached — only a random ID links it to the project you chose.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          aria-label="Your email address"
          className="arcade-inset focus-visible:ring-ring h-12 flex-1 px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <ArcadeButton type="submit" variant="accent" disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : "Keep me posted"}
        </ArcadeButton>
      </div>
      {error ? <p className="text-destructive mt-3 text-sm">{error}</p> : null}
    </form>
  );
}
