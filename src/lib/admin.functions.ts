import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Admins can make another signed-up person an admin by their email. */
export const grantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ email: z.string().email().max(255) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Only admins can do that.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = data.email.toLowerCase();
    let found: string | null = null;
    for (let page = 1; page <= 20 && !found; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error("Could not look up that person.");
      found = list.users.find((u) => u.email?.toLowerCase() === target)?.id ?? null;
      if (list.users.length < 200) break;
    }
    if (!found) return { ok: false as const, message: "No account with that email yet. Ask them to sign up first." };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: found, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error("Could not save that admin.");
    return { ok: true as const, message: `${data.email} is now an admin.` };
  });
