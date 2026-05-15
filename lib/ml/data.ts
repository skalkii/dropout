export type Dataset = {
  xs: number[][];
  ys: number[];
};

export type Split = {
  train: Dataset;
  val: Dataset;
};

function gaussian(): number {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function makeSpirals(
  perClass = 200,
  noise = 0.2,
  classes = 2,
): Dataset {
  const xs: number[][] = [];
  const ys: number[] = [];
  for (let c = 0; c < classes; c++) {
    for (let i = 0; i < perClass; i++) {
      const r = (i / perClass) * 5;
      const t =
        ((1.75 * i) / perClass) * 2 * Math.PI +
        (c * 2 * Math.PI) / classes +
        gaussian() * noise;
      xs.push([r * Math.sin(t), r * Math.cos(t)]);
      ys.push(c);
    }
  }
  return shuffle({ xs, ys });
}

export function makeCircles(perClass = 200, noise = 0.1): Dataset {
  const xs: number[][] = [];
  const ys: number[] = [];
  for (let c = 0; c < 2; c++) {
    const r = c === 0 ? 1 : 2.2;
    for (let i = 0; i < perClass; i++) {
      const t = (i / perClass) * 2 * Math.PI;
      xs.push([r * Math.cos(t) + gaussian() * noise, r * Math.sin(t) + gaussian() * noise]);
      ys.push(c);
    }
  }
  return shuffle({ xs, ys });
}

export function shuffle(ds: Dataset): Dataset {
  const idx = ds.xs.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return {
    xs: idx.map((i) => ds.xs[i]),
    ys: idx.map((i) => ds.ys[i]),
  };
}

export function trainValSplit(ds: Dataset, valFrac = 0.25): Split {
  const cut = Math.floor(ds.xs.length * (1 - valFrac));
  return {
    train: { xs: ds.xs.slice(0, cut), ys: ds.ys.slice(0, cut) },
    val: { xs: ds.xs.slice(cut), ys: ds.ys.slice(cut) },
  };
}
