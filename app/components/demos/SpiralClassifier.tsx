"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { makeSpirals, trainValSplit, type Split } from "@/lib/ml/data";
import { buildMLP, safeDispose } from "@/lib/ml/model";
import { train } from "@/lib/ml/train";
import {
  computeBoundary,
  paintBoundary,
  paintPoints,
  readThemeColor,
} from "@/lib/viz/decisionBoundary";
import { Button } from "../ui/Button";

const BOUNDS = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const RES = 80;

export function SpiralClassifier() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const splitRef = useRef<Split | null>(null);
  const stopRef = useRef(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [valLoss, setValLoss] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const epochsTarget = 200;

  const drawBoundary = useCallback(async () => {
    const canvas = canvasRef.current;
    const model = modelRef.current;
    const split = splitRef.current;
    if (!canvas || !model || !split) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grid = await computeBoundary(model, RES, BOUNDS);
    ctx.fillStyle = readThemeColor("--color-bg-elev", "#ffffff");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    paintBoundary(ctx, grid);
    paintPoints(ctx, split.train.xs, split.train.ys, BOUNDS);
  }, []);

  const reset = useCallback(async () => {
    stopRef.current = true;
    modelRef.current = safeDispose(modelRef.current);
    modelRef.current = buildMLP({ hiddenLayers: 4, hiddenUnits: 64 });
    splitRef.current = trainValSplit(makeSpirals(150, 0.2), 0.25);
    stopRef.current = false;
    setEpoch(0);
    setLoss(null);
    setValLoss(null);
    await drawBoundary();
  }, [drawBoundary]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await tf.setBackend("webgl");
      } catch {
        await tf.setBackend("cpu");
      }
      await tf.ready();
      if (cancelled) return;
      await reset();
      setReady(true);
    })();
    return () => {
      cancelled = true;
      stopRef.current = true;
      modelRef.current = safeDispose(modelRef.current);
    };
  }, [reset]);

  const handleTrain = async () => {
    const model = modelRef.current;
    const split = splitRef.current;
    if (!model || !split || running) return;
    setRunning(true);
    stopRef.current = false;
    try {
      await train(model, split.train, split.val, {
        epochs: epochsTarget,
        batchSize: 32,
        snapshotEvery: 5,
        shouldStop: () => stopRef.current,
        onEpoch: (u) => {
          setEpoch(u.epoch + 1);
          setLoss(u.loss);
          setValLoss(u.valLoss);
        },
        onSnapshot: async () => {
          await drawBoundary();
        },
      });
      await drawBoundary();
    } finally {
      setRunning(false);
    }
  };

  const handleStop = () => {
    stopRef.current = true;
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
          <Button variant="ghost" onClick={reset} disabled={running || !ready}>
            Reset
          </Button>
        </div>

        <dl className="flex gap-5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <Stat label="epoch" value={`${epoch}/${epochsTarget}`} />
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
