import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { School, SchoolColours } from "@/lib/school";

/** Public read of one active school's branding by its web address. */
export const getSchool = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ slug: z.string().regex(/^[a-z0-9-]{1,60}$/) }).parse(input),
  )
  .handler(async ({ data }): Promise<School | null> => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const { data: row } = await client
      .from("schools")
      .select("id, slug, name, tagline, colours, logo_url, subjects")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!row) return null;
    return { ...row, colours: (row.colours ?? {}) as SchoolColours };
  });
