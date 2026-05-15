import * as tf from "@tensorflow/tfjs";

export type ModelConfig = {
  hiddenLayers?: number;
  hiddenUnits?: number;
  dropout?: number;
  inputNoiseStddev?: number;
  l2?: number;
  inputDim?: number;
  outputUnits?: number;
};

export function buildMLP(cfg: ModelConfig = {}): tf.LayersModel {
  const {
    hiddenLayers = 4,
    hiddenUnits = 64,
    dropout = 0,
    inputNoiseStddev = 0,
    l2 = 0,
    inputDim = 2,
    outputUnits = 1,
  } = cfg;

  const reg = l2 > 0 ? tf.regularizers.l2({ l2 }) : undefined;
  const model = tf.sequential();

  if (inputNoiseStddev > 0) {
    model.add(
      tf.layers.gaussianNoise({
        inputShape: [inputDim],
        stddev: inputNoiseStddev,
      }),
    );
    model.add(
      tf.layers.dense({
        units: hiddenUnits,
        activation: "relu",
        kernelRegularizer: reg,
      }),
    );
  } else {
    model.add(
      tf.layers.dense({
        inputShape: [inputDim],
        units: hiddenUnits,
        activation: "relu",
        kernelRegularizer: reg,
      }),
    );
  }
  if (dropout > 0) model.add(tf.layers.dropout({ rate: dropout }));

  for (let i = 1; i < hiddenLayers; i++) {
    model.add(
      tf.layers.dense({
        units: hiddenUnits,
        activation: "relu",
        kernelRegularizer: reg,
      }),
    );
    if (dropout > 0) model.add(tf.layers.dropout({ rate: dropout }));
  }

  model.add(
    tf.layers.dense({
      units: outputUnits,
      activation: outputUnits === 1 ? "sigmoid" : "softmax",
    }),
  );

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: outputUnits === 1 ? "binaryCrossentropy" : "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}
