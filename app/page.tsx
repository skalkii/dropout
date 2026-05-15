import { Act } from "./components/Act";
import { Logo } from "./components/Logo";
import { Prose } from "./components/Prose";
import { ProgressRail } from "./components/ProgressRail";
import { InlineMath } from "./components/Math";
import {
  DreamingNetwork,
  OverfitCurves,
  SpiralClassifier,
} from "./components/demos";

export default function Home() {
  return (
    <>
      <ProgressRail />
      <main
        id="top"
        className="mx-auto w-full max-w-5xl px-5 pt-16 sm:px-6 lg:px-12 lg:pt-20"
      >
        <NarrowScreenNotice />
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
            <p>
              The argument turns on a peculiar property of any system that
              learns from experience. Such a system must extract regularities
              from a finite, noisy sample and then apply those regularities to
              a future it has not yet seen. The danger — call it the curse of
              intelligence — is that the more flexible the learner, the more
              easily it learns the noise along with the signal. A student who
              memorizes every example in their textbook will fail an exam
              built from new ones. A network trained too long on its training
              set will fit every datapoint and generalize nothing. The brain,
              Hoel argues, is exactly such a system, and faces exactly this
              problem.
            </p>
            <p>
              The standard responses in neuroscience have framed dreaming as
              memory consolidation, threat simulation, emotional processing,
              or epiphenomenal noise from the housekeeping work of sleep.
              None has held up cleanly against the breadth of dream
              phenomenology — the bizarreness, the recombinations of
              unrelated experiences, the half-faces, the impossible
              architectures, the persistent thematic concerns. There is a
              tension in the consolidation view in particular: if dreams are
              about storing or rehearsing experience, why are they so
              unfaithful to it? Why is the dreaming brain so determined to
              mangle the very experiences it is supposed to be preserving?
            </p>
            <p>
              Hoel&apos;s answer is that the mangling is the point.
            </p>
            <p>
              Modern deep networks face the overfitting curse and have grown
              a toolkit to defeat it. <em>Dropout</em> silences random
              neurons during training, forcing the network to build
              representations that cannot rely on any single path through
              the architecture. <em>Noise injection</em> perturbs the inputs
              themselves, teaching the network to ignore variation that does
              not predict the label. <em>Data augmentation</em> generates
              rotated, scaled, distorted variants of the training examples
              so the network sees a wider distribution than was ever in the
              dataset. The three share a structural commitment: that
              learning generalizes better when the learner is forced to
              confront slightly-broken versions of the world it expects.
            </p>
            <p>
              On the Overfitted Brain Hypothesis, biological dreams discharge
              this same structural function. The wild distortions of dream
              content — the sudden topic-shifts, the people who are also
              other people, the geographies that fold in on themselves — are
              precisely the kind of perturbed input a sleeping brain would
              generate if its goal were to prevent its waking circuits from
              over-specializing on the day&apos;s experience. The brain
              dreams in order to keep generalizing.
            </p>
            <p>
              The hypothesis makes specific predictions. Sensory deprivation,
              which narrows the variety of incoming experience, should drive
              the brain to compensate with more vivid imagery — and the
              prisoner&apos;s-cinema reports of solitary confinement, the
              hallucinations of long-haul truckers, and the imagery of
              flotation-tank subjects all fit. Sleep deprivation, which
              cancels the dream-augmentation pass, should impair
              generalization more than rote memory; experimentally, exactly
              that dissociation appears. Children, still building the
              structure of their world, dream proportionally more than
              adults; the elderly, whose models are settled, dream less.
              Even the within-night architecture of REM and non-REM sleep —
              concentrated dreaming late in the cycle, after consolidation
              has done its day&apos;s work — fits the picture of a
              generalization pass that runs once the storage pass is
              complete.
            </p>
            <p>
              None of this proves the hypothesis. The neuroscience of
              dreaming is genuinely contested; the mechanisms of
              generalization in deep networks are themselves an active
              frontier; and a structural analogy between two systems is not,
              on its own, evidence that they evolved for the same reason.
              But the analogy is not idle. It is the kind of structural
              parallel that, in the history of science, has tended to be
              load-bearing. Vision evolved more than once. Wings evolved
              many times. Solutions that work get rediscovered.
            </p>
            <p>
              The reader is now in a position to do something the author
              cannot do on their behalf. Scroll on to Act IV. Train the
              network without dreams; train it with them. Watch the boundary
              smooth. Then ask whether a brain — a hundred billion neurons,
              four hundred million years of selection pressure behind it —
              would really have failed to discover the same trick.
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
            <p>
              The strongest criticism is that the parallel may be too neat.
              Regularization in machine learning runs during training, on
              labelled inputs, against an explicit loss. Dreaming runs
              offline, on no inputs at all, against no obvious objective.
              The brain&apos;s learning rule is not gradient descent in any
              tidy sense, and the cost function it might be minimizing — if
              there is one — does not behave like a deep-network loss. A
              structural analogy is not a mechanistic one, and the gap
              between the two is exactly the gap a future theory will have
              to close.
            </p>
            <p>
              Even granting all of that, something in the framing seems
              worth keeping. Until recently the bizarreness of dreams was
              treated almost universally as a problem — the phenomenon any
              theory of dreaming had to explain away. The Overfitted Brain
              Hypothesis, whatever the eventual verdict on its specifics,
              reframes the bizarreness as evidence <em>of</em> a function
              rather than against one. If dreams were faithful replays,
              they would not work. The distortion is the work.
            </p>
            <p>
              That reframing is the part most likely to survive. The
              structural parallel between a brain that over-specializes on
              the day&apos;s experience and a network that over-specializes
              on its training set is real even if dreaming turns out to do
              something other than fix it. Real enough, anyway, that
              watching a small network overfit and then watching it dream
              feels — to one reader, at least — like looking at the inside
              of an idea.
            </p>
            <p>The rest is yours.</p>
          </Prose>
        </Act>

        <Footer />
      </main>
    </>
  );
}

