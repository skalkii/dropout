import type { ReactNode } from "react";

type ActProps = {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
};

export function Act({ id, number, title, children }: ActProps) {
  const roman = ["I", "II", "III", "IV", "V"][number - 1] ?? String(number);
  return (
    <section
      id={id}
      data-act={id}
      className="scroll-mt-24 border-t border-border py-24 md:py-32"
    >
      <header className="mx-auto mb-12 max-w-prose">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Act {roman}
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </header>
      <div className="mx-auto max-w-prose">{children}</div>
    </section>
  );
}
