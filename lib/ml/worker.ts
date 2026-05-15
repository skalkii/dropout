/// <reference lib="webworker" />

import * as Comlink from "comlink";
import * as tf from "@tensorflow/tfjs";
import { buildMLP, safeDispose, type ModelConfig } from "./model";
import { augment, type AugmentConfig } from "./augment";
import { makeSpirals, shuffle, trainValSplit, type Dataset } from "./data";

export type DataConfig = {
  type: "spirals";
  perClass: number;
  noise: number;
  classes?: number;
  valFrac: number;
  augmentCopies?: number;
  augmentCfg?: AugmentConfig;
};

export type EpochUpdate = {
  epoch: number;
  loss: number;
  valLoss: number;
  acc?: number;
  valAcc?: number;
};

class TrainerImpl {
  private model: tf.LayersModel | null = null;
  private trainSet: Dataset | null = null;
  private valSet: Dataset | null = null;
  private stopFlag = false;

  async setup(modelCfg: ModelConfig, dataCfg: DataConfig): Promise<void> {
    try {
      await tf.setBackend("webgl");
    } catch {
      await tf.setBackend("cpu");
    }
    await tf.ready();

    let base: Dataset;
    if (dataCfg.type === "spirals") {
      base = makeSpirals(dataCfg.perClass, dataCfg.noise, dataCfg.classes ?? 2);
    } else {
      base = makeSpirals(dataCfg.perClass, dataCfg.noise);
    }

    let train = base;
    if (dataCfg.augmentCopies && dataCfg.augmentCopies > 0 && dataCfg.augmentCfg) {
      const xs: number[][] = [...base.xs];
      const ys: number[] = [...base.ys];
      for (let i = 0; i < dataCfg.augmentCopies; i++) {
        const a = augment(base, dataCfg.augmentCfg);
        xs.push(...a.xs);
        ys.push(...a.ys);
      }
      train = shuffle({ xs, ys });
    }

    const split = trainValSplit(train, dataCfg.valFrac);
    this.trainSet = split.train;
    this.valSet = split.val;

    this.model = safeDispose(this.model) as unknown as tf.LayersModel | null;
    this.model = buildMLP(modelCfg);
    this.stopFlag = false;
  }

  async train(
    epochs: number,
    batchSize: number,
    snapshotEvery: number,
    onEpoch: (u: EpochUpdate) => void,
    onSnapshot: (probs: Float32Array, epoch: number) => void,
    boundary: { resolution: number; bounds: { xMin: number; xMax: number; yMin: number; yMax: number } } | null,
  ): Promise<void> {
    if (!this.model || !this.trainSet || !this.valSet) return;
    this.stopFlag = false;

    const xT = tf.tensor2d(this.trainSet.xs);
    const yT = tf.tensor2d(this.trainSet.ys.map((y) => [y]));
    const xV = tf.tensor2d(this.valSet.xs);
    const yV = tf.tensor2d(this.valSet.ys.map((y) => [y]));

    try {
      await this.model.fit(xT, yT, {
        epochs,
        batchSize,
        validationData: [xV, yV],
        shuffle: true,
        verbose: 0,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            if (!logs) return;
            onEpoch({
              epoch,
              loss: Number(logs.loss ?? 0),
              valLoss: Number(logs.val_loss ?? 0),
              acc: logs.acc != null ? Number(logs.acc) : undefined,
              valAcc: logs.val_acc != null ? Number(logs.val_acc) : undefined,
            });
            if (
              boundary &&
              this.model &&
              (epoch + 1) % snapshotEvery === 0
            ) {
              const probs = await this.computeBoundary(
                this.model,
                boundary.resolution,
                boundary.bounds,
              );
              onSnapshot(probs, epoch);
            }
            if (this.stopFlag) (this.model as tf.LayersModel).stopTraining = true;
            await tf.nextFrame();
          },
        },
      });
      if (boundary && this.model) {
        const probs = await this.computeBoundary(
          this.model,
          boundary.resolution,
          boundary.bounds,
        );
        onSnapshot(probs, epochs - 1);
      }
    } finally {
      xT.dispose();
      yT.dispose();
      xV.dispose();
      yV.dispose();
    }
  }

  stop(): void {
    this.stopFlag = true;
  }

  async predictGrid(
    resolution: number,
    bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  ): Promise<Float32Array> {
    if (!this.model) return new Float32Array(0);
    return this.computeBoundary(this.model, resolution, bounds);
  }

  getTrainPoints(): { xs: number[][]; ys: number[] } | null {
    if (!this.trainSet) return null;
    return { xs: this.trainSet.xs, ys: this.trainSet.ys };
  }

  dispose(): void {
    this.stopFlag = true;
    this.model = safeDispose(this.model) as unknown as tf.LayersModel | null;
    this.trainSet = null;
    this.valSet = null;
  }

  private async computeBoundary(
    model: tf.LayersModel,
    resolution: number,
    bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  ): Promise<Float32Array> {
    const { xMin, xMax, yMin, yMax } = bounds;
    const cells: number[][] = new Array(resolution * resolution);
    let k = 0;
    for (let j = 0; j < resolution; j++) {
      const y = yMin + ((yMax - yMin) * j) / (resolution - 1);
      for (let i = 0; i < resolution; i++) {
        const x = xMin + ((xMax - xMin) * i) / (resolution - 1);
        cells[k++] = [x, y];
      }
    }
    const input = tf.tensor2d(cells);
    const out = model.predict(input) as tf.Tensor;
    const data = (await out.data()) as Float32Array;
    input.dispose();
    out.dispose();
    return data;
  }
}

export type Trainer = TrainerImpl;

Comlink.expose(new TrainerImpl());
