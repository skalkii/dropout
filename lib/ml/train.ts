import * as tf from "@tensorflow/tfjs";
import type { Dataset } from "./data";

export type EpochUpdate = {
  epoch: number;
  loss: number;
  valLoss: number;
  acc?: number;
  valAcc?: number;
};

export type TrainOptions = {
  epochs?: number;
  batchSize?: number;
  onEpoch?: (u: EpochUpdate) => void;
  onSnapshot?: (model: tf.LayersModel, epoch: number) => Promise<void> | void;
  snapshotEvery?: number;
  shouldStop?: () => boolean;
};

export async function train(
  model: tf.LayersModel,
  trainSet: Dataset,
  valSet: Dataset,
  opts: TrainOptions = {},
): Promise<void> {
  const {
    epochs = 200,
    batchSize = 32,
    onEpoch,
    onSnapshot,
    snapshotEvery = 5,
    shouldStop,
  } = opts;

  const xTrain = tf.tensor2d(trainSet.xs);
  const yTrain = tf.tensor2d(trainSet.ys.map((y) => [y]));
  const xVal = tf.tensor2d(valSet.xs);
  const yVal = tf.tensor2d(valSet.ys.map((y) => [y]));

  try {
    await model.fit(xTrain, yTrain, {
      epochs,
      batchSize,
      validationData: [xVal, yVal],
      shuffle: true,
      verbose: 0,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          if (!logs) return;
          const u: EpochUpdate = {
            epoch,
            loss: Number(logs.loss ?? 0),
            valLoss: Number(logs.val_loss ?? 0),
            acc: logs.acc != null ? Number(logs.acc) : undefined,
            valAcc: logs.val_acc != null ? Number(logs.val_acc) : undefined,
          };
          onEpoch?.(u);
          if (onSnapshot && (epoch + 1) % snapshotEvery === 0) {
            await onSnapshot(model, epoch);
          }
          if (shouldStop?.()) model.stopTraining = true;
          await tf.nextFrame();
        },
      },
    });
  } finally {
    xTrain.dispose();
    yTrain.dispose();
    xVal.dispose();
    yVal.dispose();
  }
}
