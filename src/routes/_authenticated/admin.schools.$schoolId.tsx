import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from "react";
import { ChevronLeft } from "lucide-react";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { AsciiTitle } from "@/components/arcade/AsciiTitle";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SUBJECT_GROUPS } from "@/data/subjects";
import { COLOUR_KEYS, safeColour, type SchoolColours } from "@/lib/school";

export const Route = createFileRoute("/_authenticated/admin/schools/$schoolId")({
  component: SchoolEditor,
});

const DEFAULT_COLOURS: Required<SchoolColours> = {
  primary: "#4FB3DD",
  accent: "#D3E9F2",
  highlight: "#F5E6A8",
  background: "#0E3550",
};

type Form = {
  name: string;
  slug: string;
  tagline: string;
  colours: Required<SchoolColours>;
  logo_url: string | null;
  subjects: string[];
  is_active: boolean;
};

const EMPTY: Form = {
  name: "",
  slug: "",
  tagline: "",
  colours: DEFAULT_COLOURS,
  logo_url: null,
  subjects: [],
  is_active: true,
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

/** Shrink an uploaded logo so it can be stored with the school. */
function resizeLogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 400 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function SchoolEditor() {
  const { schoolId } = Route.useParams();
  const isNew = schoolId === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    void supabase
      .from("schools")
      .select("*")
      .eq("id", schoolId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const c = (data.colours ?? {}) as SchoolColours;
          setForm({
            name: data.name,
            slug: data.slug,
            tagline: data.tagline ?? "",
            colours: {
              primary: safeColour(c.primary) ?? DEFAULT_COLOURS.primary,
              accent: safeColour(c.accent) ?? DEFAULT_COLOURS.accent,
              highlight: safeColour(c.highlight) ?? DEFAULT_COLOURS.highlight,
              background: safeColour(c.background) ?? DEFAULT_COLOURS.background,
            },
            logo_url: data.logo_url,
            subjects: data.subjects,
            is_active: data.is_active,
          });
        }
        setLoading(false);
      });
  }, [isNew, schoolId]);

  const allSubjects = form.subjects.length === 0;
  const grouped = useMemo(
    () => SUBJECT_GROUPS.map((g) => [g, SUBJECTS.filter((s) => s.group === g)] as const),
    [],
  );

  const toggleSubject = (name: string) => {
    setForm((f) => {
      const current = f.subjects.length === 0 ? SUBJECTS.map((s) => s.name) : f.subjects;
      const next = current.includes(name) ? current.filter((s) => s !== name) : [...current, name];
      return { ...f, subjects: next.length === SUBJECTS.length ? [] : next };
    });
  };

  const onLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage("Please choose an image file.");
    try {
      const url = await resizeLogo(file);
      setForm((f) => ({ ...f, logo_url: url }));
    } catch {
      setMessage("That image couldn't be read.");
    }
  };

  const save = async () => {
    setMessage(null);
    const slug = slugify(form.slug || form.name);
    if (!form.name.trim() || !slug) return setMessage("Add a school name.");
    const offered = form.subjects;
    if (offered.length > 0 && offered.length < 4) return setMessage("Pick at least four subjects.");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug,
      tagline: form.tagline.trim() || null,
      colours: form.colours,
      logo_url: form.logo_url,
      subjects: offered,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };
    const { error } = isNew
      ? await supabase.from("schools").insert(payload)
      : await supabase.from("schools").update(payload).eq("id", schoolId);
    setSaving(false);
    if (error) {
      return setMessage(
        error.code === "23505" ? "Another school already uses that web address." : "Could not save. Please try again.",
      );
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-schools"] });
    void navigate({ to: "/admin" });
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const previewStyle = {
    "--primary": form.colours.primary,
    "--accent": form.colours.accent,
    "--highlight": form.colours.highlight,
    backgroundColor: form.colours.background,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-5 pb-10">
      <Link to="/admin" className="text-muted-foreground hover:text-accent inline-flex items-center gap-1 text-xs uppercase">
        <ChevronLeft className="h-4 w-4" /> All schools
      </Link>

      <section className="arcade-panel flex flex-col gap-3 p-5">
        <h2 className="font-display text-xs uppercase">{isNew ? "New school" : "Edit school"}</h2>
        <label className="text-sm" htmlFor="school-name">School name</label>
        <input
          id="school-name"
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value, slug: isNew ? slugify(e.target.value) : f.slug }))
          }
          className="arcade-inset h-11 px-3"
        />
        <label className="text-sm" htmlFor="school-slug">Web address</label>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm">/s/</span>
          <input
            id="school-slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
            className="arcade-inset h-11 flex-1 px-3"
          />
        </div>
        <label className="text-sm" htmlFor="school-tagline">Tagline under the title</label>
        <input
          id="school-tagline"
          value={form.tagline}
          placeholder={form.name ? `at ${form.name}` : "at your school"}
          onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
          className="arcade-inset h-11 px-3"
        />
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
          />
          Live (students can open this school's page)
        </label>
      </section>

      <section className="arcade-panel flex flex-col gap-4 p-5">
        <h2 className="font-display text-xs uppercase">Colours and logo</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOUR_KEYS.map((key) => (
            <label key={key} className="flex flex-col gap-1 text-sm capitalize">
              {key}
              <input
                type="color"
                value={form.colours[key]}
                onChange={(e) => setForm((f) => ({ ...f, colours: { ...f.colours, [key]: e.target.value } }))}
                className="h-11 w-full cursor-pointer rounded-md border-2"
              />
            </label>
          ))}
        </div>
        <label className="text-sm" htmlFor="school-logo">Logo</label>
        <div className="flex flex-wrap items-center gap-3">
          <input id="school-logo" type="file" accept="image/*" onChange={onLogo} className="text-sm" />
          {form.logo_url ? (
            <button type="button" className="text-xs underline" onClick={() => setForm((f) => ({ ...f, logo_url: null }))}>
              Remove logo
            </button>
          ) : null}
        </div>
        <p className="text-muted-foreground text-xs">Preview</p>
        <div className="overflow-hidden rounded-md border-2 p-5" style={previewStyle}>
          <AsciiTitle schoolName={form.name || "Your school"} tagline={form.tagline} logoUrl={form.logo_url} />
        </div>
      </section>

      <section className="arcade-panel flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xs uppercase">Subjects offered</h2>
          <span className="text-muted-foreground text-xs">
            {allSubjects ? "All subjects" : `${form.subjects.length} of ${SUBJECTS.length}`}
          </span>
        </div>
        {grouped.map(([group, list]) => (
          <fieldset key={group} className="flex flex-col gap-1">
            <legend className="text-highlight mb-1 text-xs uppercase">{group}</legend>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {list.map((s) => (
                <label key={s.name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={allSubjects || form.subjects.includes(s.name)}
                    onChange={() => toggleSubject(s.name)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>

      {message ? <p className="text-destructive text-sm" role="alert">{message}</p> : null}
      <ArcadeButton onClick={save} disabled={saving} className="w-full sm:w-auto sm:self-start">
        {saving ? "Saving..." : "Save school"}
      </ArcadeButton>
    </div>
  );
}
