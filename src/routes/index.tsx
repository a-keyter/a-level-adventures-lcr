import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { TitleScreen } from "@/components/school/TitleScreen";
import { useSchool } from "@/lib/school";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Level Adventures in the LCR" },
      {
        name: "description",
        content:
          "A retro choose-your-own-adventure: pick your A levels and discover research projects that match the Liverpool City Region's real economic needs.",
      },
      { property: "og:title", content: "A Level Adventures in the LCR" },
      {
        property: "og:description",
        content:
          "Pick your A levels and unlock multi-disciplinary research projects rooted in Liverpool City Region skills priorities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GenericTitle,
});

function GenericTitle() {
  const { setSchool } = useSchool();
  useEffect(() => setSchool(null), [setSchool]);
  return <TitleScreen school={null} />;
}
