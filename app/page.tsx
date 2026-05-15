import { Act } from "./components/Act";
import { Prose } from "./components/Prose";
import { ProgressRail } from "./components/ProgressRail";

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
              and failed to silence: <em>why do we dream?</em> The bizarre
              imagery, the recombinations, the half-faces — none of it looks
              like memory consolidation, and none of it pays its evolutionary
              rent in any obvious way.
            </p>
            <p>
              Hoel&apos;s answer borrows a vocabulary from machine learning. A
              student who memorizes every practice question fails the real
              exam. A network that minimizes training loss without restraint
              fits noise as eagerly as signal. The brain, Hoel argues, has
              the same problem and has evolved the same kind of fix.
            </p>
            <p className="text-muted italic">
              [Interactive demo: SpiralClassifier — coming next commit]
            </p>
          </Prose>
        </Act>

        <Act id="act-2" number={2} title="What Networks Forget">
          <Prose>
            <p>
              A network&apos;s training loss and its validation loss tell two
              different stories. The first keeps falling. The second, past a
              certain point, starts climbing. The gap between them is the
              shape of overfitting.
            </p>
            <p className="text-muted italic">
              [Interactive demo: OverfitCurves — coming]
            </p>
          </Prose>
        </Act>

        <Act id="act-3" number={3} title="The Hoel Hypothesis">
          <Prose>
            <p className="text-muted italic">{`{{ACT_3_PROSE}}`}</p>
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
            <p className="text-muted italic">
              [Interactive demo: DreamingNetwork — coming]
            </p>
          </Prose>
        </Act>

        <Act id="act-5" number={5} title="What This Means (And Doesn't)">
          <Prose>
            <p className="text-muted italic">{`{{ACT_5_PROSE}}`}</p>
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
        <li>Andy Clark, <em>Surfing Uncertainty</em>.</li>
        <li>
          The TensorFlow.js spiral example —{" "}
          <a
            href="https://playground.tensorflow.org/"
            className="text-accent underline underline-offset-4"
          >
            playground.tensorflow.org
          </a>
          .
        </li>
      </ul>
    </footer>
  );
}
