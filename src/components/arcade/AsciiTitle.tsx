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

export function AsciiTitle() {
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
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
      <h1 className="sr-only">A Level Adventures in the LCR</h1>
      <p
        aria-hidden
        className="font-display text-highlight pixel-shadow mt-2 text-[0.6rem] tracking-[0.35em] uppercase sm:text-xs"
      >
        in the LCR
      </p>
    </div>
  );
}
