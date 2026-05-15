"use client";

import { useEffect, useState } from "react";

type ActMeta = { id: string; title: string };

const ACTS: ActMeta[] = [
  { id: "act-1", title: "The Brain That Remembered Too Much" },
  { id: "act-2", title: "What Networks Forget" },
  { id: "act-3", title: "The Hoel Hypothesis" },
  { id: "act-4", title: "Teaching the Network to Dream" },
  { id: "act-5", title: "What This Means (And Doesn't)" },
];

export function ProgressRail() {
  const [active, setActive] = useState<string>(ACTS[0].id);

  useEffect(() => {
    const targets = ACTS.map((a) => document.getElementById(a.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Essay progress"
      className="pointer-events-none fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ol className="space-y-4">
        {ACTS.map((act, i) => {
          const isActive = act.id === active;
          return (
            <li key={act.id}>
              <a
                href={`#${act.id}`}
                className="pointer-events-auto group flex items-center gap-3 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`inline-block h-[2px] rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-10 bg-accent"
                      : "w-5 bg-border-strong/70 group-hover:w-7 group-hover:bg-foreground/40"
                  }`}
                />
                <span className={isActive ? "text-accent" : undefined}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
