import * as tf from "@tensorflow/tfjs";

export type BoundaryGrid = {
  width: number;
  height: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  probs: Float32Array;
};

export async function computeBoundary(
  model: tf.LayersModel,
  resolution = 80,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number } = {
    xMin: -6,
    xMax: 6,
    yMin: -6,
    yMax: 6,
  },
): Promise<BoundaryGrid> {
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
  return {
    width: resolution,
    height: resolution,
    xMin,
    xMax,
    yMin,
    yMax,
    probs: data,
  };
}

export function paintBoundary(
  ctx: CanvasRenderingContext2D,
  grid: BoundaryGrid,
  palette: { lo: [number, number, number]; hi: [number, number, number] } = {
    lo: [78, 102, 186],
    hi: [201, 168, 106],
  },
): void {
  const { width, height, probs } = grid;
  const cssW = ctx.canvas.width;
  const cssH = ctx.canvas.height;
  const img = ctx.createImageData(cssW, cssH);
  for (let py = 0; py < cssH; py++) {
    const j = Math.floor((py / cssH) * height);
    for (let px = 0; px < cssW; px++) {
      const i = Math.floor((px / cssW) * width);
      const p = probs[j * width + i];
      const r = Math.round(palette.lo[0] + (palette.hi[0] - palette.lo[0]) * p);
      const g = Math.round(palette.lo[1] + (palette.hi[1] - palette.lo[1]) * p);
      const b = Math.round(palette.lo[2] + (palette.hi[2] - palette.lo[2]) * p);
      const idx = (py * cssW + px) * 4;
      img.data[idx] = r;
      img.data[idx + 1] = g;
      img.data[idx + 2] = b;
      img.data[idx + 3] = 90;
    }
  }
  ctx.putImageData(img, 0, 0);
}

export function paintPoints(
  ctx: CanvasRenderingContext2D,
  xs: number[][],
  ys: number[],
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  palette: { lo: [number, number, number]; hi: [number, number, number] } = {
    lo: [78, 102, 186],
    hi: [201, 168, 106],
  },
): void {
  const { xMin, xMax, yMin, yMax } = bounds;
  const cssW = ctx.canvas.width;
  const cssH = ctx.canvas.height;
  for (let i = 0; i < xs.length; i++) {
    const [x, y] = xs[i];
    const px = ((x - xMin) / (xMax - xMin)) * cssW;
    const py = ((y - yMin) / (yMax - yMin)) * cssH;
    const c = ys[i] === 0 ? palette.lo : palette.hi;
    ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
