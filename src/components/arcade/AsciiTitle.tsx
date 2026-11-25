const LINE_ONE = [
  " █████╗   ██╗     ███████╗██╗   ██╗███████╗██╗     ",
  "██╔══██╗  ██║     ██╔════╝██║   ██║██╔════╝██║     ",
  "███████║  ██║     █████╗  ██║   ██║█████╗  ██║     ",
  "██╔══██║  ██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ",
  "██║  ██║  ███████╗███████╗ ╚████╔╝ ███████╗███████╗",
  "╚═╝  ╚═╝  ╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝",
].join("\n");

const LINE_TWO = [
  " █████╗ ██████╗ ██╗   ██╗███████╗███╗   ██╗████████╗██╗   ██╗██████╗ ███████╗███████╗",
  "██╔══██╗██╔══██╗██║   ██║██╔════╝████╗  ██║╚══██╔══╝██║   ██║██╔══██╗██╔════╝██╔════╝",
  "███████║██║  ██║██║   ██║█████╗  ██╔██╗ ██║   ██║   ██║   ██║██████╔╝█████╗  ███████╗",
  "██╔══██║██║  ██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ██║   ██║██╔══██╗██╔══╝  ╚════██║",
  "██║  ██║██████╔╝ ╚████╔╝ ███████╗██║ ╚████║   ██║   ╚██████╔╝██║  ██║███████╗███████║",
  "╚═╝  ╚═╝╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝",
].join("\n");

export function AsciiTitle({
  schoolName,
  tagline,
  logoUrl,
}: {
  schoolName?: string | undefined;
  tagline?: string | null | undefined;
  logoUrl?: string | null | undefined;
}) {
  const subtitle = schoolName ? (tagline || `at ${schoolName}`) : "in the Liverpool City Region";
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${schoolName ?? "School"} logo`}
          className="mb-3 max-h-20 max-w-[60%] object-contain"
        />
      ) : null}
      <pre
        aria-hidden
        className="text-accent font-mono leading-[1.05] font-bold whitespace-pre"
        style={{ fontSize: "min(1.9vw, 12px)" }}
      >
        {LINE_ONE}
      </pre>
      <pre
        aria-hidden
        className="text-primary font-mono leading-[1.05] font-bold whitespace-pre"
        style={{ fontSize: "min(1.12vw, 12px)" }}
      >
        {LINE_TWO}
      </pre>
      <h1 className="sr-only">A Level Adventures {subtitle}</h1>
      <p
        aria-hidden
        className="font-display text-highlight pixel-shadow mt-2 text-[0.6rem] tracking-[0.35em] uppercase sm:text-xs"
      >
        {subtitle}
      </p>
    </div>
  );
}
