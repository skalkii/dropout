"use client";

import dynamic from "next/dynamic";

const placeholder = (
  <div
    role="status"
    aria-label="Loading interactive demo"
    className="my-12 flex aspect-square w-full items-center justify-center rounded-md border border-border bg-panel/60 font-mono text-[11px] uppercase tracking-widest text-muted"
  >
    loading demo…
  </div>
);

export const SpiralClassifier = dynamic(
  () =>
    import("./SpiralClassifier").then((m) => ({ default: m.SpiralClassifier })),
  { ssr: false, loading: () => placeholder },
);

export const OverfitCurves = dynamic(
  () =>
    import("./OverfitCurves").then((m) => ({ default: m.OverfitCurves })),
  { ssr: false, loading: () => placeholder },
);

export const DreamingNetwork = dynamic(
  () =>
    import("./DreamingNetwork").then((m) => ({ default: m.DreamingNetwork })),
  { ssr: false, loading: () => placeholder },
);
