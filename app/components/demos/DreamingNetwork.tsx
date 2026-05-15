"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import {
  makeSpirals,
  shuffle,
  trainValSplit,
  type Dataset,
  type Split,
} from "@/lib/ml/data";
import { augment } from "@/lib/ml/augment";
import { buildMLP, safeDispose } from "@/lib/ml/model";
import { train } from "@/lib/ml/train";
import {
  computeBoundary,
  paintBoundary,
  paintPoints,
  readThemeColor,
} from "@/lib/viz/decisionBoundary";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { Toggle } from "../ui/Toggle";

const BOUNDS = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const RES = 80;
const EPOCHS = 150;

export function DreamingNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const splitRef = useRef<Split | null>(null);
  const baseRef = useRef<Dataset | null>(null);
  const stopRef = useRef(false);
  const initializedRef = useRef(false);

  const [useDropout, setUseDropout] = useState(false);
  const [dropout, setDropout] = useState(0.2);
  const [useNoise, setUseNoise] = useState(false);
  const [noise, setNoise] = useState(0.1);
  const [useAugment, setUseAugment] = useState(false);

  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [valLoss, setValLoss] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);

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
    paintPoints(ctx, split.train.xs.slice(0, 300), split.train.ys.slice(0, 300), BOUNDS);
  }, []);

  const reset = useCallback(async () => {
    stopRef.current = true;
    modelRef.current = safeDispose(modelRef.current);
    if (!baseRef.current) baseRef.current = makeSpirals(150, 0.2);

    let trainSet = baseRef.current;
    if (useAugment) {
      const dreamA = augment(baseRef.current, {
        noiseSigma: 0.15,
        rotateRadians: 0.25,
        scaleJitter: 0.08,
      });
      const dreamB = augment(baseRef.current, {
        noiseSigma: 0.25,
        rotateRadians: 0.4,
        scaleJitter: 0.12,
      });
      trainSet = shuffle({
        xs: [...baseRef.current.xs, ...dreamA.xs, ...dreamB.xs],
        ys: [...baseRef.current.ys, ...dreamA.ys, ...dreamB.ys],
      });
    }
    splitRef.current = trainValSplit(trainSet, 0.25);

    modelRef.current = buildMLP({
      hiddenLayers: 4,
      hiddenUnits: 64,
      dropout: useDropout ? dropout : 0,
      inputNoiseStddev: useNoise ? noise : 0,
    });

    stopRef.current = false;
    setEpoch(0);
    setLoss(null);
    setValLoss(null);
    await drawBoundary();
  }, [drawBoundary, dropout, noise, useAugment, useDropout, useNoise]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    if (running) return;
    void reset();
  }, [useDropout, useNoise, useAugment, dropout, noise, ready, running, reset]);

  const handleTrain = async () => {
    if (running) return;
    const model = modelRef.current;
    const split = splitRef.current;
    if (!model || !split) return;
    setRunning(true);
    stopRef.current = false;
    try {
      await train(model, split.train, split.val, {
        epochs: EPOCHS,
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

  const anyDream = useDropout || useNoise || useAugment;

  return (
    <figure className="not-prose my-12 rounded-md border border-border bg-panel/60 p-5">
      <p className="sr-only">
        Interactive demo. The same network and dataset as the Act I spiral
        classifier, but with three toggles for dream-like regularization
        techniques: dropout (randomly silencing neurons), input noise
        (perturbing inputs with gaussian static), and augmentation
        (training on rotated and scaled variants of the data). Each
        toggle is a structural analogue to a property of biological
        dreaming. Toggling any combination rebuilds the network and
        resets training; pressing Train re-fits the model and the
        previously baroque decision boundary smooths into a more
        generalizable shape.
      </p>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-border bg-background">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Decision boundary of the same spiral classifier, smoothing as dream-like regularization is applied"
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-xs font-mono uppercase tracking-widest text-muted">
            warming up tensorflow…
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Toggle
          label="Dropout"
          description="Quiet random neurons each step. Analogue: the random neural silencing of sleep."
          checked={useDropout}
          onChange={setUseDropout}
          disabled={running}
        />
        <Toggle
          label="Input noise"
          description="Jitter every input. Analogue: hypnagogic imagery, the static behind closed eyes."
          checked={useNoise}
          onChange={setUseNoise}
          disabled={running}
        />
        <Toggle
          label="Augmentation"
          description="Train on rotated and scaled variants. Analogue: dreams remixing the day's events."
          checked={useAugment}
          onChange={setUseAugment}
          disabled={running}
        />
      </div>

      {(useDropout || useNoise) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {useDropout && (
            <Slider
              label="dropout rate"
              value={dropout}
              min={0.05}
              max={0.5}
              step={0.05}
              onChange={setDropout}
              format={(v) => v.toFixed(2)}
              disabled={running}
            />
          )}
          {useNoise && (
            <Slider
              label="noise σ"
              value={noise}
              min={0.05}
              max={0.5}
              step={0.05}
              onChange={setNoise}
              format={(v) => v.toFixed(2)}
              disabled={running}
            />
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {!running ? (
            <Button onClick={handleTrain} disabled={!ready}>
              {anyDream ? "Train (with dreams)" : "Train"}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => (stopRef.current = true)}>
              Stop
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              void reset();
            }}
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
        Same network, same data. Toggle a dream — any one of the three — and
        train again. The boundary unkinks, the validation loss settles, and
        the network starts seeing the world instead of memorising it.
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
