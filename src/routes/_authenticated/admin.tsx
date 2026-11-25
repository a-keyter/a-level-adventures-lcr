import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArcadeFrame } from "@/components/arcade/ArcadeFrame";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { PixelHeading } from "@/components/arcade/PixelHeading";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    return { isAdmin: data === true };
  },
  head: () => ({
    meta: [
      { title: "Admin — A Level Adventures" },
      { name: "description", content: "Manage schools and their branding." },
      { property: "og:title", content: "Admin — A Level Adventures" },
      { property: "og:description", content: "Manage schools and their branding." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  return (
    <ArcadeFrame className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin">
          <PixelHeading as="h1">School admin</PixelHeading>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden text-xs sm:inline">{user.email}</span>
          <ArcadeButton variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </ArcadeButton>
        </div>
      </div>
      {isAdmin ? (
        <Outlet />
      ) : (
        <div className="arcade-panel p-6 text-sm leading-relaxed">
          You're signed in, but this account isn't an admin yet. Ask an existing admin to add{" "}
          <span className="text-highlight">{user.email}</span>.
        </div>
      )}
    </ArcadeFrame>
  );
}