function NarrowScreenNotice() {
  return (
    <div className="mt-5 hidden rounded-md border border-border bg-panel/70 p-3 text-xs leading-snug text-foreground-soft max-[379px]:block">
      The interactive demos work here, but they were designed for a wider
      screen. For the full experience, open this essay on a tablet or laptop.
    </div>
  );
}

function Hero() {
  return (
    <header className="flex min-h-[88vh] flex-col justify-center py-20 sm:py-24">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
        An interactive essay
      </p>
      <h1 className="mt-6 font-serif text-[clamp(3rem,2rem+8vw,6.5rem)] font-medium leading-[1.02] tracking-[-0.025em] text-foreground">
        Dropout.
      </h1>
      <p className="mt-7 max-w-2xl font-serif text-[clamp(1.15rem,1rem+0.8vw,1.6rem)] leading-snug text-foreground-soft sm:mt-8">
        Watch a neural network overfit, then watch it dream.
      </p>
      <p className="mt-5 max-w-xl text-base text-muted sm:text-[17px]">
        On Erik Hoel&apos;s Overfitted Brain Hypothesis — and what biological
        dreams and machine-learning regularization may have in common.
      </p>
      <p className="mt-10 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        Scroll to begin <span aria-hidden>↓</span>
      </p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-border py-14 text-sm leading-relaxed text-foreground-soft">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <Logo size={28} />
          <p className="mt-4 max-w-xs text-foreground-soft">
            An interactive essay on Erik Hoel&apos;s Overfitted Brain
            Hypothesis.
          </p>
          <p className="mt-5 text-xs text-muted">
            All training runs in your browser. Nothing leaves the page.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Further reading
            </p>
            <ul className="space-y-2.5">
              <li>
                Hoel, E. (2021). <em>The overfitted brain: Dreams evolved
                to assist generalization.</em> Patterns, 2(5).
              </li>
              <li>
                Andy Clark, <em>Surfing Uncertainty</em>. MIT Press, 2016.
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Links
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://playground.tensorflow.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground transition-colors hover:text-accent"
                >
                  TensorFlow.js playground →
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/skalkii/dropout"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground transition-colors hover:text-accent"
                >
                  Source on GitHub →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-12 border-t border-border pt-8 text-xs text-muted">
        © {new Date().getFullYear()} Dropout. Built with Next.js,
        TensorFlow.js, and a serif font.
      </p>
    </footer>
  );
}
