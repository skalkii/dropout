"use client";

import * as Comlink from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";
import { spawnTrainer, type TrainerHandle } from "@/lib/ml/workerClient";
import {
  paintBoundary,
  paintPoints,
  readThemeColor,
} from "@/lib/viz/decisionBoundary";
import { Button } from "../ui/Button";

const BOUNDS = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const RES = 80;
const EPOCHS = 200;

export function SpiralClassifier() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trainerRef = useRef<TrainerHandle | null>(null);
  const pointsRef = useRef<{ xs: number[][]; ys: number[] } | null>(null);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [valLoss, setValLoss] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);

  const paint = useCallback((probs: Float32Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grid = {
      width: RES,
      height: RES,
      ...BOUNDS,
      probs,
    };
    ctx.fillStyle = readThemeColor("--color-bg-elev", "#ffffff");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    paintBoundary(ctx, grid);
    const pts = pointsRef.current;
    if (pts) paintPoints(ctx, pts.xs, pts.ys, BOUNDS);
  }, []);

  const setup = useCallback(async () => {
    const handle = trainerRef.current;
    if (!handle) return;
    await handle.proxy.setup(
      { hiddenLayers: 4, hiddenUnits: 64 },
      { type: "spirals", perClass: 150, noise: 0.2, valFrac: 0.25 },
    );
    pointsRef.current = await handle.proxy.getTrainPoints();
    const probs = await handle.proxy.predictGrid(RES, BOUNDS);
    paint(probs);
  }, [paint]);

  const reset = useCallback(async () => {
    if (!trainerRef.current) return;
    trainerRef.current.proxy.stop();
    setEpoch(0);
    setLoss(null);
    setValLoss(null);
    await setup();
  }, [setup]);

  useEffect(() => {
    let cancelled = false;
    const handle = spawnTrainer();
    trainerRef.current = handle;
    (async () => {
      await handle.proxy.setup(
        { hiddenLayers: 4, hiddenUnits: 64 },
        { type: "spirals", perClass: 150, noise: 0.2, valFrac: 0.25 },
      );
      pointsRef.current = await handle.proxy.getTrainPoints();
      const probs = await handle.proxy.predictGrid(RES, BOUNDS);
      if (cancelled) return;
      paint(probs);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      handle.proxy.stop();
      handle.proxy.dispose();
      handle.terminate();
      trainerRef.current = null;
    };
  }, [paint]);

  const handleTrain = async () => {
    if (running || !trainerRef.current) return;
    setRunning(true);
    try {
      await trainerRef.current.proxy.train(
        EPOCHS,
        32,
        5,
        Comlink.proxy((u) => {
          setEpoch(u.epoch + 1);
          setLoss(u.loss);
          setValLoss(u.valLoss);
        }),
        Comlink.proxy((probs: Float32Array) => {
          paint(probs);
        }),
        { resolution: RES, bounds: BOUNDS },
      );
    } finally {
      setRunning(false);
    }
  };

  const handleStop = () => {
    trainerRef.current?.proxy.stop();
  };

  return (
    <figure className="not-prose my-12 rounded-md border border-border bg-panel/60 p-5">
      <p className="sr-only">
        Interactive demo. A four-layer neural network is trained on a noisy
        two-class spiral pattern entirely in your browser. Pressing Train
        starts a 200-epoch run; the network&apos;s predicted decision
        boundary appears as a colored gradient under the data points and
        updates every five epochs. With no regularization the boundary
        becomes ornate and tightly wrapped around each training point —
        the visual signature of overfitting.
      </p>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-border bg-background">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Decision boundary of a small neural network trained on a two-class spiral dataset"
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-xs font-mono uppercase tracking-widest text-muted">
            warming up tensorflow…
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {!running ? (
            <Button onClick={handleTrain} disabled={!ready}>
              Train
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleStop}>
              Stop
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => void reset()}
            disabled={running || !ready}
          >
            Reset
          </Button>
        </div>

        <dl className="flex gap-5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <Stat label="epoch" value={`${epoch}/${EPOCHS}`} />
          <Stat label="loss" value={loss?.toFixed(3) ?? "—"} />
          <Stat label="val" value={valLoss?.toFixed(3) ?? "—"} />
        </dl>
      </div>

      <figcaption className="mt-3 text-sm text-muted">
        A four-layer MLP fits a noisy two-class spiral. With 200 epochs and no
        regularization the boundary will twist around every training point.
        That ornate fit is the failure mode.
      </figcaption>
    </figure>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt>{label}</dt>
      <dd className="text-foreground tabular-nums">{value}</dd>
    </div>
  );
}
