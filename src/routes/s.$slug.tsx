import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { TitleScreen } from "@/components/school/TitleScreen";
import { getSchool } from "@/lib/school.functions";
import { safeColour, useSchool } from "@/lib/school";

export const Route = createFileRoute("/s/$slug")({
  loader: async ({ params }) => {
    const school = await getSchool({ data: { slug: params.slug.toLowerCase() } }).catch(() => null);
    if (!school) throw notFound();
    return school;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `A Level Adventures at ${loaderData.name}`
      : "School not found — A Level Adventures";
    const description = loaderData
      ? `Explore where your A levels at ${loaderData.name} could take you in the Liverpool City Region.`
      : "This school page isn't available.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SchoolTitle,
});

function SchoolTitle() {
  const school = Route.useLoaderData();
  const { setSchool } = useSchool();
  useEffect(() => setSchool(school), [school, setSchool]);
  const bg = safeColour(school.colours.background);
  return (
    <div style={bg ? { backgroundColor: bg } : undefined}>
      <TitleScreen school={school} />
    </div>
  );
}
