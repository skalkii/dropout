import type { Dataset } from "./data";

export type AugmentConfig = {
  noiseSigma?: number;
  rotateRadians?: number;
  scaleJitter?: number;
};

function gaussian(): number {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function augment(ds: Dataset, cfg: AugmentConfig = {}): Dataset {
  const { noiseSigma = 0, rotateRadians = 0, scaleJitter = 0 } = cfg;
  const xs = ds.xs.map((row) => {
    let [x, y] = row;
    if (scaleJitter > 0) {
      const s = 1 + (Math.random() * 2 - 1) * scaleJitter;
      x *= s;
      y *= s;
    }
    if (rotateRadians > 0) {
      const t = (Math.random() * 2 - 1) * rotateRadians;
      const cos = Math.cos(t);
      const sin = Math.sin(t);
      [x, y] = [x * cos - y * sin, x * sin + y * cos];
    }
    if (noiseSigma > 0) {
      x += gaussian() * noiseSigma;
      y += gaussian() * noiseSigma;
    }
    return [x, y];
  });
  return { xs, ys: ds.ys.slice() };
}
