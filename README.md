# Dropout

> Watch a neural network overfit, then watch it dream.

An interactive philosophical essay on Erik Hoel's **Overfitted Brain
Hypothesis** — the claim that biological dreams exist because brains, like
neural networks, are prone to overfitting on daily experience, and that
dream imagery is a form of biological data augmentation that forces
generalization.

The site lets the reader *feel the equivalence*: a small neural network is
trained in their browser, watched as it overfits, and then watched as
"dream-like" perturbations (dropout, input noise, augmentation) restore its
ability to generalize.

Everything — training, prediction, decision-boundary rendering — happens
client-side. No backend, no API calls, nothing leaves the page.

## Stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 16, App Router, **static export**           |
| Language    | TypeScript                                          |
| Styling     | Tailwind CSS v4 (CSS variables via `@theme inline`) |
| ML          | TensorFlow.js (`@tensorflow/tfjs`)                  |
| Charts      | uPlot (fast live-updating loss curves)              |
| Math        | KaTeX (server-rendered, zero client JS for math)    |
| Deployment  | Any static host — Vercel, GitHub Pages, Netlify     |

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Build

```bash
pnpm build
```

Static output is written to `out/`. Upload that directory anywhere.

## Project layout

```
app/
  page.tsx                    The single-page essay
  layout.tsx                  Fonts, metadata, OG card
  opengraph-image.tsx         Build-time-generated 1200x630 social image
  components/
    Act.tsx, Prose.tsx, ProgressRail.tsx, Math.tsx
    demos/
      SpiralClassifier.tsx    Act 1 — train + decision boundary
      OverfitCurves.tsx       Act 2 — live train/val loss
      DreamingNetwork.tsx     Act 4 — dropout/noise/augment toggles
    ui/
      Button.tsx, Slider.tsx, Toggle.tsx
lib/
  ml/
    data.ts     Synthetic 2D datasets (spirals, circles)
    model.ts    tf.sequential MLP builder
    augment.ts  Noise injection + rotate/scale jitter
    train.ts    Async training loop with per-epoch callbacks
  viz/
    decisionBoundary.ts  Grid sampler + canvas painter
```

## Author placeholders

Two acts are stubs and need long-form prose from the author:

- `app/page.tsx` — search for `{{ACT_3_PROSE}}` (main 600–800 word
  philosophical exposition of the Hoel hypothesis)
- `app/page.tsx` — search for `{{ACT_5_PROSE}}` (closing reflection)

Each placeholder is wrapped in a visually distinct dashed panel so it's
obvious in the rendered page that prose is missing.

## Design decisions worth flagging

- **Dark mode only for v1.** The topic is dreams — the palette leans into
  midnight indigo and warm off-white. A light-mode toggle is a sensible
  v1.1 addition but is not implemented.
- **Training runs on the main thread.** The spec called for a Web Worker.
  For the network sizes used here (~10K parameters, ~400 samples, ~200
  epochs) the `await tf.nextFrame()` yield at each epoch keeps the UI
  responsive; moving to OffscreenCanvas + WebGL-in-worker added more
  complexity than it bought. Easy to retrofit later.
- **Hoel is paraphrased, not quoted.** Safer for copyright; the
  hypothesis is summarized in the author's own voice.

## Deploy

### Vercel

```bash
vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` to the production URL so the absolute OG image
URL is correct in social previews.

### GitHub Pages / any static host

```bash
pnpm build
# upload ./out
```

## Further reading

- Hoel, E. (2021). *The overfitted brain: Dreams evolved to assist
  generalization.* Patterns, 2(5).
- Andy Clark, *Surfing Uncertainty*. MIT Press, 2016.
- [TensorFlow Playground](https://playground.tensorflow.org/)
