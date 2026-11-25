import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { supabase } from "@/integrations/supabase/client";
import { grantAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: SchoolsList,
});

function SchoolsList() {
  const queryClient = useQueryClient();
  const { data: schools, isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, slug, name, is_active")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const toggle = async (id: string, isActive: boolean) => {
    await supabase.from("schools").update({ is_active: !isActive }).eq("id", id);
    void queryClient.invalidateQueries({ queryKey: ["admin-schools"] });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="arcade-panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xs uppercase">Schools</h2>
          <Link to="/admin/schools/$schoolId" params={{ schoolId: "new" }}>
            <ArcadeButton size="sm">
              <Plus className="h-4 w-4" /> Add school
            </ArcadeButton>
          </Link>
        </div>
        {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : null}
        <ul className="flex flex-col gap-2">
          {schools?.map((s) => (
            <li key={s.id} className="arcade-inset flex flex-wrap items-center justify-between gap-3 p-3">
              <div>
                <p className="font-medium">{s.name}</p>
                <a
                  href={`/s/${s.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-accent inline-flex items-center gap-1 text-xs"
                >
                  /s/{s.slug} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle(s.id, s.is_active)}
                  className="text-xs underline"
                >
                  {s.is_active ? "Hide" : "Show"}
                </button>
                <span className={s.is_active ? "text-accent text-xs" : "text-muted-foreground text-xs"}>
                  {s.is_active ? "Live" : "Hidden"}
                </span>
                <Link
                  to="/admin/schools/$schoolId"
                  params={{ schoolId: s.id }}
                  className="text-highlight text-xs underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <AddAdmin />
    </div>
  );
}

function AddAdmin() {
  const grant = useServerFn(grantAdmin);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const result = await grant({ data: { email } });
      setMessage(result.message);
      if (result.ok) setEmail("");
    } catch {
      setMessage("Could not add that admin.");
    }
  };
  return (
    <section className="arcade-panel p-5">
      <h2 className="font-display mb-3 text-xs uppercase">Add a teammate as admin</h2>
      <p className="text-muted-foreground mb-3 text-sm">They need to sign up at /auth first.</p>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          aria-label="Teammate's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="arcade-inset h-11 flex-1 px-3"
        />
        <ArcadeButton type="submit" size="sm">Make admin</ArcadeButton>
      </form>
      {message ? <p className="text-accent mt-3 text-sm" role="status">{message}</p> : null}
    </section>
  );
}
