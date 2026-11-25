import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — A Level Adventures" },
      { name: "description", content: "Sign in to manage schools on A Level Adventures." },
      { property: "og:title", content: "Admin sign in — A Level Adventures" },
      { property: "og:description", content: "Sign in to manage schools on A Level Adventures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const GOOGLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>';

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/admin", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") void navigate({ to: "/admin", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setMessage(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
    setBusy(false);
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth`,
    });
    if (result.error) setMessage("Google sign-in didn't work. Please try again.");
  };

  return (
    <ArcadeFrame className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="arcade-panel w-full max-w-sm p-6">
        <PixelHeading as="h1" className="mb-6 text-center">
          Admin {mode === "in" ? "sign in" : "sign up"}
        </PixelHeading>
        <button
          type="button"
          onClick={google}
          className="mb-5 flex h-11 w-full items-center justify-center gap-[10px] rounded-md border border-[#747775] bg-[#FFFFFF] px-3 text-sm font-medium text-[#1F1F1F]"
        >
          <span aria-hidden className="h-[18px] w-[18px]" dangerouslySetInnerHTML={{ __html: GOOGLE_SVG }} />
          Continue with Google
        </button>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="text-sm" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="arcade-inset h-12 px-3 text-base"
          />
          <label className="text-sm" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="arcade-inset h-12 px-3 text-base"
          />
          <ArcadeButton type="submit" disabled={busy} className="mt-2 w-full">
            {mode === "in" ? "Sign in" : "Create account"}
          </ArcadeButton>
        </form>
        {message ? <p className="text-accent mt-4 text-sm" role="status">{message}</p> : null}
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="text-muted-foreground hover:text-accent mt-5 w-full text-center text-xs underline"
        >
          {mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </ArcadeFrame>
  );
}
