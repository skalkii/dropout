"use client";

import "uplot/dist/uPlot.min.css";

import * as Comlink from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";
import uPlot, { type AlignedData, type Options } from "uplot";
import { spawnTrainer, type TrainerHandle } from "@/lib/ml/workerClient";
import { readThemeColor } from "@/lib/viz/decisionBoundary";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";

const EPOCHS = 200;

export function OverfitCurves() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<uPlot | null>(null);
  const dataRef = useRef<AlignedData>([[], [], []]);
  const trainerRef = useRef<TrainerHandle | null>(null);
  const [hidden, setHidden] = useState(64);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const buildPlot = useCallback(() => {
    if (!hostRef.current) return;
    plotRef.current?.destroy();
    const rect = hostRef.current.getBoundingClientRect();
    const axisColor = readThemeColor("--color-muted", "#857f76");
    const gridColor = readThemeColor("--color-border", "#e0dbcf");
    const trainColor = "#4a6b8a";
    const valColor = readThemeColor("--color-accent", "#b85638");
    const opts: Options = {
      width: Math.max(280, Math.floor(rect.width)),
      height: 240,
      padding: [12, 16, 8, 16],
      legend: { show: true, live: false },
      scales: { x: { time: false }, y: { auto: true } },
      axes: [
        {
          stroke: axisColor,
          grid: { stroke: gridColor },
          ticks: { stroke: gridColor },
          font: "10px ui-monospace, monospace",
          label: "epoch",
          labelFont: "10px ui-monospace, monospace",
        },
        {
          stroke: axisColor,
          grid: { stroke: gridColor },
          ticks: { stroke: gridColor },
          font: "10px ui-monospace, monospace",
          label: "loss",
          labelFont: "10px ui-monospace, monospace",
        },
      ],
      series: [
        { label: "epoch" },
        { label: "train", stroke: trainColor, width: 1.75 },
        {
          label: "validation",
          stroke: valColor,
          width: 1.75,
          dash: [4, 4],
        },
      ],
    };
    plotRef.current = new uPlot(opts, dataRef.current, hostRef.current);
  }, []);

  const reset = useCallback(async () => {
    const handle = trainerRef.current;
    if (!handle) return;
    handle.proxy.stop();
    setEpoch(0);
    dataRef.current = [[], [], []];
    plotRef.current?.setData(dataRef.current);
    await handle.proxy.setup(
      { hiddenLayers: 4, hiddenUnits: hidden },
      { type: "spirals", perClass: 150, noise: 0.2, valFrac: 0.3 },
    );
  }, [hidden]);

  useEffect(() => {
    let cancelled = false;
    const handle = spawnTrainer();
    trainerRef.current = handle;
    (async () => {
      buildPlot();
      await handle.proxy.setup(
        { hiddenLayers: 4, hiddenUnits: hidden },
        { type: "spirals", perClass: 150, noise: 0.2, valFrac: 0.3 },
      );
      if (cancelled) return;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      handle.proxy.stop();
      handle.proxy.dispose();
      handle.terminate();
      trainerRef.current = null;
      plotRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hostRef.current) return;
    const obs = new ResizeObserver(() => {
      if (!hostRef.current || !plotRef.current) return;
      const w = Math.max(280, Math.floor(hostRef.current.getBoundingClientRect().width));
      plotRef.current.setSize({ width: w, height: 240 });
    });
    obs.observe(hostRef.current);
    return () => obs.disconnect();
  }, []);

  const handleTrain = async () => {
    if (running || !trainerRef.current) return;
    await reset();
    setRunning(true);
    try {
      await trainerRef.current.proxy.train(
        EPOCHS,
        32,
        EPOCHS + 1, // never snapshot
        Comlink.proxy((u) => {
          const xs = dataRef.current[0] as number[];
          const ts = dataRef.current[1] as number[];
          const vs = dataRef.current[2] as number[];
          xs.push(u.epoch + 1);
          ts.push(u.loss);
          vs.push(u.valLoss);
          plotRef.current?.setData(dataRef.current);
          setEpoch(u.epoch + 1);
        }),
        Comlink.proxy(() => {}),
        null,
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <figure className="not-prose my-12 rounded-md border border-border bg-panel/60 p-5">
      <p className="sr-only">
        Interactive demo. A live line chart of two losses plotted across
        training epochs. The solid blue line is training loss and falls
        monotonically; the dashed coral line is validation loss and, past a
        certain epoch, starts climbing back up. The gap between the two
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
