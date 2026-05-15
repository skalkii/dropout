"use client";

import "uplot/dist/uPlot.min.css";

import { useCallback, useEffect, useRef, useState } from "react";
import uPlot, { type AlignedData, type Options } from "uplot";
import * as tf from "@tensorflow/tfjs";
import { makeSpirals, trainValSplit, type Split } from "@/lib/ml/data";
import { buildMLP, safeDispose } from "@/lib/ml/model";
import { train } from "@/lib/ml/train";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";

const EPOCHS = 200;

export function OverfitCurves() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<uPlot | null>(null);
  const dataRef = useRef<AlignedData>([[], [], []]);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const splitRef = useRef<Split | null>(null);
  const stopRef = useRef(false);
  const [hidden, setHidden] = useState(64);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const buildPlot = useCallback(() => {
    if (!hostRef.current) return;
    plotRef.current?.destroy();
    const rect = hostRef.current.getBoundingClientRect();
    const opts: Options = {
      width: Math.max(320, Math.floor(rect.width)),
      height: 220,
      padding: [10, 16, 8, 16],
      legend: { show: true, live: false },
      scales: {
        x: { time: false },
        y: { auto: true },
      },
      axes: [
        {
          stroke: "#8b8a86",
          grid: { stroke: "#1f2440" },
          ticks: { stroke: "#1f2440" },
          font: "10px ui-monospace, monospace",
          label: "epoch",
          labelFont: "10px ui-monospace, monospace",
        },
        {
          stroke: "#8b8a86",
          grid: { stroke: "#1f2440" },
          ticks: { stroke: "#1f2440" },
          font: "10px ui-monospace, monospace",
          label: "loss",
          labelFont: "10px ui-monospace, monospace",
        },
      ],
      series: [
        { label: "epoch" },
        {
          label: "train",
          stroke: "#7ab48b",
          width: 1.5,
        },
        {
          label: "validation",
          stroke: "#c9a86a",
          width: 1.5,
          dash: [4, 4],
        },
      ],
    };
    plotRef.current = new uPlot(opts, dataRef.current, hostRef.current);
  }, []);

  const reset = useCallback(() => {
    stopRef.current = true;
    modelRef.current = safeDispose(modelRef.current);
    modelRef.current = buildMLP({
      hiddenLayers: 4,
      hiddenUnits: hidden,
    });
    splitRef.current = trainValSplit(makeSpirals(150, 0.2), 0.3);
    stopRef.current = false;
    setEpoch(0);
    dataRef.current = [[], [], []];
    plotRef.current?.setData(dataRef.current);
  }, [hidden]);

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
      buildPlot();
      reset();
      setReady(true);
    })();
    return () => {
      cancelled = true;
      stopRef.current = true;
      plotRef.current?.destroy();
      modelRef.current = safeDispose(modelRef.current);
    };
  }, [buildPlot, reset]);

  useEffect(() => {
    if (!hostRef.current) return;
    const obs = new ResizeObserver(() => {
      if (!hostRef.current || !plotRef.current) return;
      const w = Math.max(320, Math.floor(hostRef.current.getBoundingClientRect().width));
      plotRef.current.setSize({ width: w, height: 220 });
    });
    obs.observe(hostRef.current);
    return () => obs.disconnect();
  }, []);

  const handleTrain = async () => {
    if (running) return;
    reset();
    setRunning(true);
    stopRef.current = false;
    const model = modelRef.current!;
    const split = splitRef.current!;
    try {
      await train(model, split.train, split.val, {
        epochs: EPOCHS,
        batchSize: 32,
        shouldStop: () => stopRef.current,
        onEpoch: (u) => {
          const xs = dataRef.current[0] as number[];
          const ts = dataRef.current[1] as number[];
          const vs = dataRef.current[2] as number[];
          xs.push(u.epoch + 1);
          ts.push(u.loss);
          vs.push(u.valLoss);
          plotRef.current?.setData(dataRef.current);
          setEpoch(u.epoch + 1);
        },
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <figure className="not-prose my-12 rounded-md border border-border bg-panel/60 p-5">
      <p className="sr-only">
        Interactive demo. A live line chart of two losses plotted across
        training epochs. The solid green line is training loss and falls
        monotonically; the dashed gold line is validation loss and, past
        a certain epoch, starts climbing back up. The gap between the two
        lines is the magnitude of overfitting. The hidden-units slider
        rebuilds the network at the chosen width; wider networks produce
        wider gaps.
      </p>
      <div
        ref={hostRef}
        className="w-full"
        role="img"
        aria-label="Live line chart of training loss and validation loss across epochs. As the network overfits, training loss continues to fall while validation loss rises."
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Slider
          label="hidden units per layer"
          value={hidden}
          min={8}
          max={128}
          step={8}
          onChange={setHidden}
          disabled={running}
        />
        <div className="flex gap-2">
          {!running ? (
            <Button onClick={handleTrain} disabled={!ready}>
              Train
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => (stopRef.current = true)}>
              Stop
            </Button>
          )}
          <Button variant="ghost" onClick={reset} disabled={running || !ready}>
            Reset
          </Button>
        </div>
      </div>

      <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">
        epoch {epoch}/{EPOCHS}
      </p>

      <figcaption className="mt-2 text-sm text-muted">
        Train loss falls. Validation loss falls — then turns around. The gap
        between the two curves <em>is</em> overfitting. Widen the network and
        the gap widens with it.
      </figcaption>
    </figure>
  );
}
