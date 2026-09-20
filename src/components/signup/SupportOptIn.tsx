import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { requestSupport } from "@/lib/adventure.functions";

export function SupportOptIn({ choiceId }: { choiceId: string }) {
  const submit = useServerFn(requestSupport);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
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
            Thanks. We&apos;ll pass your interest to Generative Minds and Liverpool Chamber so they can
            get in touch about potential next steps to pursue your research project.
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

        if (!consent) {
          setError("Please confirm that you agree to be contacted before registering your interest.");
          return;
        }

        setState("sending");
        try {
          await submit({ data: { choiceId, email, consent } });
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
          Would you like support with your project?
        </h3>
      </div>
      <p className="text-muted-foreground text-sm">
        Register your interest and we&apos;ll share your details with local partners who can help with
        potential next steps for your research project.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span>
            I agree that I may be contacted by Generative Minds or Liverpool Chamber about potential
            next steps to pursue this research project.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
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
            {state === "sending" ? "Sending..." : "Register interest"}
          </ArcadeButton>
        </div>
      </div>
      {error ? <p className="text-destructive mt-3 text-sm">{error}</p> : null}
    </form>
  );
}
