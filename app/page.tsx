import { Act } from "./components/Act";
import { Prose } from "./components/Prose";
import { ProgressRail } from "./components/ProgressRail";
import { InlineMath } from "./components/Math";
import { SpiralClassifier } from "./components/demos/SpiralClassifier";
import { OverfitCurves } from "./components/demos/OverfitCurves";
import { DreamingNetwork } from "./components/demos/DreamingNetwork";

export default function Home() {
  return (
    <>
      <ProgressRail />
      <main className="mx-auto w-full max-w-3xl px-6 md:px-8">
        <Hero />

        <Act
          id="act-1"
          number={1}
          title="The Brain That Remembered Too Much"
        >
          <Prose>
            <p>
              Erik Hoel begins with a question every neuroscientist has tried
              and failed to silence: <em>why do we dream?</em> The imagery is
              bizarre, the recombinations are sloppy, the half-faces look like
              nothing in particular. None of it pays its evolutionary rent in
              any obvious way, and after a century of careful science the
              field is still arguing about whether dreams do <em>anything</em>.
            </p>
            <p>
              Hoel&apos;s answer borrows a vocabulary from machine learning. A
              student who memorizes every practice question fails the real
              exam. A network that minimizes training loss without restraint
              fits noise as eagerly as signal. The brain, Hoel argues, has the
              same problem — and may have evolved the same kind of fix.
            </p>
            <p>
              The demonstration below is the failure mode in miniature. A
              small network is asked to separate two interlocking spirals.
              Give it too much capacity and too many epochs and the boundary
              becomes ornate, baroque, tortured — a curve that hugs every
              training point at the cost of any generality at all.
            </p>
          </Prose>
          <SpiralClassifier />
        </Act>

        <Act id="act-2" number={2} title="What Networks Forget">
          <Prose>
            <p>
              Training a model means showing it labeled examples and adjusting
              its weights so its predictions get closer to the answers. The
              quantity it tries to minimize is a <em>loss</em> — for a binary
              classifier, the binary cross-entropy:
            </p>
            <p className="text-center text-base text-foreground/95">
              <InlineMath tex="\\;\mathcal{L} \;=\; -\frac{1}{N}\sum_{i=1}^{N}\Big[ y_i \log \hat{y}_i + (1-y_i)\log(1-\hat{y}_i) \Big]\;" />
            </p>
            <p>
              That number falls steadily on the data the network was shown.
              The interesting question is what happens to the same loss on
              data the network has <em>not</em> seen — the validation set.
              For a healthy network, the two curves track each other. For an
              overfitting one, they part ways: training loss keeps dropping
              while validation loss bottoms out and starts climbing back.
            </p>
            <p>
              Widen the network and the gap widens with it. Capacity that
              isn&apos;t restrained gets spent on memorization.
            </p>
          </Prose>
          <OverfitCurves />
        </Act>

        <Act id="act-3" number={3} title="The Hoel Hypothesis">
          <Prose>
            <p>
              So far the argument has been mechanical. Networks overfit;
              regularization stops them. The leap Hoel asks the reader to
              consider is whether the brain, faced with a structurally
              identical problem, may have arrived at a structurally identical
              solution — and that this solution is what we experience, every
              night, as dreaming.
            </p>
            <p className="rounded-sm border border-dashed border-border/70 bg-panel/40 p-4 font-mono text-xs uppercase tracking-widest text-muted">
              {`{{ACT_3_PROSE}}`} — author to write the main 600–800 word
              philosophical exposition here. Paraphrase rather than direct
              quote where possible.
            </p>
          </Prose>
        </Act>

        <Act id="act-4" number={4} title="Teaching the Network to Dream">
          <Prose>
            <p>
              The same network that memorized its training set can be coaxed
              back into generality. The intervention has names — dropout,
              noise injection, augmentation — but the structure is uniform.
              Inject a controlled hallucination. Let the network see a world
              that is almost-but-not-quite the world it knows. Watch the
              decision boundary smooth.
            </p>
            <p>
              Each technique below is offered as a structural analogue to a
              property of biological dreaming. The point is not that the
              brain runs dropout in REM sleep. The point is that the
              <em> shape </em>of the fix — perturb the input or the
              representation just enough to force generalisation — appears
              in both systems, and may be the reason both systems work at
              all.
            </p>
          </Prose>
          <DreamingNetwork />
        </Act>

        <Act id="act-5" number={5} title="What This Means (And Doesn't)">
          <Prose>
            <p>
              The analogy is suggestive, not proof. The Overfitted Brain
              Hypothesis is contested; the neuroscience of dreaming is
              unsettled; and the way deep networks generalize is itself
              still under active investigation.
            </p>
            <p className="rounded-sm border border-dashed border-border/70 bg-panel/40 p-4 font-mono text-xs uppercase tracking-widest text-muted">
              {`{{ACT_5_PROSE}}`} — author to write the closing reflection
              here.
            </p>
          </Prose>
        </Act>

        <Footer />
      </main>
    </>
  );
}

function Hero() {
  return (
    <header className="flex min-h-[80vh] flex-col justify-center py-24">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        An interactive essay
      </p>
      <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
        Dropout.
      </h1>
      <p className="mt-8 max-w-xl text-xl leading-relaxed text-foreground/85 md:text-2xl">
        Watch a neural network overfit, then watch it dream.
      </p>
      <p className="mt-6 max-w-xl text-muted">
        On Erik Hoel&apos;s Overfitted Brain Hypothesis — and what biological
        dreams and machine-learning regularization may have in common.
      </p>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-widest text-muted">
        Scroll to begin →
      </p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-16 text-sm text-muted">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Further reading
      </p>
      <ul className="space-y-2">
        <li>
          Hoel, E. (2021). <em>The overfitted brain: Dreams evolved to assist
          generalization.</em> Patterns, 2(5).
        </li>
        <li>Andy Clark, <em>Surfing Uncertainty</em>. MIT Press, 2016.</li>
        <li>
          The TensorFlow.js playground —{" "}
          <a
            href="https://playground.tensorflow.org/"
            className="text-accent underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            playground.tensorflow.org
          </a>
          .
        </li>
      </ul>
      <p className="mt-8 text-xs text-muted">
        All training runs in your browser. Nothing leaves the page.
      </p>
    </footer>
  );
}
