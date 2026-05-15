# Dropout

> Watch a neural network overfit, then watch it dream.

A small interactive essay about why we dream. It walks through Erik Hoel's
**Overfitted Brain Hypothesis** — the idea that biological dreams exist
because brains, like neural networks, can over-memorize their daily
experience, and that dreams are nature's way of jolting the brain back
toward generalization.

You don't just read about it. You scroll through a five-act essay, train
a small neural network in your browser, watch it overfit, then watch
"dream-like" perturbations (dropout, input noise, augmentation) restore
its ability to generalize.

Everything runs locally in your browser. Nothing is uploaded anywhere. No
account, no API keys, no backend.

---

## Table of contents

- [What you need before you start](#what-you-need-before-you-start)
- [Run it on your computer](#run-it-on-your-computer)
- [How to test it](#how-to-test-it)
- [Editing the essay text](#editing-the-essay-text)
- [Deploying it for free](#deploying-it-for-free)
- [Common problems](#common-problems)
- [Project layout for the curious](#project-layout-for-the-curious)

---

## What you need before you start

You need three things on your computer. If you've never set up a web
project before, do these once and you're set for everything else too.

### 1. Node.js (version 20 or newer)

Node is the program that runs the website code on your laptop. To check
if you already have a recent enough version, open a terminal and run:

```bash
node -v
```

If it prints something like `v20.x.x` or higher, you're good. If not,
download the latest "LTS" version from <https://nodejs.org> and install
it.

### 2. pnpm (the package manager this project uses)

pnpm fetches and installs all the supporting libraries the project needs.
Once you have Node, install pnpm by running:

```bash
npm install -g pnpm
```

Verify with:

```bash
pnpm -v
```

You should see something like `9.x` or `11.x`.

### 3. A code editor

Anything works. **VS Code** is the most common: <https://code.visualstudio.com>.

---

## Run it on your computer

Open a terminal in the project folder (the one with this README in it).
Run two commands.

### Step 1: Install the libraries

```bash
pnpm install
```

This downloads everything the project needs into a folder called
`node_modules/`. It takes about a minute the first time. You only need to
do this once (or whenever someone updates the project).

### Step 2: Start the development server

```bash
pnpm dev
```

You should see something like:

```
▲ Next.js 16.x.x (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 1.2s
```

### Step 3: Open the site

Open your browser to <http://localhost:3000>. You should see the essay
load with a warm cream background, a coral accent color, and the title
"Dropout." in large serif type.

To stop the server, go back to the terminal and press `Ctrl + C`.

---

## How to test it

Here's a quick walkthrough of what to check. Each interactive demo trains
a real neural network in your browser — you should see things happen, not
just static text.

### 1. The first paint

- The page should look warm and quiet — cream background in light mode,
  warm dark grey in dark mode (the page auto-matches your operating
  system theme).
- The favicon (the tiny image in your browser tab) should be four orange
  dots wired in a small graph pattern.
- Scroll a little. The browser tab title should say "Dropout —
  Watch a neural network overfit, then watch it dream."

### 2. Act I — the spiral classifier

Scroll down to **Act I**. You'll see a square canvas with two
interlocking spirals of dots (one slate-blue, one coral).

- Click **Train**.
- Watch the epoch counter climb (1 → 200).
- Around epoch 5–10 you should start to see a gradient tint appear
  *under* the dots — that's the network's prediction boundary.
- By the end the boundary will be very tightly wrapped around each dot
  — a sort of jagged, ornate shape. **That's overfitting.**
- Click **Reset** to clear and start over.
- Click **Stop** mid-run to pause early.

### 3. Act II — the loss curves

Scroll down to **Act II**. You'll see an empty chart with axes.

- Click **Train**. Two lines draw in real time:
  - A solid slate-blue line (training loss).
  - A dashed coral line (validation loss).
- They start together and fall together. After a while, the coral line
  turns and starts going **back up**. That's the network getting worse
  on new data while it's still memorizing the data it was trained on.
- Drag the **hidden units** slider up to 128 and Train again. The gap
  between the two lines should be visibly bigger.
- Drag it down to 8 and Train. The gap should be much smaller.

### 4. Act IV — teaching the network to dream

Scroll down to **Act IV**. You'll see the same spiral classifier from
Act I — same network, same data — but with three new toggles below.

- Click **Train** with all toggles off. The boundary will be jagged,
  just like in Act I.
- Click **Reset**, then turn on **Dropout** (or any of the three
  toggles). Click **Train** again.
- The boundary will come out **smoother** — the network learned a more
  generalizable shape.
- Try different combinations. All three toggles on with the sliders
  cranked up will produce the smoothest boundary.

### 5. Mobile

- Open your browser's developer tools (`F12` or `⌘+Option+I`) and
  toggle the device toolbar. Set the width to 360 pixels.
- A small notice appears above the hero saying the demos were designed
  for wider screens but still work.
- The layout collapses to a single column, the text scales down
  gracefully, the buttons stay tappable.

### 6. Dark mode

- Switch your operating system theme from light to dark.
- The page should swap to a warm dark grey background with the same
  coral accent automatically — no toggle button required.

### 7. Sanity-check the console

- Open developer tools → Console tab.
- Reload the page. There should be **no red errors**.
- One yellow `metadataBase ... using "http://localhost:3000"` message
  in development is expected and harmless — it goes away in production
  when you set `NEXT_PUBLIC_SITE_URL`.

---

## Editing the essay text

The essay lives in one file: `app/page.tsx`. It's split into five sections,
called **Acts I through V**. Each act is wrapped in `<Act>...</Act>` and
contains some prose plus an interactive demo.

- The prose text is plain HTML inside `<Prose>...</Prose>` blocks.
- To edit a sentence, find it in `app/page.tsx` and change it.
- The dev server will hot-reload automatically — you don't need to
  restart anything. Just save the file and the browser will refresh.

The two acts that explicitly need a writer's hand are **Act III** (the
main 600–800 word philosophical exposition) and **Act V** (the closing
reflection). They've been pre-filled with a first draft, but they're the
sections most worth a human editing pass. Search the file for
`act-3` or `act-5` to jump to them.

---

## Deploying it for free

### Option A: Vercel (recommended, easiest)

Vercel is the company behind Next.js. They host static sites for free
forever, no credit card needed.

1. Create a free account at <https://vercel.com> (sign in with GitHub).
2. Push this project to a new GitHub repository (any name).
3. In Vercel, click **Add New → Project** and pick your repo.
4. Vercel auto-detects Next.js — just click **Deploy**.
5. After about a minute you get a public URL like
   `https://dropout-yourname.vercel.app`.

**One environment variable to set** (in the Vercel project settings →
Environment Variables):

| Key                    | Value                                             |
| ---------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | The public URL Vercel gave you (with `https://`)  |

This makes social-media previews (Twitter, LinkedIn, etc.) use the
correct absolute URL for the preview image. Optional, but recommended.

### Option B: GitHub Pages, Netlify, Cloudflare Pages, your own server

The site is fully static — there's no backend.

```bash
pnpm build
```

This produces a folder called `out/`. Upload its contents to any
static-file host. Done.

---

## Common problems

### "command not found: pnpm"

You haven't installed pnpm yet. Run:

```bash
npm install -g pnpm
```

### "Port 3000 is already in use"

Something else is on port 3000. Either close that program, or run dev
on a different port:

```bash
pnpm dev -- --port 3001
```

Then visit <http://localhost:3001>.

### The demo says "warming up tensorflow…" forever

This usually means TensorFlow.js couldn't initialize WebGL in your
browser. Try a Chromium-based browser (Chrome, Edge, Brave, Arc). The
project will automatically fall back to a slower CPU backend if WebGL
isn't available, but the fallback takes a few extra seconds.

### "ERR_PNPM_IGNORED_BUILDS"

Old installs of `pnpm-workspace.yaml` may complain about ignored build
scripts for `sharp` and `unrs-resolver`. The file is already configured
to allow them. If you still see the error, delete `node_modules/` and
the `pnpm-lock.yaml` file, then run `pnpm install` again.

### Page is blank / nothing loads

Open developer tools and check the Console tab for red errors. If you
see any, copy the message and check it against the
[issues tab on GitHub](https://github.com/skalkii/dropout/issues) (once
you've pushed your fork there).

---

## Project layout for the curious

You don't need to know any of this to run or edit the site, but if you
want to poke at the code:

```
app/
  page.tsx                   The whole essay (Acts I–V + Hero + Footer)
  layout.tsx                 Fonts, metadata, social preview
  globals.css                Color palette + typography rules
  opengraph-image.tsx        Generates the social-preview PNG at build time
  icon.svg                   The favicon

  components/
    Act.tsx                  Section wrapper with the Act-number eyebrow
    Prose.tsx                Styling for paragraphs and links
    ProgressRail.tsx         The sticky 1/2/3/4/5 indicator on the left
    Math.tsx                 KaTeX wrapper for the one equation in Act II

    demos/
      SpiralClassifier.tsx   Act I demo — train and watch overfitting
      OverfitCurves.tsx      Act II demo — live loss curves
      DreamingNetwork.tsx    Act IV demo — toggles for dropout/noise/augment
      index.tsx              Lazy-loads the three above so the first paint
                             doesn't wait for TensorFlow.js

    ui/
      Button.tsx, Slider.tsx, Toggle.tsx

lib/
  ml/
    data.ts                  Generates the synthetic spiral dataset
    model.ts                 Builds the small neural network
    train.ts                 The training loop with per-epoch callbacks
    augment.ts               Adds noise / rotation / scale jitter to data

  viz/
    decisionBoundary.ts      Samples the model on a grid and paints to canvas
```

## License

Pick one before publishing. Common choices: MIT (permissive), CC BY-NC
(non-commercial), or no license at all (default copyright — others
can't legally reuse it).

---

## Acknowledgements

- Erik Hoel's original paper: *The overfitted brain: Dreams evolved to
  assist generalization* (Patterns, 2021).
- Andy Clark's *Surfing Uncertainty* for the predictive-processing
  vocabulary.
- The TensorFlow.js team for making in-browser ML possible.
- claude.ai for the warmer-than-the-internet design language this
  project leans into.
