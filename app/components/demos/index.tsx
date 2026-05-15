"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DemoErrorBoundary } from "../DemoErrorBoundary";

const placeholder = (
  <div
    role="status"
    aria-label="Loading interactive demo"
    className="my-12 flex aspect-square w-full items-center justify-center rounded-md border border-border bg-panel/60 font-mono text-[11px] uppercase tracking-widest text-muted"
  >
    loading demo…
  </div>
);

const SpiralClassifierInner = dynamic(
  () =>
    import("./SpiralClassifier").then((m) => ({ default: m.SpiralClassifier })),
  { ssr: false, loading: () => placeholder },
);

const OverfitCurvesInner = dynamic(
  () =>
    import("./OverfitCurves").then((m) => ({ default: m.OverfitCurves })),
  { ssr: false, loading: () => placeholder },
);

const DreamingNetworkInner = dynamic(
  () =>
    import("./DreamingNetwork").then((m) => ({ default: m.DreamingNetwork })),
  { ssr: false, loading: () => placeholder },
);

function wrap(Inner: ComponentType, label: string) {
  return function Wrapped() {
    return (
      <DemoErrorBoundary demoLabel={label}>
        <Inner />
      </DemoErrorBoundary>
    );
  };
}

export const SpiralClassifier = wrap(SpiralClassifierInner, "spiral classifier");
export const OverfitCurves = wrap(OverfitCurvesInner, "overfit curves");
export const DreamingNetwork = wrap(DreamingNetworkInner, "dreaming network");
