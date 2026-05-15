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
import { Slider } from "../ui/Slider";
import { Toggle } from "../ui/Toggle";

const BOUNDS = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const RES = 80;
const EPOCHS = 150;

export function DreamingNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trainerRef = useRef<TrainerHandle | null>(null);
  const pointsRef = useRef<{ xs: number[][]; ys: number[] } | null>(null);
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

  const paint = useCallback((probs: Float32Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grid = { width: RES, height: RES, ...BOUNDS, probs };
    ctx.fillStyle = readThemeColor("--color-bg-elev", "#ffffff");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    paintBoundary(ctx, grid);
    const pts = pointsRef.current;
    if (pts)
      paintPoints(ctx, pts.xs.slice(0, 300), pts.ys.slice(0, 300), BOUNDS);
  }, []);

  const setup = useCallback(async () => {
    const handle = trainerRef.current;
    if (!handle) return;
    await handle.proxy.setup(
      {
        hiddenLayers: 4,
        hiddenUnits: 64,
        dropout: useDropout ? dropout : 0,
        inputNoiseStddev: useNoise ? noise : 0,
      },
      {
        type: "spirals",
        perClass: 150,
        noise: 0.2,
        valFrac: 0.25,
        augmentCopies: useAugment ? 2 : 0,
        augmentCfg: useAugment
          ? { noiseSigma: 0.2, rotateRadians: 0.32, scaleJitter: 0.1 }
          : undefined,
      },
    );
    pointsRef.current = await handle.proxy.getTrainPoints();
    const probs = await handle.proxy.predictGrid(RES, BOUNDS);
    paint(probs);
  }, [paint, dropout, noise, useAugment, useDropout, useNoise]);

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
        {
          hiddenLayers: 4,
          hiddenUnits: 64,
          dropout: useDropout ? dropout : 0,
          inputNoiseStddev: useNoise ? noise : 0,
        },
        {
          type: "spirals",
          perClass: 150,
          noise: 0.2,
          valFrac: 0.25,
          augmentCopies: useAugment ? 2 : 0,
          augmentCfg: useAugment
            ? { noiseSigma: 0.2, rotateRadians: 0.32, scaleJitter: 0.1 }
            : undefined,
        },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    if (running) return;
    queueMicrotask(() => {
      void reset();
    });
  }, [useDropout, useNoise, useAugment, dropout, noise, ready, running, reset]);

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

  const anyDream = useDropout || useNoise || useAugment;

  return (
    <figure className="not-prose my-12 rounded-md border border-border bg-panel/60 p-5">
      <p className="sr-only">
        Interactive demo. The same network and dataset as the Act I spiral
        classifier, but with three toggles for dream-like regularization
        techniques: dropout (randomly silencing neurons), input noise
        (perturbing inputs with gaussian static), and augmentation (training
        on rotated and scaled variants of the data). Each toggle is a
        structural analogue to a property of biological dreaming. Toggling
        any combination rebuilds the network and resets training; pressing
        Train re-fits the model and the previously baroque decision boundary
        smooths into a more generalizable shape.
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
            <Button
              variant="ghost"
              onClick={() => trainerRef.current?.proxy.stop()}
            >
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
